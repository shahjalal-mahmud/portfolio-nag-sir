// firestore-scripts/initTechnicalProgramsData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initTechnicalProgramsData() {
    const technicalProgramsData = [
        {
            name: "ICRTCIS-2025",
            date: "June 2025",
            title: "6th Int. Conf. on Recent Trends in Communication & Intelligent System",
            location: "Jaipur, Rajasthan, India",
            publisher: "Springer, IET",
        }
    ];

    try {
        await db.collection("portfolio").doc("technicalPrograms").set({ items: technicalProgramsData });
        console.log("✅ Technical Programs data initialized successfully!");
    } catch (error) {
        console.error("Error initializing technical programs data:", error);
    }
}

initTechnicalProgramsData().then(() => process.exit());