// firestore-scripts/initExperienceData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initExperienceData() {
  const experienceData = [
    {
      title: "Lecturer",
      university: {
        name: "Northern University of Business & Technology Khulna, Khulna-9100, Bangladesh",
        url: "https://nubtkhulna.ac.bd/"
      },
      period: "March 2024 – Ongoing",
      department: "Department of Computer Science and Engineering",
      courses: [
        "Artificial Intelligence and Expert systems",
        "Pattern Recognition",
        "Numerical Methods",
        "Computer Graphics and Multimedia System",
        "Digital Logic Design and more",
      ],
    },
    {
      title: "Adjunct Lecturer",
      university: {
        name: "North Western University, Khulna-9100, Bangladesh",
        url: "https://nwu.ac.bd/"
      },
      period: "January 2023 – February 2024",
      department: "Department of Computer Science and Engineering",
      courses: [
        "Computer Programming",
        "Numerical Analysis",
        "Digital Logic Design",
        "Artificial Intelligence and more",
      ],
    },
  ];

  try {
    await db.collection("portfolio").doc("experience").set({ items: experienceData });
    console.log("✅ Experience data initialized successfully!");
  } catch (error) {
    console.error("Error initializing experience data:", error);
  }
}

initExperienceData().then(() => process.exit());