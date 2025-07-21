// firestore-scripts/initCertificationsData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initCertificationsData() {
  const certificationsData = [
    {
      title: "Introduction to IoT & Cybersecurity",
      provider: "CISCO",
    },
    {
      title: "Advance Your Skills in Deep Learning and Neural Networks",
      provider: "LinkedIn Learning",
    },
    {
      title: "Python for Beginners & Intro to Data Structures & Algorithms",
      provider: "Udemy",
    },
    {
      title: "Excel Skills for Business, Intro to ML, Computer Vision Basics, Python Data Structures",
      provider: "Coursera",
    },
  ];

  try {
    await db.collection("portfolio").doc("certifications").set({ items: certificationsData });
    console.log("✅ Certifications data initialized successfully!");
  } catch (error) {
    console.error("Error initializing certifications data:", error);
  }
}

initCertificationsData().then(() => process.exit());
