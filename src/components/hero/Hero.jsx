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
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocialIndex, setEditingSocialIndex] = useState(null);
  const [socialForm, setSocialForm] = useState({
    label: "",
    href: "",
    icon: "linkedin"
  });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 5000);
  };
  const handleAddSocial = () => {
    setEditingSocialIndex(null);
    setSocialForm({ label: "", href: "", icon: "linkedin" });
    setIsSocialModalOpen(true);
  };
  const handleEditSocial = (index) => {
    setEditingSocialIndex(index);
    setSocialForm(heroData.socialLinks[index]);
    setIsSocialModalOpen(true);
  };
  const handleDeleteSocial = async (index) => {
    try {
      const updatedLinks = [...heroData.socialLinks];
      updatedLinks.splice(index, 1);

      await updateDoc(doc(db, "portfolio", "hero"), {
        socialLinks: updatedLinks,
      });

      showToast("Social link removed", "success");
    } catch (error) {
      showToast("Failed to delete social link", "error");
    }
  };
  const handleSaveSocial = async () => {
    try {
      const updatedLinks = [...(heroData.socialLinks || [])];

      if (editingSocialIndex === null) {
        updatedLinks.push(socialForm);  // ADD
      } else {
        updatedLinks[editingSocialIndex] = socialForm; // EDIT
      }

      await updateDoc(doc(db, "portfolio", "hero"), {
        socialLinks: updatedLinks,
      });

      setIsSocialModalOpen(false);
      showToast("Social links updated", "success");
    } catch (error) {
      showToast("Failed to update social links", "error");
    }
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
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 animate-pulse"></div>
        <p className="text-gray-500 text-lg font-light">No data available</p>
      </div>
    </div>;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 py-12 px-4 sm:px-6 lg:px-8 2xl:px-12" id="hero">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Text Content - Left Side */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Name Section */}
            <div className="group relative">
              <div className="flex items-start gap-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight tracking-tight">
                  {heroData.name}
                </h1>
                {user && (
                  <button
                    onClick={() => handleEditClick('name', heroData.name)}
                    className="mt-2 text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                    aria-label="Edit name"
                  >
                    <FaEdit size={20} />
                  </button>
                )}
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>

            {/* Profession Section */}
            <div className="group relative">
              <div className="flex items-start gap-4">
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 leading-relaxed font-light max-w-2xl bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                  {heroData.profession}
                </p>
                {user && (
                  <button
                    onClick={() => handleEditClick('profession', heroData.profession)}
                    className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                    aria-label="Edit profession"
                  >
                    <FaEdit size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Contact Cards */}
            <div className="grid gap-4 max-w-xl">
              {/* Location Card */}
              <div className="group relative">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-3 cursor-pointer group/location"
                      onClick={() => window.open(heroData.location.link, "_blank")}
                    >
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <FaMapMarkerAlt className="text-white text-sm" />
                      </div>
                      <span className="text-gray-700 font-medium group-hover/location:text-blue-600 transition-colors">
                        {heroData.location.text}
                      </span>
                    </div>
                    {user && (
                      <button
                        onClick={() => handleEditClick('location', heroData.location)}
                        className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110"
                        aria-label="Edit location"
                      >
                        <FaEdit size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group relative">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                          <FaEnvelope className="text-white text-sm" />
                        </div>
                        <span className="text-gray-700 font-medium">Email</span>
                      </div>
                      <div className="flex flex-col gap-1 ml-11">
                        {Array.isArray(heroData.email) ? (
                          heroData.email.map((email, index) => (
                            <a
                              key={index}
                              href={`mailto:${email}`}
                              className="text-blue-600 hover:text-blue-800 transition-all duration-300 text-sm font-medium hover:translate-x-1"
                            >
                              {email}
                            </a>
                          ))
                        ) : (
                          <a
                            href={`mailto:${heroData.email}`}
                            className="text-blue-600 hover:text-blue-800 transition-all duration-300 text-sm font-medium hover:translate-x-1"
                          >
                            {heroData.email}
                          </a>
                        )}
                      </div>
                    </div>
                    {user && (
                      <button
                        onClick={() => handleEditClick('email', heroData.email)}
                        className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110 ml-2"
                        aria-label="Edit email"
                      >
                        <FaEdit size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="group relative">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                          <FaPhone className="text-white text-sm" />
                        </div>
                        <span className="text-gray-700 font-medium">Mobile</span>
                      </div>
                      <div className="flex flex-col gap-1 ml-11">
                        {Array.isArray(heroData.phone) ? (
                          heroData.phone.map((phone, index) => (
                            <a
                              key={index}
                              href={`tel:${phone}`}
                              className="text-gray-700 hover:text-blue-700 transition-all duration-300 text-sm font-medium hover:translate-x-1"
                            >
                              {phone}
                            </a>
                          ))
                        ) : (
                          <span className="text-gray-700 text-sm font-medium">{heroData.phone}</span>
                        )}
                      </div>
                    </div>
                    {user && (
                      <button
                        onClick={() => handleEditClick('phone', heroData.phone)}
                        className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110 ml-2"
                        aria-label="Edit phone"
                      >
                        <FaEdit size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 mt-8">

              {user && (
                <button
                  onClick={handleAddSocial}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  + Add Social Link
                </button>
              )}

              {heroData.socialLinks?.map((item, index) => (
                <div key={index} className="relative group">
                  <a
                    href={item.href}
                    target="_blank"
                    className="flex items-center gap-2 bg-white/60 backdrop-blur-lg 
        rounded-2xl px-4 py-3 border border-white/40 shadow-lg 
        hover:shadow-2xl transition hover:scale-105"
                  >
                    {item.icon === "linkedin" && <FaLinkedin className="text-blue-700" />}
                    {item.icon === "google" && <FaGoogle className="text-red-600" />}
                    {item.icon === "github" && <FaGithub className="text-black" />}
                    {item.icon === "book" && <FaBook className="text-purple-600" />}
                    {item.icon === "orcid" && <FaOrcid className="text-green-600" />}
                    {item.icon === "researchgate" && <FaResearchgate className="text-green-700" />}

                    <span className="font-medium">{item.label}</span>
                  </a>

                  {user && (
                    <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEditSocial(index)}
                        className="bg-yellow-400 p-1 rounded-full hover:bg-yellow-500"
                      >
                        <FaEdit size={12} />
                      </button>

                      <button
                        onClick={() => handleDeleteSocial(index)}
                        className="bg-red-500 p-1 rounded-full hover:bg-red-600"
                      >
                        ❌
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Profile Image - Right Side */}
          <div className="flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="relative group">
              {/* Floating Animation Container */}
              <div className="animate-float">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-1000 opacity-70"></div>

                {/* Main Image */}
                <div className="relative">
                  <img
                    src={heroData.profileImageUrl || imageUrl || "/images/a2.jpg"}
                    alt={heroData.name || "Profile"}
                    className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] object-cover rounded-full border-8 border-white/80 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:border-white/90"
                    onError={(e) => {
                      e.target.src = "/images/a2.jpg";
                    }}
                  />

                  {/* Edit Button */}
                  {user && (
                    <button
                      className="absolute bottom-6 right-6 bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 group/upload"
                      onClick={() => setIsImageModalOpen(true)}
                    >
                      <FaUpload className="text-white text-lg" />
                      <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover/upload:scale-100 transition-transform duration-300"></div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Text Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-md mx-4 border border-white/50">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4 sm:mb-6">
              Edit {editField.replace(/^\w/, c => c.toUpperCase())}
            </h3>

            {editField === 'profession' ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base resize-none"
                rows={4}
              />
            ) : editField === 'location' ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder="Location text"
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                />
                <input
                  type="url"
                  value={heroData.location.link}
                  onChange={(e) => {
                    console.log('Location link update would go here');
                  }}
                  placeholder="Google Maps link"
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                />
              </div>
            ) : (editField === 'email' || editField === 'phone') ? (
              <div className="space-y-3">
                <textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder={`Enter multiple ${editField === 'email' ? 'emails' : 'phone numbers'} separated by new lines`}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                  rows={4}
                />
                <p className="text-xs text-gray-500 font-medium">
                  Enter each {editField === 'email' ? 'email' : 'phone number'} on a new line
                </p>
              </div>
            ) : (
              <input
                type={editField === 'email' ? 'email' : 'text'}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
              />
            )}

            <div className="flex justify-end gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100/50 transition-all duration-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isSocialModalOpen} onClose={() => setIsSocialModalOpen(false)}>
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">

          <h2 className="text-xl font-bold mb-4">
            {editingSocialIndex === null ? "Add Social Link" : "Edit Social Link"}
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Label (e.g., LinkedIn)"
              value={socialForm.label}
              onChange={(e) => setSocialForm({ ...socialForm, label: e.target.value })}
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="url"
              placeholder="URL"
              value={socialForm.href}
              onChange={(e) => setSocialForm({ ...socialForm, href: e.target.value })}
              className="w-full p-3 border rounded-xl"
            />

            <select
              value={socialForm.icon}
              onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
              className="w-full p-3 border rounded-xl"
            >
              <option value="linkedin">LinkedIn</option>
              <option value="researchgate">ResearchGate</option>
              <option value="google">Google Scholar</option>
              <option value="github">GitHub</option>
              <option value="orcid">ORCID</option>
              <option value="book">Books</option>
              <option value="globe">Website</option>
            </select>

            <button
              onClick={handleSaveSocial}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Save
            </button>
          </div>

        </div>
      </Modal>

      {/* Image Update Modal */}
      <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)}>
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-md mx-4 border border-white/50">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4 sm:mb-6">
              Update Profile Image
            </h3>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL (from ImageBB)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://i.ibb.co/..."
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
              />
            </div>

            {imageUrl && (
              <div className="mb-4 sm:mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
                <div className="flex justify-center">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.src = "/images/a2.jpg";
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100/50 transition-all duration-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleImageUpdate}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;