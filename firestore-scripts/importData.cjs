const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const publicationsData = require("../src/components/publications/PublicationsData.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function deleteAllData() {
  try {
    console.log("🗑️ Starting deletion of all existing data...");
    
    // List of all collections to clear
    const collections = [
      'publications',
      'edited_books',
      'journal_articles',
      'conference_proceedings',
      'book_chapters'
    ];

    // Delete all documents in each collection
    for (const collectionName of collections) {
      const collectionRef = db.collection(collectionName);
      const snapshot = await collectionRef.get();
      
      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`✅ Deleted all documents from ${collectionName}`);
    }
    
    console.log("🔥 All existing data deleted successfully!");
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error; // Stop the process if deletion fails
  }
}

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

    // Conference Proceedings
    for (const [year, proceedings] of Object.entries(publicationsData.publications.conference_proceedings)) {
      const ref = db.collection("conference_proceedings").doc(year);
      batch.set(ref, { proceedings }); // Fixed variable name to match your structure
    }

    // Book Chapters
    for (const [year, chapters] of Object.entries(publicationsData.publications.book_chapters)) {
      const ref = db.collection("book_chapters").doc(year);
      batch.set(ref, { chapters }); // Fixed variable name to match your structure
    }

    await batch.commit();
    console.log("✅ All data imported successfully!");
  } catch (error) {
    console.error("Import failed:", error);
  }
}

async function run() {
  await deleteAllData();
  await importData();
  process.exit();
}

run();