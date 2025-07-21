// firestore-scripts/initMembershipsAwardsData.cjs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initMembershipsAwardsData() {
  const membershipsData = [
    {
      organization: "Institute of Electrical and Electronics Engineers (IEEE)",
      period: "From 2023 - Now",
      role: "Graduate Student Member & IEEE Young Professionals",
    },
    {
      organization: "International Association of Engineers (IAENG)",
      period: "From 2023 - Now",
      role: "Professional Member",
    }
  ];

  const awardsData = [
    {
      title: "National Science and Technology (NST) Fellowship",
      session: "Session: 2023-2024",
      description: "Ministry of Science and Technology, Bangladesh",
    },
    {
      title: "Dean's List",
      session: "Session: 2020-2021",
      description: "Awarded the Dean's List Student accolade for exceptional academic performance in the B.Tech (Computer Science Engineering) Program at Adamas University.",
    },
    {
      title: "Merit Scholarship",
      session: "Session: 2020-2021",
      description: "The Adamas University Merit Scholarship for the 2020-2021 session is awarded based on academic performance.",
    }
  ];

  try {
    await db.collection("portfolio").doc("memberships").set({ items: membershipsData });
    await db.collection("portfolio").doc("awards").set({ items: awardsData });
    console.log("✅ Memberships & Awards data initialized successfully!");
  } catch (error) {
    console.error("Error initializing memberships & awards data:", error);
  }
}

initMembershipsAwardsData().then(() => process.exit());