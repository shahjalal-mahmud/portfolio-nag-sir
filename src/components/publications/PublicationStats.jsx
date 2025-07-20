import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const StatCard = ({ label, value, duration = 3 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration * 60); // frames at 60fps
    let current = start;

    const animate = () => {
      current += increment;
      if (current < end) {
        setCount(Math.floor(current));
        requestAnimationFrame(animate);
      } else {
        setCount(end); // Final value
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect(); // Run once
        }
      },
      { threshold: 0.6 }
    );

    const target = document.getElementById(`stat-${label}`);
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [value, duration, label]);

  return (
    <motion.div
      id={`stat-${label}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center bg-white shadow-md rounded-2xl p-6 w-full sm:w-48"
    >
      <h3 className="text-4xl font-semibold text-blue-600">
        {count}
      </h3>
      <p className="text-sm text-gray-600 text-center mt-2">{label}</p>
    </motion.div>
  );
};


const PublicationStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "publications", "summary");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setStats(docSnap.data());
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="py-24 text-center">Loading...</div>;
  if (!stats) return <div className="py-24 text-center">No data available</div>;

  return (
    <section
      id="publications"
      className="py-24 px-6 md:px-16 bg-base-100 text-gray-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Publication Summary
        </h2>
        <p className="text-gray-600 mb-10">
          As of {stats.as_of_date}. Source:&nbsp;
          <a
            href={stats.google_scholar_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:underline hover:text-blue-800 transition"
          >
            Google Scholar <FaGoogle className="ml-1" />
          </a>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-center">
          <StatCard label="Total Articles" value={stats.total_articles} />
          <StatCard
            label="First/Corresponding Author"
            value={stats.first_author_articles}
          />
          <StatCard label="Citations" value={stats.citations} />
          <StatCard label="H-Index" value={stats.h_index} />
          <StatCard label="i10-Index" value={stats.i10_index} />
        </div>
      </div>
    </section>
  );
};

export default PublicationStats;
