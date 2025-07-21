// firestore-scripts/initConferenceReviewsData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initConferenceReviewsData() {
    const conferenceReviewsData = [
        {
            name: "WcCST-2026",
            date: "March 2026",
            title: "World Conference on Computational Science & Technology",
            location: "Punjab, India",
            publisher: "IEEE",
        },
        {
            name: "INCSTIC-2025",
            date: "October 2025",
            title: "1st Int. Conf. on Smart Technologies & Intelligent Computing",
            location: "Haryana, India",
            publisher: "CRC Press",
        },
        {
            name: "ICRTCIS-2025",
            date: "June 2025",
            title: "6th Int. Conf. on Recent Trends in Communication & Intelligent System",
            location: "Jaipur, Rajasthan, India",
            publisher: "Springer, IET",
        },
        {
            name: "InCACCT-2025",
            date: "April 2025",
            title: "3rd Int. Conf. on Advancement in Computation & Computer Technologies",
            location: "Jaipur, Rajasthan, India",
            publisher: "IEEE",
        },
        {
            name: "IISU-ASSET-2025",
            date: "March 2025",
            title: "Int. Conf. on AI Systems and Sustainable Technologies",
            location: "Jaipur, India",
            publisher: "Springer",
        },
        {
            name: "STI-2024",
            date: "December 2024",
            title: "6th Int. Conf. on Sustainable Technologies for Industry 5.0",
            location: "Dhaka, Bangladesh",
            publisher: "Springer",
        },
        {
            name: "ICRTAC-2024",
            date: "November 2024",
            title: "7th Int. Conf. on Recent Trends in Advanced Computing",
            location: "Chennai, India",
            publisher: "Springer",
        },
        {
            name: "ICETAI-2024",
            date: "September 2024",
            title: "2nd Int. Conf. on Emerging Trends and Applications in AI",
            location: "Baghdad, Iraq",
            publisher: "IEEE",
        },
        {
            name: "AIBThings-2024",
            date: "September 2024",
            title: "2nd Int. Conf. on AI, Blockchain, and IoT",
            location: "Michigan, USA",
            publisher: "IEEE",
        },
        {
            name: "ICSCPS-2024",
            date: "September 2024",
            title: "Int. Conf. on Smart Cyber-Physical Systems",
            location: "Delhi NCR, India",
            publisher: "IEEE",
        },
        {
            name: "ICCTAC-2024",
            date: "May 2024",
            title: "Int. Conf. on Current Trends in Advanced Computing",
            location: "Bengaluru, India",
            publisher: "Springer",
        },
        {
            name: "ICCCIS-2023",
            date: "November 2023",
            title: "4th Int. Conf. on Computing Communication, and Intelligent Systems",
            location: "Uttar Pradesh, India",
            publisher: "IEEE",
        },
    ];

    try {
        await db.collection("portfolio").doc("conferenceReviews").set({ items: conferenceReviewsData });
        console.log("✅ Conference Reviews data initialized successfully!");
    } catch (error) {
        console.error("Error initializing conference reviews data:", error);
    }
}

initConferenceReviewsData().then(() => process.exit());