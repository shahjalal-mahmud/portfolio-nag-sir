// firestore-scripts/initJournalEditorialBoardsData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initJournalEditorialBoardsData() {
    const editorialBoardsData = [];

    try {
        await db.collection("portfolio").doc("journalEditorialBoards").set({ items: editorialBoardsData });
        console.log("✅ Journal Editorial Boards data initialized successfully!");
    } catch (error) {
        console.error("Error initializing journal editorial boards data:", error);
    }
}

initJournalEditorialBoardsData().then(() => process.exit());