// firestore-scripts/initSkillsData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initSkillsData() {
  const skillsData = [
    {
      title: "Languages",
      content: "English (Full Professional Proficiency), Bangla (Native), Hindi (Limited Working Proficiency)",
      icon: "🌐",
    },
    {
      title: "Programming",
      content: "Python (NumPy, SciPy, Matplotlib, Pandas), C, C++",
      icon: "💻",
    },
    {
      title: "Platforms",
      content: "Visual Studio, Google Collab, Anaconda, PyCharm, Web, Windows, Arduino",
      icon: "🖥️",
    },
    {
      title: "Tools",
      content: "MySQL Workbench",
      icon: "🛠️",
    },
    {
      title: "Document Creation",
      content: "Microsoft Office Suite, LaTeX",
      icon: "📄",
    },
    {
      title: "Soft Skills",
      content: "Teamwork, Leadership, Communication, Project Management, Writing, Time Management",
      icon: "🤝",
    },
  ];

  try {
    await db.collection("portfolio").doc("skills").set({ items: skillsData });
    console.log("✅ Skills data initialized successfully!");
  } catch (error) {
    console.error("Error initializing skills data:", error);
  }
}

initSkillsData().then(() => process.exit());