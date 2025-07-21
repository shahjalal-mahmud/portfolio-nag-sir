// firestore-scripts/initHeroData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initHeroData() {
  const heroData = {
    name: "ANINDYA NAG",
    profession: "Lecturer, Dept. of Computer Science & Engineering\nNorthern University of Business and Technology Khulna",
    location: "Northern University of Business and Technology Khulna, Khulna-9100, Bangladesh",
    email: "anindyanag@ieee.org",
    phone: "+880 1795617168",
    socialLinks: [
      {
        href: "https://www.linkedin.com/in/anindya-nag-892b19190/",
        icon: "linkedin",
        label: "LinkedIn",
      },
      {
        href: "https://www.researchgate.net/profile/Anindya-Nag-3",
        icon: "researchgate",
        label: "ResearchGate",
      },
      {
        href: "https://scholar.google.com/citations?hl=en&user=V4OLVPAAAAAJ&view_op=list_works",
        icon: "google",
        label: "Google Scholar",
      },
      {
        href: "https://orcid.org/0000-0001-6518-8233",
        icon: "orcid",
        label: "ORCID",
      },
      {
        href: "https://www.scopus.com/authid/detail.uri?authorId=58398246900",
        icon: "database",
        label: "Scopus",
      },
      {
        href: "https://www.webofscience.com/wos/author/record/ITT-5228-2023",
        icon: "book",
        label: "Web of Science",
      },
      {
        href: "https://nubtkhulna.ac.bd/sd/273/Anindya%20Nag",
        icon: "globe",
        label: "Official Website",
      },
      {
        href: "https://github.com/AnindyaNag",
        icon: "github",
        label: "GitHub",
      }, 
      {
        href: "https://anindyanag.netlify.app/",
        icon: "globe",
        label: "Personal Portfolio"
      },
    ]
  };

  try {
    await db.collection("portfolio").doc("hero").set(heroData);
    console.log("✅ Hero data initialized successfully!");
  } catch (error) {
    console.error("Error initializing hero data:", error);
  }
}

initHeroData().then(() => process.exit());