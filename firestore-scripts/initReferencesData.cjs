// firestore-scripts/initReferencesData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initReferencesData() {
  const referencesData = [
    {
      name: "Dr. Anupam Kumar Bairagi",
      title: "Professor",
      institution: "Computer Science and Engineering Discipline, Khulna University",
      location: "Khulna-9208, Bangladesh",
      email: "anupam@cse.ku.ac.bd",
      link: "https://ku.ac.bd/discipline/cse/faculty/anupam",
    },
    {
      name: "Dr. C Kishor Kumar Reddy",
      title: "Associate Professor",
      institution: "Department of Computer Science and Engineering, Stanley College of Engineering & Technology for Women",
      location: "Hyderabad, Telangana, India",
      email: "drckkreddy@gmail.com",
    }
  ];

  try {
    await db.collection("portfolio").doc("references").set({ items: referencesData });
    console.log("✅ References data initialized successfully!");
  } catch (error) {
    console.error("Error initializing references data:", error);
  }
}

initReferencesData().then(() => process.exit());