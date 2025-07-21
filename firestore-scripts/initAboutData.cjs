// firestore-scripts/initAboutData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initAboutData() {
  const aboutData = {
    shortBio: `Anindya Nag obtained an M.Sc. in Computer Science and Engineering from Khulna University in Khulna, Bangladesh, and a B.Tech. in Computer Science and Engineering from Adamas University in Kolkata, India. He is currently a lecturer in the Department of Computer Science and Engineering at the Northern University of Business and Technology in Khulna, Bangladesh.`,
    fullBio: `His research focuses on health informatics, medical Internet of Things, neuroscience, and machine learning. He serves as a reviewer for numerous prestigious journals and international conferences. He has authored and co-authored about 67 publications, including journal articles, conference papers, book chapters, and has co-edited nine books.`,
    contactInfo: {
      position: "Lecturer, NUBTK",
      location: "Shib Bari Circle, Sonadanga, Khulna-9100",
      email: "anindyanag@ieee.org",
      cvLink: "/cv/Anindya_Nag_CV.pdf"
    },
    skills: [
      "Python", "C", "C++", "NumPy", "Pandas", "SciPy", "Matplotlib",
      "LaTex", "MySQL Workbench", "Google Colab", "PyCharm"
    ]
  };

  try {
    await db.collection("portfolio").doc("about").set(aboutData);
    console.log("✅ About data initialized successfully!");
  } catch (error) {
    console.error("Error initializing about data:", error);
  }
}

initAboutData().then(() => process.exit());