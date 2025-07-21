// firestore-scripts/initJournalReviewsData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initJournalReviewsData() {
    const journalReviewsData = [
        {
            name: "Pattern Recognition, Elsevier",
            url: "https://www.sciencedirect.com/journal/pattern-recognition",
        },
        {
            name: "IEEE Access, IEEE",
            url: "https://ieeeaccess.ieee.org",
        },
        {
            name: "Transactions on Emerging Telecommunications Technologies, Wiley",
            url: "https://onlinelibrary.wiley.com/journal/21613915",
        },
        {
            name: "Human-Centric Intelligent Systems, Springer",
            url: "https://link.springer.com/journal/44230",
        },
        {
            name: "PLOS Digital Health, PLOS",
            url: "https://journals.plos.org/digitalhealth/",
        },
        {
            name: "Frontiers in Nutrition, Frontiers",
            url: "https://www.frontiersin.org/journals/nutrition",
        },
        {
            name: "Frontiers in Oncology, Frontiers",
            url: "https://www.frontiersin.org/journals/oncology",
        },
        {
            name: "Computer Methods in Biomechanics and Biomedical Engineering, Taylor & Francis",
            url: "https://www.tandfonline.com/journals/gcmb20",
        },
        {
            name: "Artificial Intelligence and Applications, Bon View Publishing",
            url: "https://ojs.bonviewpress.com/index.php/AIA/index",
        },
        {
            name: "International Journal of Computing and Digital Systems, University of Bahrain, Bahrain",
            url: "https://ijcds.uob.edu.bh/",
        },
        {
            name: "Discover Artificial Intelligence, Springer Nature",
            url: "https://link.springer.com/journal/44163",
        },
    ];

    try {
        await db.collection("portfolio").doc("journalReviews").set({ items: journalReviewsData });
        console.log("✅ Journal Reviews data initialized successfully!");
    } catch (error) {
        console.error("Error initializing journal reviews data:", error);
    }
}

initJournalReviewsData().then(() => process.exit());