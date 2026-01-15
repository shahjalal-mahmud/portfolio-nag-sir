import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaDownload,
  FaGraduationCap,
  FaEdit,
  FaUpload,
  FaCode
} from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';
import Toast from '../components/common/Toast';

const About = () => {
  const { user } = useAuth();
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [cvUrl, setCVUrl] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkRes = () => setIsDesktop(window.innerWidth >= 1024);
    checkRes();
    window.addEventListener('resize', checkRes);
    return () => window.removeEventListener('resize', checkRes);
  }, []);

  const [tempValues, setTempValues] = useState({
    shortBio: '',
    fullBio: '',
    position: '',
    location: '',
    email: '',
    skills: []
  });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const closeToast = () => setToast(prev => ({ ...prev, show: false }));

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, "portfolio", "about");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAboutData(data);
          setCVUrl(data.contactInfo?.cvLink || '');
          if (data.aboutImageUrl) setImageUrl(data.aboutImageUrl);
        } else {
          setAboutData({
            shortBio: `Anindya Nag obtained an M.Sc. in Computer Science...`,
            fullBio: `His research focuses on health informatics...`,
            contactInfo: {
              position: "Lecturer, NUBTK",
              location: "Khulna, Bangladesh",
              email: "anindyanag@ieee.org",
              cvLink: ""
            },
            skills: ["Python", "C++", "LaTeX", "Machine Learning"]
          });
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleEditClick = (field, value) => {
    setEditField(field);
    if (field === 'bio') {
      setTempValues({ ...tempValues, shortBio: aboutData.shortBio, fullBio: aboutData.fullBio });
    } else if (field === 'skills') {
      setTempValues({ ...tempValues, skills: aboutData.skills.join(', ') });
    } else {
      setTempValues({ ...tempValues, [field]: value });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "portfolio", "about");
      let updateData = {};
      if (editField === 'bio') {
        updateData = { shortBio: tempValues.shortBio, fullBio: tempValues.fullBio };
      } else if (editField === 'skills') {
        updateData = { skills: tempValues.skills.split(',').map(skill => skill.trim()) };
      } else {
        updateData = { contactInfo: { ...aboutData.contactInfo, [editField]: tempValues[editField] } };
      }
      await updateDoc(docRef, updateData);
      setAboutData(prev => ({ ...prev, ...updateData }));
      setIsEditing(false);
      showToast(`${editField} updated!`, 'success');
    } catch (error) {
      showToast(`Update failed`, 'error');
    }
  };

  const handleImageUpdate = async () => {
    try {
      const docRef = doc(db, "portfolio", "about");
      await updateDoc(docRef, { aboutImageUrl: imageUrl });
      setAboutData(prev => ({ ...prev, aboutImageUrl: imageUrl }));
      setIsImageModalOpen(false);
      showToast('Image updated!', 'success');
    } catch (error) {
      showToast('Update failed', 'error');
    }
  };

  const TechBadge = ({ tech }) => (
    <motion.span
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="badge badge-outline border-primary/30 text-base-content hover:bg-primary hover:text-primary-content hover:border-primary cursor-default py-4 px-4 text-xs sm:text-sm transition-colors duration-300"
    >
      {tech}
    </motion.span>
  );

  if (loading) return <LoadingAnimation />;
  if (!aboutData) return <div className="text-center py-12">No data available</div>;

  const cvDownloadLink = aboutData.contactInfo.cvLink?.replace(
    /^https:\/\/drive\.google\.com\/file\/d\/([^/]+).*$/,
    "https://drive.google.com/uc?export=download&id=$1"
  ) || "#";

  return (
    <section id="about" className="py-20 lg:py-32 px-6 bg-base-100 text-base-content transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        
        {/* Profile Image Section */}
        <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10 animate-pulse"></div>
            <img
              src={imageUrl || "/images/cover.jpeg"}
              alt="Profile"
              className="w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 object-cover rounded-3xl shadow-2xl border-4 border-primary ring-8 ring-primary/5 transition-all duration-500"
              onError={(e) => { e.target.src = "/images/cover.jpeg"; }}
            />
            {user && (
              <button
                className="absolute bottom-4 right-4 btn btn-circle btn-primary btn-sm shadow-xl scale-0 group-hover:scale-100 transition-transform duration-300"
                onClick={() => setIsImageModalOpen(true)}
              >
                <FaUpload size={14} />
              </button>
            )}
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-7/12 space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight italic">
                About <span className="text-primary">Me</span>
              </h2>
              {user && (
                <button onClick={() => handleEditClick('bio', '')} className="btn btn-ghost btn-circle btn-sm text-primary">
                  <FaEdit size={18} />
                </button>
              )}
            </div>
            <div className="h-1.5 w-20 bg-primary mx-auto lg:mx-0 rounded-full"></div>
          </div>

          <div className="text-base sm:text-lg opacity-80 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            <p>{aboutData.shortBio}</p>
            <AnimatePresence>
              {!isDesktop && isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4 text-sm sm:text-base text-left bg-base-200 p-4 rounded-xl border border-primary/10"
                >
                  {aboutData.fullBio}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleExpanded}
            className="btn btn-ghost btn-sm text-primary hover:bg-primary/10 font-bold normal-case group"
          >
            {isExpanded ? "Show Less" : "Read Full Vision"}
            <span className="group-hover:translate-x-1 transition-transform ml-1">→</span>
          </button>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm sm:text-base border-t border-base-content/10 pt-8">
            <div className="flex items-center gap-4 justify-center lg:justify-start group">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                <FaGraduationCap />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{aboutData.contactInfo.position}</span>
                {user && <FaEdit className="cursor-pointer opacity-0 group-hover:opacity-100 text-primary" onClick={() => handleEditClick('position', aboutData.contactInfo.position)} />}
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center lg:justify-start group">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                <FaMapMarkerAlt />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{aboutData.contactInfo.location}</span>
                {user && <FaEdit className="cursor-pointer opacity-0 group-hover:opacity-100 text-primary" onClick={() => handleEditClick('location', aboutData.contactInfo.location)} />}
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center lg:justify-start group">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                <FaEnvelope />
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-medium truncate">{aboutData.contactInfo.email}</span>
                {user && <FaEdit className="cursor-pointer opacity-0 group-hover:opacity-100 text-primary" onClick={() => handleEditClick('email', aboutData.contactInfo.email)} />}
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center lg:justify-start group">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                <FaDownload />
              </div>
              <div className="flex items-center gap-2">
                <a href={cvDownloadLink} download className="link link-primary no-underline hover:underline font-bold">Download Resume</a>
                {user && <FaEdit className="cursor-pointer opacity-0 group-hover:opacity-100 text-primary" onClick={() => setIsCVModalOpen(true)} />}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="pt-4">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <h3 className="text-sm uppercase tracking-[0.2em] font-bold opacity-50">Core Expertise</h3>
              {user && <FaEdit className="cursor-pointer text-primary" onClick={() => handleEditClick('skills', aboutData.skills)} />}
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
              {aboutData.skills.map((skill, idx) => (
                <TechBadge key={idx} tech={skill} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Expanded Modal */}
      <AnimatePresence>
        {isExpanded && isDesktop && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-base-300/80 backdrop-blur-md"
            onClick={toggleExpanded}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-base-100 rounded-3xl p-8 md:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary/20 relative"
            >
              <button onClick={toggleExpanded} className="absolute top-6 right-6 btn btn-circle btn-sm btn-ghost hover:bg-error/10 hover:text-error">
                <IoClose className="text-2xl" />
              </button>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary rounded-2xl text-primary-content shadow-lg shadow-primary/20">
                  <FaCode className="text-3xl" />
                </div>
                <div>
                  <h3 className="text-3xl font-black">Full Biography</h3>
                  <p className="text-primary font-bold text-sm tracking-widest uppercase">Expertise & Journey</p>
                </div>
              </div>
              <div className="text-lg leading-relaxed opacity-90 space-y-6 text-base-content/80">
                <p>{aboutData.shortBio}</p>
                <p>{aboutData.fullBio}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Keep your existing Modals and Toast here but wrap their content in DaisyUI classes --- */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <div className="bg-base-100 p-6 rounded-2xl w-full max-w-md border border-primary/20">
          <h3 className="text-xl font-bold mb-4 capitalize">Edit {editField}</h3>
          {editField === 'bio' ? (
            <div className="space-y-4">
              <textarea value={tempValues.shortBio} onChange={(e) => setTempValues({ ...tempValues, shortBio: e.target.value })} className="textarea textarea-bordered w-full h-24" placeholder="Short Bio" />
              <textarea value={tempValues.fullBio} onChange={(e) => setTempValues({ ...tempValues, fullBio: e.target.value })} className="textarea textarea-bordered w-full h-40" placeholder="Full Bio" />
            </div>
          ) : (
            <input 
               type="text" 
               value={editField === 'skills' ? tempValues.skills : tempValues[editField]} 
               onChange={(e) => editField === 'skills' ? setTempValues({...tempValues, skills: e.target.value}) : setTempValues({...tempValues, [editField]: e.target.value})} 
               className="input input-bordered w-full" 
            />
          )}
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)}>
        <div className="bg-base-100 p-6 rounded-2xl w-full max-w-md border border-primary/20">
          <h3 className="text-xl font-bold mb-4">Update Image URL</h3>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input input-bordered w-full mb-4" placeholder="https://..." />
          {imageUrl && <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-4" />}
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setIsImageModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleImageUpdate}>Update</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)}>
        <div className="bg-base-100 p-6 rounded-2xl w-full max-w-md border border-primary/20">
          <h3 className="text-xl font-bold mb-4">Update CV Link</h3>
          <input type="url" value={cvUrl} onChange={(e) => setCVUrl(e.target.value)} className="input input-bordered w-full mb-4" placeholder="Google Drive Link" />
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setIsCVModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={async () => {
              const docRef = doc(db, "portfolio", "about");
              await updateDoc(docRef, { "contactInfo.cvLink": cvUrl });
              setAboutData(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, cvLink: cvUrl }}));
              setIsCVModalOpen(false);
              showToast('CV Link updated!', 'success');
            }}>Save</button>
          </div>
        </div>
      </Modal>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </section>
  );
};

export default About;