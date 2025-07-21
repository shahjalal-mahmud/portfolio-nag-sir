// firestore-scripts/initProjectsData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initProjectsData() {
  const projectsData = [
    {
      title: "Cloud-Based Vehicle Tracking System",
      date: "March 2022 - June 2022",
      description: "Developed an RFID-based parking management system that records vehicle in-time and out-time, provides instant access to car and owner details, supports multiple gate monitoring, and allows easy vehicle tracking through a centralized website.",
      links: [
        { name: "GitHub", url: "https://github.com/AnindyaNag/Project_2_Vehicle-Tracking-Management-System" }
      ]
    },
    {
      title: "Foodazon: Canteen Management System",
      date: "August 2021 - November 2021",
      description: "Developed a canteen management system using Laravel and MySQL to efficiently manage and store records, meeting all operational objectives and expectations."
    },
    {
      title: "Analyze Crop Production of India",
      date: "July 2021 - September 2021",
      description: "As an Intern at Spotle.ai through the NASSCOM Community AI Internship, I analyzed crop production in India, developed a model to predict rice yields, and published an article on 'AI in Agriculture: An Emerging Era in Technology' in the NASSCOM Community.",
      links: [
        { name: "GitHub", url: "https://github.com/AnindyaNag/Project---Analyze-Crop-Production-of-India" },
        { name: "Article", url: "https://community.nasscom.in/communities/agritech/ai-agriculture-emerging-era-technology" }
      ]
    },
    {
      title: "Basic Banking System",
      date: "March 2021 - June 2021",
      description: "As a Web Development & Designing Intern at The Sparks Foundation (GRIP), I developed and hosted a Basic Banking System website using HTML, CSS, and JavaScript, showcasing account-to-account money transfers.",
      links: [
        { name: "GitHub", url: "https://github.com/AnindyaNag/Basic-Banking-System" },
        { name: "Live Demo", url: "https://anindyanag.github.io/Basic-Banking-System/" }
      ]
    },
    {
      title: "Data Science and Business Analytics",
      date: "January 2021 - March 2021",
      description: "As a Data Science & Business Analytics Intern at The Sparks Foundation (GRIP), I developed supervised and unsupervised ML models and conducted exploratory data analysis to optimize retail business strategies.",
      links: [
        { name: "GitHub", url: "https://github.com/AnindyaNag/The-Sparks-Foundation-Data-Science-and-Business-Analytics-Internship-Tasks" }
      ]
    }
  ];

  try {
    await db.collection("portfolio").doc("projects").set({ items: projectsData });
    console.log("✅ Projects data initialized successfully!");
  } catch (error) {
    console.error("Error initializing projects data:", error);
  }
}

initProjectsData().then(() => process.exit());