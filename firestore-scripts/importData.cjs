const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const publicationsData = require("../src/components/publications/PublicationsData.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importData() {
  try {
    // 1. Import summary
    await db.collection("publications").doc("summary")
      .set(publicationsData.publications.summary);

    // 2. Import all other data (batched)
    const batch = db.batch();
    
    // Edited books
    for (const [year, books] of Object.entries(publicationsData.publications.edited_books)) {
      const ref = db.collection("edited_books").doc(year);
      batch.set(ref, { books });
    }

    // Journal articles
    for (const [year, articles] of Object.entries(publicationsData.publications.journal_articles)) {
      const ref = db.collection("journal_articles").doc(year);
      batch.set(ref, { articles });
    }

    // Conference Proceedings (fixed variable name)
    for (const [year, proceedings] of Object.entries(publicationsData.publications.conference_proceedings)) {
      const ref = db.collection("conference_proceedings").doc(year);
      batch.set(ref, { proceedings }); // Changed from 'articles' to 'proceedings'
    }

    // Book Chapters (fixed structure)
    for (const [year, chapters] of Object.entries(publicationsData.publications.book_chapters)) {
      const ref = db.collection("book_chapters").doc(year);
      batch.set(ref, { chapters }); // Changed from 'book' to 'chapters'
    }

    await batch.commit();
    console.log("✅ All data imported successfully!");
  } catch (error) {
    console.error("Import failed:", error);
  }
}

importData();