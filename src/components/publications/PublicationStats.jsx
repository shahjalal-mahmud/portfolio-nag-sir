import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaEdit, FaSave, FaChartLine, FaQuoteLeft, FaHashtag, FaHistory } from "react-icons/fa";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from '../../context/useAuth';
import Toast from '../common/Toast';

const StatCard = ({ label, value, icon: Icon, duration = 2, isEditing = false, onChange }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isEditing) {
      setCount(value);
      return;
    }

    let start = 0;
    const end = value;
    if (end === 0) return;

    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * end);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const target = document.getElementById(`stat-${label.replace(/\s+/g, '-')}`);
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [value, duration, label, isEditing]);

  return (
    <motion.div
      id={`stat-${label.replace(/\s+/g, '-')}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-3xl bg-base-100 border border-base-content/10 shadow-xl group"
    >
      {/* Decorative Background Blob */}
      <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="text-primary mb-3 text-xl opacity-80">
        <Icon />
      </div>

      {isEditing ? (
        <input
          type="number"
          value={count}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="input input-bordered input-primary w-full text-center text-2xl font-bold font-mono"
        />
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-black tracking-tight text-base-content">
            {count}
          </span>
        </div>
      )}
      
      <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-base-content/60 text-center mt-3">
        {label}
      </p>
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
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setStats(data);
          setEditStats(data);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      const fetchData = async () => {
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setStats(docSnap.data());
          setLoading(false);
        } catch (error) {
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
    setEditStats(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "publications", "summary"), editStats);
      setIsEditing(false);
      showToast('Stats updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update stats', 'error');
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <span className="loading loading-ring loading-lg text-primary"></span>
    </div>
  );
  
  if (!stats) return (
    <div className="text-center py-24 opacity-50 italic">No publication summary found.</div>
  );

  return (
    <section id="publications" className="py-20 px-6 bg-base-200/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-base-content mb-3">
              Impact <span className="text-primary">Summary</span>
            </h2>
            
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
                  <span className="text-sm font-bold opacity-70 uppercase tracking-widest">Updating Date:</span>
                  <input
                    type="text"
                    name="as_of_date"
                    value={editStats.as_of_date}
                    onChange={handleEditChange}
                    className="input input-sm input-bordered input-primary w-40"
                  />
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-base-content/60">
                   <FaHistory className="text-xs" />
                   <span className="text-sm font-medium tracking-wide italic">Data verified as of {stats.as_of_date}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={stats.google_scholar_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost border-base-content/10 bg-base-100 hover:bg-base-content hover:text-base-100 rounded-full normal-case group"
            >
              <FaGoogle className="group-hover:scale-110 transition-transform" />
              Scholar Profile
            </a>

            {user && (
              <button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className={`btn rounded-full px-6 shadow-lg ${isEditing ? 'btn-success' : 'btn-primary'}`}
              >
                {isEditing ? <><FaSave /> Save</> : <><FaEdit /> Edit</>}
              </button>
            )}
          </div>
        </div>

        {isEditing && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/20">
            <label className="label-text font-bold mb-2 block uppercase text-xs">Profile Link</label>
            <input
              type="url"
              name="google_scholar_link"
              value={editStats.google_scholar_link}
              onChange={handleEditChange}
              className="input input-bordered w-full input-md"
              placeholder="Google Scholar URL"
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            icon={FaChartLine}
            label="Total Articles"
            value={isEditing ? editStats.total_articles : stats.total_articles}
            isEditing={isEditing}
            onChange={(val) => handleStatChange('total_articles', val)}
          />
          <StatCard
            icon={FaQuoteLeft}
            label="1st/Corresp. Author"
            value={isEditing ? editStats.first_author_articles : stats.first_author_articles}
            isEditing={isEditing}
            onChange={(val) => handleStatChange('first_author_articles', val)}
          />
          <StatCard
            icon={FaQuoteLeft}
            label="Citations"
            value={isEditing ? editStats.citations : stats.citations}
            isEditing={isEditing}
            onChange={(val) => handleStatChange('citations', val)}
          />
          <StatCard
            icon={FaHashtag}
            label="H-Index"
            value={isEditing ? editStats.h_index : stats.h_index}
            isEditing={isEditing}
            onChange={(val) => handleStatChange('h_index', val)}
          />
          <StatCard
            icon={FaHashtag}
            label="i10-Index"
            value={isEditing ? editStats.i10_index : stats.i10_index}
            isEditing={isEditing}
            onChange={(val) => handleStatChange('i10_index', val)}
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