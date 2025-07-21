// firestore-scripts/initEducationData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initEducationData() {
  const educationData = [
    {
      title: "Master of Science in Computer Science & Engineering",
      institution: "Khulna University, Khulna - 9208, Bangladesh",
      url: "https://ku.ac.bd/",
      year: "Jan 2023 – Nov 2024",
      result: "CGPA: 3.96 (Out of 4.00)",
      courses: "Research Methodology & Ethics, Network Optimization, Human-Computer Interaction, Advanced Probability & Statistics, Advanced Software Engineering, Software Evaluation & Maintenance",
    },
    {
      title: "Bachelor of Technology in Computer Science & Engineering",
      institution: "Adamas University, Kolkata - 700126, India",
      url: "https://adamasuniversity.ac.in/",
      year: "Jul 2018 – Jun 2022",
      result: "CGPA: 9.64 (Out of 10)",
      courses: "Programming & Data Structures, Operating Systems, Computer Networks, Database Management, AI, ML, IoT, Computer Vision, Information Retrieval, and more.",
    },
    {
      title: "Higher Secondary Certificate (Science)",
      institution: "Government Brajalal College, Khulna - 9202, Bangladesh",
      url: "https://www.blcollege.edu.bd/",
      year: "May 2014 – Jul 2016",
      result: "GPA: 5.00 (Out of 5.00)",
    },
    {
      title: "Secondary School Certificate (Science)",
      institution: "Damodar M. M. Secondary School, Khulna - 9210, Bangladesh",
      url: "https://www.sohopathi.com/damodar-m-m-high-school/",
      year: "Jan 2012 – Mar 2014",
      result: "GPA: 5.00 (Out of 5.00)",
    }
  ];

  try {
    await db.collection("portfolio").doc("education").set({ items: educationData });
    console.log("✅ Education data initialized successfully!");
  } catch (error) {
    console.error("Error initializing education data:", error);
  }
}

initEducationData().then(() => process.exit());