import { useState, useEffect } from 'react';
import { FaLinkedin, FaResearchgate, FaGoogle, FaOrcid, FaDatabase, FaBook, FaGithub, FaMapMarkerAlt, FaGlobe, FaEdit, FaUpload } from "react-icons/fa";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from './Modal';
import LoadingAnimation from '../LoadingAnimation';
import Toast from '../common/Toast';

const Hero = () => {
  const { user } = useAuth();
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState('');
  const [tempValue, setTempValue] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 5000);
  };

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, "portfolio", "hero");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroData(data);
          if (data.profileImageUrl) {
            setImageUrl(data.profileImageUrl);
          }
        } else {
          setHeroData({
            name: "ANINDYA NAG",
            profession: "Lecturer, Dept. of Computer Science & Engineering\nNorthern University of Business and Technology Khulna",
            location: {
              text: "Northern University of Business and Technology Khulna, Khulna-9100, Bangladesh",
              link: "https://maps.app.goo.gl/sr7kWTtaCYLGGRM87"
            },
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
          });
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        showToast('Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const handleEditClick = (field, value) => {
    setEditField(field);
    setTempValue(field === 'location' ? value.text : value);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "portfolio", "hero");
      const updateData = editField === 'location'
        ? { location: { text: tempValue, link: heroData.location.link } }
        : { [editField]: tempValue };

      await updateDoc(docRef, updateData);

      setHeroData(prev => ({
        ...prev,
        ...updateData
      }));

      setIsEditing(false);
      showToast('Profile updated successfully', 'success');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleImageUpdate = async () => {
    if (!imageUrl) {
      showToast('Please provide an image URL', 'error');
      return;
    }
    
    try {
      const docRef = doc(db, "portfolio", "hero");
      await updateDoc(docRef, {
        profileImageUrl: imageUrl
      });

      setHeroData(prev => ({
        ...prev,
        profileImageUrl: imageUrl
      }));

      setIsImageModalOpen(false);
      showToast('Profile image updated successfully', 'success');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      showToast('Failed to update profile image', 'error');
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!heroData) {
    return <div className="text-center py-12 text-gray-500">No data available</div>;
  }

  return (
    <section className="text-gray-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 2xl:px-12" id="hero">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-6 lg:gap-10 xl:gap-12">
        {/* Text Content */}
        <div className="flex-1 w-full">
          <div className="flex items-start gap-3 group">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">
              {heroData.name}
            </h1>
            {user && (
              <button
                onClick={() => handleEditClick('name', heroData.name)}
                className="mt-1.5 text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110"
                aria-label="Edit name"
              >
                <FaEdit size={18} />
              </button>
            )}
          </div>

          <div className="relative group mb-3 sm:mb-4">
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg whitespace-pre-line">
              {heroData.profession}
            </p>
            {user && (
              <button
                onClick={() => handleEditClick('profession', heroData.profession)}
                className="absolute -right-8 top-0 text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110"
                aria-label="Edit profession"
              >
                <FaEdit size={18} />
              </button>
            )}
          </div>

          {/* Location & Contact */}
          <div className="text-sm sm:text-base text-gray-700 space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 max-w-md">
            {/* Location with link */}
            <div className="flex items-start gap-1 group">
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-blue-700 transition-colors"
                onClick={() => window.open(heroData.location.link, "_blank")}
              >
                <FaMapMarkerAlt className="text-gray-500 flex-shrink-0 mt-0.5" />
                <span>{heroData.location.text}</span>
              </div>
              {user && (
                <button
                  onClick={() => handleEditClick('location', heroData.location)}
                  className="text-gray-400 hover:text-blue-600 transition-colors ml-1 transform hover:scale-110"
                  aria-label="Edit location"
                >
                  <FaEdit size={16} />
                </button>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center gap-1 group">
              <p className="flex items-center">
                Email:{" "}
                <a
                  href={`mailto:${heroData.email}`}
                  className="text-blue-600 hover:text-blue-800 ml-1 transition-colors"
                >
                  {heroData.email}
                </a>
              </p>
              {user && (
                <button
                  onClick={() => handleEditClick('email', heroData.email)}
                  className="text-gray-400 hover:text-blue-600 transition-colors ml-1 transform hover:scale-110"
                  aria-label="Edit email"
                >
                  <FaEdit size={16} />
                </button>
              )}
            </div>

            {/* Phone */}
            <div className="flex items-center gap-1 group">
              <p>Mobile: {heroData.phone}</p>
              {user && (
                <button
                  onClick={() => handleEditClick('phone', heroData.phone)}
                  className="text-gray-400 hover:text-blue-600 transition-colors ml-1 transform hover:scale-110"
                  aria-label="Edit phone"
                >
                  <FaEdit size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 max-w-md">
            {heroData.socialLinks?.map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 border border-gray-300 rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700
                 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                aria-label={`Visit ${label}`}
              >
                {icon === 'linkedin' && <FaLinkedin className="text-blue-700 text-sm sm:text-base" />}
                {icon === 'researchgate' && <FaResearchgate className="text-green-700 text-sm sm:text-base" />}
                {icon === 'google' && <FaGoogle className="text-blue-600 text-sm sm:text-base" />}
                {icon === 'orcid' && <FaOrcid className="text-green-600 text-sm sm:text-base" />}
                {icon === 'database' && <FaDatabase className="text-red-600 text-sm sm:text-base" />}
                {icon === 'book' && <FaBook className="text-purple-700 text-sm sm:text-base" />}
                {icon === 'globe' && <FaGlobe className="text-indigo-600 text-sm sm:text-base" />}
                {icon === 'github' && <FaGithub className="text-gray-800 text-sm sm:text-base" />}
                <span className="hidden sm:inline">{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Profile Image */}
        <div className="flex-1 flex justify-center relative group mb-6 sm:mb-8 md:mb-0">
          <div className="relative">
            <img
              src={imageUrl || "/images/a2.jpg"}
              alt="Anindya Nag"
              className="w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-cover rounded-full border-4 border-blue-600 shadow-lg sm:shadow-xl transition-all duration-300 hover:shadow-2xl"
              onError={(e) => {
                e.target.src = "/images/a2.jpg";
              }}
            />
            {user && (
              <button
                className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-white p-1.5 sm:p-2 rounded-full shadow-md hover:bg-gray-100 transition-all transform hover:scale-110"
                onClick={() => setIsImageModalOpen(true)}
              >
                <FaUpload className="text-blue-600 text-sm sm:text-base" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Text Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md mx-4">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Edit {editField.replace(/^\w/, c => c.toUpperCase())}
            </h3>

            {editField === 'profession' ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                rows={4}
              />
            ) : editField === 'location' ? (
              <div className="space-y-2 sm:space-y-3">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder="Location text"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                />
                <input
                  type="url"
                  value={heroData.location.link}
                  onChange={(e) => setHeroData(prev => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      link: e.target.value
                    }
                  }))}
                  placeholder="Google Maps link"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                />
              </div>
            ) : (
              <input
                type={editField === 'email' ? 'email' : 'text'}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
              />
            )}

            <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
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
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Update Profile Image
            </h3>
            
            <div className="mb-3 sm:mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Image URL (from ImageBB)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://i.ibb.co/..."
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
              />
            </div>

            {imageUrl && (
              <div className="mb-3 sm:mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1 sm:mb-2">Preview:</p>
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border border-gray-300"
                  onError={(e) => {
                    e.target.src = "/images/a2.jpg";
                  }}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleImageUpdate}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                disabled={!imageUrl}
              >
                Update Image
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </section>
  );
};

export default Hero;