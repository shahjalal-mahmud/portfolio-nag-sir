import { useState } from 'react';
import { FaLinkedin, FaResearchgate, FaGoogle, FaOrcid, FaDatabase, FaBook, FaGithub, FaMapMarkerAlt, FaGlobe, FaEdit, FaUpload, FaPhone, FaEnvelope } from "react-icons/fa";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from './Modal';
import LoadingAnimation from '../LoadingAnimation';
import Toast from '../common/Toast';
import useHeroData from '../../../hooks/useHeroData';

const Hero = () => {
  const { user } = useAuth();
  const { heroData, loading } = useHeroData();
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

  const handleEditClick = (field, value) => {
    setEditField(field);
    
    // Convert array to string for textarea display
    if ((field === 'email' || field === 'phone') && Array.isArray(value)) {
      setTempValue(value.join('\n'));
    } else {
      setTempValue(field === 'location' ? value.text : value);
    }
    
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "portfolio", "hero");
      
      // Process the tempValue for email and phone fields
      let processedValue = tempValue;
      
      if (editField === 'email' || editField === 'phone') {
        if (typeof tempValue === 'string') {
          // Split by new lines and filter out empty strings
          processedValue = tempValue.split('\n')
            .map(item => item.trim())
            .filter(item => item !== '');
        }
      }
      
      const updateData = editField === 'location'
        ? { location: { text: processedValue, link: heroData.location.link } }
        : { [editField]: processedValue };

      await updateDoc(docRef, updateData);
      setIsEditing(false);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update profile', error);
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

      setIsImageModalOpen(false);
      showToast('Profile image updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update profile image', error);
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
            <div className="flex items-start gap-1 group">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-600 flex-shrink-0" />
                  <span className="font-medium">Email:</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-5">
                  {Array.isArray(heroData.email) ? (
                    heroData.email.map((email, index) => (
                      <a
                        key={index}
                        href={`mailto:${email}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm break-all"
                      >
                        {email}
                      </a>
                    ))
                  ) : (
                    <a
                      href={`mailto:${heroData.email}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm break-all"
                    >
                      {heroData.email}
                    </a>
                  )}
                </div>
              </div>
              {user && (
                <button
                  onClick={() => handleEditClick('email', heroData.email)}
                  className="text-gray-400 hover:text-blue-600 transition-colors ml-1 transform hover:scale-110 flex-shrink-0"
                  aria-label="Edit email"
                >
                  <FaEdit size={16} />
                </button>
              )}
            </div>

            {/* Phone */}
            <div className="flex items-start gap-1 group">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FaPhone className="text-gray-600 flex-shrink-0" />
                  <span className="font-medium">Mobile:</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-5">
                  {Array.isArray(heroData.phone) ? (
                    heroData.phone.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone}`}
                        className="text-gray-700 hover:text-blue-700 transition-colors text-sm break-all"
                      >
                        {phone}
                      </a>
                    ))
                  ) : (
                    <span className="text-gray-700 text-sm break-all">{heroData.phone}</span>
                  )}
                </div>
              </div>
              {user && (
                <button
                  onClick={() => handleEditClick('phone', heroData.phone)}
                  className="text-gray-400 hover:text-blue-600 transition-colors ml-1 transform hover:scale-110 flex-shrink-0"
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
              src={heroData.profileImageUrl || imageUrl || "/images/a2.jpg"}
              alt={heroData.name || "Profile"}
              className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-104 xl:h-104 2xl:w-112 2xl:h-112 object-cover rounded-full border-4 border-blue-600 shadow-lg sm:shadow-xl transition-all duration-300 hover:shadow-2xl"
              onError={(e) => {
                e.target.src = "/images/a2.jpg";
              }}
            />
            {user && (
              <button
                className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white p-2 sm:p-2.5 rounded-full shadow-md hover:bg-gray-100 transition-all transform hover:scale-110"
                onClick={() => setIsImageModalOpen(true)}
              >
                <FaUpload className="text-blue-600 text-base sm:text-lg" />
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
                  onChange={(e) => {
                    // This needs to be handled properly - you might need to update your state management
                    // For now, we'll just update the tempValue for location text only
                    console.log('Location link update would go here');
                  }}
                  placeholder="Google Maps link"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                />
              </div>
            ) : (editField === 'email' || editField === 'phone') ? (
              <div className="space-y-2">
                <textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder={`Enter multiple ${editField === 'email' ? 'emails' : 'phone numbers'} separated by new lines`}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  Enter each {editField === 'email' ? 'email' : 'phone number'} on a new line
                </p>
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