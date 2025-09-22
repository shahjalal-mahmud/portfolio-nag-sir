import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaDownload,
  FaGraduationCap,
  FaEdit,
  FaUpload
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
  const [cvUrl, setCVUrl] = useState(aboutData?.contactInfo?.cvLink || '');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };
  const [tempValues, setTempValues] = useState({
    shortBio: '',
    fullBio: '',
    position: '',
    location: '',
    email: '',
    skills: []
  });

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, "portfolio", "about");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data());
          const data = docSnap.data();
          setAboutData(data);
          setCVUrl(data.contactInfo?.cvLink || '');
          // Set the image URL if it exists in Firestore
          if (data.aboutImageUrl) {
            setImageUrl(data.aboutImageUrl);
          }

        } else {
          setAboutData({
            shortBio: `Anindya Nag obtained an M.Sc. in Computer Science and Engineering from Khulna University...`,
            fullBio: `His research focuses on health informatics, medical Internet of Things...`,
            contactInfo: {
              position: "Lecturer, NUBTK",
              location: "Shib Bari Circle, Sonadanga, Khulna-9100",
              email: "anindyanag@ieee.org",
              cvLink: "/cv/Anindya_Nag_CV.pdf"
            },
            skills: [
              "Python", "C", "C++", "NumPy", "Pandas", "SciPy", "Matplotlib",
              "LaTex", "MySQL Workbench", "Google Colab", "PyCharm"
            ]
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
      setTempValues({
        ...tempValues,
        shortBio: aboutData.shortBio,
        fullBio: aboutData.fullBio
      });
    } else if (field === 'skills') {
      setTempValues({
        ...tempValues,
        skills: aboutData.skills.join(', ') // Store as string for editing
      });
    } else {
      setTempValues({
        ...tempValues,
        [field]: value
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "portfolio", "about");
      let updateData = {};

      if (editField === 'bio') {
        updateData = {
          shortBio: tempValues.shortBio,
          fullBio: tempValues.fullBio
        };
      } else if (editField === 'skills') {
        updateData = {
          skills: tempValues.skills.split(',').map(skill => skill.trim())
        };
      } else {
        updateData = {
          contactInfo: {
            ...aboutData.contactInfo,
            [editField]: tempValues[editField]
          }
        };
      }

      await updateDoc(docRef, updateData);

      setAboutData(prev => ({
        ...prev,
        ...updateData
      }));

      setIsEditing(false);
      showToast(`${editField === 'bio' ? 'Biography' : editField} updated successfully!`, 'success');
    } catch (error) {
      console.error("Error updating about data:", error);
      showToast(`Failed to update ${editField === 'bio' ? 'biography' : editField}. Please try again.`, 'error');
    }
  };

  const handleImageUpdate = async () => {
    if (!imageUrl) {
      showToast('Please provide an image URL', 'error');
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "about");
      await updateDoc(docRef, {
        aboutImageUrl: imageUrl
      });

      setAboutData(prev => ({
        ...prev,
        aboutImageUrl: imageUrl
      }));

      setIsImageModalOpen(false);
      showToast('Profile image updated successfully!', 'success');
    } catch (error) {
      console.error("Error updating about image:", error);
      showToast('Failed to update profile image. Please try again.', 'error');
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!aboutData) {
    return <div className="text-center py-12 text-gray-500">No data available</div>;
  }

  return (
    <section
      id="about"
      className="py-24 px-6 text-gray-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Profile Image */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <img
            src={imageUrl || "/images/cover.jpeg"}
            alt="Anindya Nag"
            className="w-80 h-80 sm:w-96 sm:h-96 object-cover rounded-2xl shadow-2xl border-4 border-primary"
            onError={(e) => {
              e.target.src = "/images/cover.jpeg"; // Fallback image if URL is invalid
            }}
          />
          {user && (
            <button
              className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
              onClick={() => setIsImageModalOpen(true)}
            >
              <FaUpload className="text-blue-600" size={16} />
            </button>
          )}
        </div>

        {/* About Text */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left relative">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h2 className="text-4xl font-extrabold">About Me</h2>
            {user && (
              <button
                onClick={() => handleEditClick('bio', '')}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Edit bio"
              >
                <FaEdit size={20} />
              </button>
            )}
          </div>

          <p className="text-md sm:text-lg text-gray-700 leading-relaxed">
            {aboutData.shortBio}
            {!isDesktop && isExpanded && (
              <>
                <br /><br />
                {aboutData.fullBio}
              </>
            )}
          </p>

          <button
            onClick={toggleExpanded}
            className="text-primary underline text-sm font-medium transition hover:text-secondary"
          >
            {isExpanded ? "See Less" : "See More"}
          </button>

          {/* Contact & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
            {[
              {
                icon: <FaGraduationCap className="text-primary text-lg sm:text-xl flex-shrink-0" />,
                value: aboutData.contactInfo.position,
                field: "position",
              },
              {
                icon: <FaMapMarkerAlt className="text-primary text-lg sm:text-xl flex-shrink-0" />,
                value: aboutData.contactInfo.location,
                field: "location",
              },
              {
                icon: <FaEnvelope className="text-primary ttext-lg sm:text-xl flex-shrink-0" />,
                value: aboutData.contactInfo.email,
                field: "email",
              },
              {
                icon: <FaDownload className="text-primary text-lg sm:text-xl flex-shrink-0" />,
                value: (
                  <a
                    href={aboutData.contactInfo.cvLink
                      ? aboutData.contactInfo.cvLink.replace(
                        /^https:\/\/drive\.google\.com\/file\/d\/([^/]+).*$/,
                        "https://drive.google.com/uc?export=download&id=$1"
                      )
                      : "/cv/Anindya_Nag_CV.pdf"}
                    download="AnindyaNag_CV.pdf"
                    className="underline hover:text-primary transition"
                    target="_self"
                    rel={aboutData.contactInfo.cvLink ? "noopener noreferrer" : ""}
                  >
                    Download CV
                  </a>
                ),
                field: "cvLink",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {item.icon}
                <div className="flex-1">
                  <span className="block break-words">{item.value}</span>
                  {user && item.field !== "cvLink" && (
                    <button
                      onClick={() => handleEditClick(item.field, item.value)}
                      className="text-gray-400 hover:text-blue-600 transition-colors mt-1 inline-flex items-center"
                      aria-label={`Edit ${item.field}`}
                    >
                      <FaEdit size={14} />
                    </button>
                  )}
                  {user && item.field === "cvLink" && (
                    <button
                      className="text-gray-400 hover:text-blue-600 transition-colors mt-1 inline-flex items-center"
                      onClick={() => {
                        setCVUrl(aboutData.contactInfo.cvLink);
                        setIsCVModalOpen(true);
                      }}
                      aria-label="Edit CV"
                    >
                      <FaEdit size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Skills */}
          <div className="pt-6">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h3 className="text-xl font-semibold">Skills & Tech Stack</h3>
              {user && (
                <button
                  onClick={() => handleEditClick('skills', aboutData.skills)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label="Edit skills"
                >
                  <FaEdit size={18} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
              {aboutData.skills.map((skill, idx) => (
                <motion.span
                  key={idx}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-gray-200 text-sm px-3 py-1 rounded-full shadow-sm cursor-pointer hover:bg-primary hover:text-white transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Full Bio Modal (only for desktop) */}
      <AnimatePresence>
        {isExpanded && isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layoutId="about-popup"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30"
            onClick={toggleExpanded}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full text-left space-y-6 shadow-xl overflow-auto max-h-[90vh] relative"
            >
              <button
                onClick={toggleExpanded}
                className="absolute top-3 right-3 text-xl text-gray-500 hover:text-red-500 transition"
              >
                <IoClose />
              </button>
              <h3 className="text-2xl font-bold">Full Biography</h3>
              <p className="text-base leading-relaxed text-gray-800">
                {aboutData.shortBio}<br /><br />{aboutData.fullBio}
              </p>
              <div>
                <h4 className="text-xl font-semibold mb-3">Skills & Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {aboutData.skills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="bg-gray-200 text-sm px-3 py-1 rounded-full shadow-sm cursor-pointer hover:bg-primary hover:text-white transition-colors"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md mx-4">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Edit {editField === 'bio' ? 'Biography' : editField === 'skills' ? 'Skills' : editField}
            </h3>

            {editField === 'bio' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                  <textarea
                    value={tempValues.shortBio}
                    onChange={(e) => setTempValues({ ...tempValues, shortBio: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Bio</label>
                  <textarea
                    value={tempValues.fullBio}
                    onChange={(e) => setTempValues({ ...tempValues, fullBio: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows={6}
                  />
                </div>
              </div>
            ) : editField === 'skills' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <textarea
                  value={tempValues.skills}
                  onChange={(e) => setTempValues({ ...tempValues, skills: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows={4}
                />
              </div>
            ) : (
              <input
                type="text"
                value={tempValues[editField]}
                onChange={(e) => setTempValues({ ...tempValues, [editField]: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Image Update Modal */}
      <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md mx-4">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Update About Image
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (from ImageBB)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://i.ibb.co/..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {imageUrl && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    e.target.src = "/images/cover.jpeg"; // Fallback image if URL is invalid
                  }}
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImageUpdate}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!imageUrl}
              >
                Update Image
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* CV Update Modal */}
      <Modal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md mx-4">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Update CV Link
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Drive Shareable Link
              </label>
              <input
                type="url"
                value={cvUrl}
                onChange={(e) => setCVUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">How to get Google Drive link:</h4>
              <ol className="text-xs text-blue-700 list-decimal pl-5 space-y-1">
                <li>Upload your CV to Google Drive</li>
                <li>Right-click the file and select "Share"</li>
                <li>Change sharing settings to "Anyone with the link"</li>
                <li>Copy the shareable link and paste it above</li>
              </ol>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsCVModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const docRef = doc(db, "portfolio", "about");
                    await updateDoc(docRef, {
                      "contactInfo.cvLink": cvUrl
                    });

                    setAboutData(prev => ({
                      ...prev,
                      contactInfo: {
                        ...prev.contactInfo,
                        cvLink: cvUrl
                      }
                    }));

                    setIsCVModalOpen(false);
                    showToast('CV link updated successfully!', 'success');
                  } catch (error) {
                    console.error("Error updating CV link:", error);
                    showToast('Failed to update CV link. Please try again.', 'error');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!cvUrl}
              >
                Update CV
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </section>
  );
};

export default About;