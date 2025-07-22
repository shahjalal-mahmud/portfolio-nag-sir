import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaGoogle, FaEdit, FaSave } from "react-icons/fa";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from '../../context/useAuth';
import Toast from '../common/Toast';

const StatCard = ({ label, value, duration = 3, isEditing = false, onChange }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isEditing) {
      setCount(value);
      return;
    }

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
  }, [value, duration, label, isEditing]);

  return (
    <motion.div
      id={`stat-${label}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center bg-white shadow-md rounded-2xl p-6 w-full sm:w-48"
    >
      {isEditing ? (
        <input
          type="number"
          value={count}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="text-4xl font-semibold text-blue-600 w-full text-center bg-gray-100 rounded"
        />
      ) : (
        <h3 className="text-4xl font-semibold text-blue-600">{count}</h3>
      )}
      <p className="text-sm text-gray-600 text-center mt-2">{label}</p>
    </motion.div>
  );
};

const PublicationStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [editStats, setEditStats] = useState({
    total_articles: 0,
    first_author_articles: 0,
    citations: 0,
    h_index: 0,
    i10_index: 0,
    google_scholar_link: "",
    as_of_date: ""
  });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 5000);
  };

  useEffect(() => {
    const docRef = doc(db, "publications", "summary");

    if (user) {
      // For admin, use real-time updates
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setStats(data);
          setEditStats(data);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching data:", error);
        showToast('Failed to load publication data', 'error');
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // For public view, just get once
      const fetchData = async () => {
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setStats(docSnap.data());
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          showToast('Failed to load publication data', 'error');
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStats(prev => ({
      ...prev,
      [name]: name.endsWith("_articles") || name.endsWith("_index") || name === "citations"
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleStatChange = (field, value) => {
    setEditStats(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "publications", "summary"), editStats);
      setIsEditing(false);
      showToast('Publication stats updated successfully', 'success');
    } catch (error) {
      console.error("Error updating document:", error);
      showToast('Failed to update publication stats', 'error');
    }
  };

  if (loading) return <div className="py-24 text-center">Loading...</div>;
  if (!stats) return <div className="py-24 text-center">No data available</div>;

  return (
    <section
      id="publications"
      className="py-24 px-6 md:px-16 bg-base-100 text-gray-900 relative"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {user && (
        <div className="absolute top-6 right-6 md:right-16">
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <FaEdit /> Edit
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              <FaSave /> Save
            </motion.button>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Publication Summary
        </h2>

        {isEditing ? (
          <div className="mb-10">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              As of Date
            </label>
            <input
              type="text"
              name="as_of_date"
              value={editStats.as_of_date}
              onChange={handleEditChange}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md mx-auto"
              placeholder="e.g. June 2025"
            />
          </div>
        ) : (
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
        )}

        {isEditing && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Scholar Link
            </label>
            <input
              type="url"
              name="google_scholar_link"
              value={editStats.google_scholar_link}
              onChange={handleEditChange}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md mx-auto"
            />
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-center">
          <StatCard
            label="Total Articles"
            value={isEditing ? editStats.total_articles : stats.total_articles}
            isEditing={isEditing}
            onChange={(value) => handleStatChange('total_articles', value)}
          />
          <StatCard
            label="First/Corresponding Author"
            value={isEditing ? editStats.first_author_articles : stats.first_author_articles}
            isEditing={isEditing}
            onChange={(value) => handleStatChange('first_author_articles', value)}
          />
          <StatCard
            label="Citations"
            value={isEditing ? editStats.citations : stats.citations}
            isEditing={isEditing}
            onChange={(value) => handleStatChange('citations', value)}
          />
          <StatCard
            label="H-Index"
            value={isEditing ? editStats.h_index : stats.h_index}
            isEditing={isEditing}
            onChange={(value) => handleStatChange('h_index', value)}
          />
          <StatCard
            label="i10-Index"
            value={isEditing ? editStats.i10_index : stats.i10_index}
            isEditing={isEditing}
            onChange={(value) => handleStatChange('i10_index', value)}
          />
        </div>
      </div>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </section>
  );
};

export default PublicationStats;