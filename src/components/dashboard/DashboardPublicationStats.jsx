import { useState, useEffect } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const DashboardPublicationStats = () => {
  const [stats, setStats] = useState({
    total_articles: 0,
    first_author_articles: 0,
    citations: 0,
    h_index: 0,
    i10_index: 0,
    google_scholar_link: "",
    as_of_date: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "publications", "summary");
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setStats(doc.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: name.endsWith("_articles") || name.endsWith("_index") || name === "citations" 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "publications", "summary"), stats);
      alert("Publication stats updated successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update publication stats");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Publication Statistics</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Articles
            </label>
            <input
              type="number"
              name="total_articles"
              value={stats.total_articles}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First/Corresponding Author Articles
            </label>
            <input
              type="number"
              name="first_author_articles"
              value={stats.first_author_articles}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Citations
            </label>
            <input
              type="number"
              name="citations"
              value={stats.citations}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              H-Index
            </label>
            <input
              type="number"
              name="h_index"
              value={stats.h_index}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              i10-Index
            </label>
            <input
              type="number"
              name="i10_index"
              value={stats.i10_index}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Scholar Link
            </label>
            <input
              type="url"
              name="google_scholar_link"
              value={stats.google_scholar_link}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              As of Date
            </label>
            <input
              type="text"
              name="as_of_date"
              value={stats.as_of_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. June 2025"
            />
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Update Statistics
        </motion.button>
      </form>
    </div>
  );
};

export default DashboardPublicationStats;