import { useState } from 'react';
import { FaLinkedin, FaResearchgate, FaGoogle, FaOrcid, FaBook, FaGithub, FaMapMarkerAlt, FaEdit, FaUpload, FaPhone, FaEnvelope, FaPlus, FaTrashAlt, FaGlobe, FaChevronRight } from "react-icons/fa";
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
      await updateDoc(doc(db, "portfolio", "hero"), { socialLinks: updatedLinks });
      showToast("Social link removed", "success");
    } catch (error) {
      showToast("Failed to delete social link", "error");
    }
  };

  const handleSaveSocial = async () => {
    try {
      const updatedLinks = [...(heroData.socialLinks || [])];
      if (editingSocialIndex === null) updatedLinks.push(socialForm);
      else updatedLinks[editingSocialIndex] = socialForm;
      await updateDoc(doc(db, "portfolio", "hero"), { socialLinks: updatedLinks });
      setIsSocialModalOpen(false);
      showToast("Social links updated", "success");
    } catch (error) {
      showToast("Failed to update social links", "error");
    }
  };

  const handleEditClick = (field, value) => {
    setEditField(field);
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
      let processedValue = tempValue;
      if (editField === 'email' || editField === 'phone') {
        if (typeof tempValue === 'string') {
          processedValue = tempValue.split('\n').map(item => item.trim()).filter(item => item !== '');
        }
      }
      const updateData = editField === 'location'
        ? { location: { text: processedValue, link: heroData.location.link } }
        : { [editField]: processedValue };

      await updateDoc(docRef, updateData);
      setIsEditing(false);
      showToast('Profile updated successfully', 'success');
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
      await updateDoc(doc(db, "portfolio", "hero"), { profileImageUrl: imageUrl });
      setIsImageModalOpen(false);
      showToast('Profile image updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update profile image', 'error');
    }
  };

  const renderSocialIcon = (iconName) => {
    switch (iconName) {
      case "linkedin": return <FaLinkedin size={22} />;
      case "github": return <FaGithub size={22} />;
      case "google": return <FaGoogle size={22} />;
      case "orcid": return <FaOrcid size={22} />;
      case "researchgate": return <FaResearchgate size={22} />;
      case "book": return <FaBook size={22} />;
      default: return <FaGlobe size={22} />;
    }
  };

  if (loading) return <LoadingAnimation />;
  if (!heroData) return <div className="flex items-center justify-center min-h-screen">No data available</div>;

  const emails = Array.isArray(heroData.email) ? heroData.email : [heroData.email];
  const phones = Array.isArray(heroData.phone) ? heroData.phone : [heroData.phone];

  return (
    <section className="hero min-h-screen bg-base-100 overflow-hidden relative selection:bg-primary selection:text-primary-content" id="hero">
      {/* Background Orbs - Using theme variables */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="hero-content flex-col lg:flex-row-reverse gap-12 lg:gap-20 z-10 max-w-7xl w-full px-6 py-20">
        
        {/* Profile Image Section */}
        <div className="relative group perspective-1000">
          <div className="avatar">
            <div className="w-72 h-72 md:w-96 md:h-96 lg:w-[460px] lg:h-[460px] rounded-[2.5rem] lg:rounded-[4rem] shadow-2xl transition-all duration-700 group-hover:shadow-primary/20 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative border-4 border-base-100 ring-1 ring-base-content/10 animate-float">
              <img src={heroData.profileImageUrl || "/images/a2.jpg"} alt={heroData.name} className="object-cover scale-100 group-hover:scale-105 transition-transform duration-1000" />
              
              {user && (
                <div 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer z-20"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <div className="bg-white p-4 rounded-2xl shadow-2xl text-black flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform font-bold">
                    <FaUpload /> Change Photo
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col space-y-6 text-center lg:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-base-content tracking-tight leading-tight">
                {heroData.name}
              </h1>
              {user && <button onClick={() => handleEditClick('name', heroData.name)} className="btn btn-ghost btn-circle btn-sm hover:bg-primary/10"><FaEdit className="text-primary" /></button>}
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-lg md:text-2xl font-medium text-base-content/70 italic">
                {heroData.profession}
              </span>
              {user && <button onClick={() => handleEditClick('profession', heroData.profession)} className="btn btn-ghost btn-circle btn-sm"><FaEdit className="text-primary" /></button>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl pt-4">
            {/* Modern Location Card */}
            <div className="group/card relative overflow-hidden flex items-center gap-4 p-4 rounded-3xl bg-base-200/50 backdrop-blur-xl border border-base-content/5 hover:bg-base-200 transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center bg-primary text-primary-content rounded-2xl shadow-lg transform group-hover/card:rotate-12 transition-transform">
                <FaMapMarkerAlt size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Current Location</p>
                <button 
                   onClick={() => window.open(heroData.location.link, "_blank")}
                   className="font-bold text-sm md:text-base hover:text-primary transition-colors truncate max-w-[150px]"
                >
                  {heroData.location.text}
                </button>
              </div>
              {user && <FaEdit className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 cursor-pointer text-primary" onClick={() => handleEditClick('location', heroData.location)} />}
            </div>

            {/* Modern Email Card */}
            <div className="collapse bg-base-200/50 backdrop-blur-xl border border-base-content/5 rounded-3xl group/card relative transition-all duration-300">
              <input type="checkbox" className="peer" /> 
              <div className="collapse-title flex items-center gap-4 p-4 min-h-0">
                <div className="w-12 h-12 flex items-center justify-center bg-secondary text-secondary-content rounded-2xl shadow-lg transform group-hover/card:-rotate-12 transition-transform">
                  <FaEnvelope size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Contact Email</p>
                  <p className="font-bold text-sm md:text-base truncate max-w-[120px] md:max-w-none">{emails[0]}</p>
                </div>
                {user && <FaEdit className="absolute right-12 top-1/2 -translate-y-1/2 z-20 cursor-pointer text-primary" onClick={(e) => { e.stopPropagation(); handleEditClick('email', heroData.email); }} />}
              </div>
              <div className="collapse-content px-4 pb-4">
                <div className="flex flex-col gap-2 pt-2 border-t border-base-content/10">
                  {emails.slice(1).map((m, i) => (
                    <a key={i} href={`mailto:${m}`} className="text-xs font-bold opacity-60 hover:opacity-100 flex items-center gap-2 hover:text-primary transition-all">
                      <FaChevronRight size={10} /> {m}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social & Contact Actions */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            {phones[0] && (
              <div className="tooltip tooltip-bottom font-bold" data-tip={phones[0]}>
                <div className="relative group">
                  <a 
                    href={`tel:${phones[0]}`}
                    className="btn btn-circle btn-lg bg-accent text-accent-content border-none hover:scale-110 shadow-lg transition-all animate-pulse hover:animate-none"
                  >
                    <FaPhone size={20} className="rotate-[15deg] group-hover:rotate-0 transition-transform" />
                  </a>
                  {user && (
                    <button 
                      onClick={() => handleEditClick('phone', heroData.phone)} 
                      className="absolute -top-1 -right-1 btn btn-xs btn-circle btn-warning opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaEdit size={10} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {heroData.socialLinks?.map((item, index) => (
              <div key={index} className="tooltip tooltip-bottom font-bold" data-tip={item.label}>
                <div className="relative group">
                  <a 
                    href={item.href} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-circle btn-lg btn-outline border-2 border-base-content/10 hover:btn-primary hover:border-primary hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                  >
                    {renderSocialIcon(item.icon)}
                  </a>
                  {user && (
                    <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-30">
                      <button onClick={() => handleEditSocial(index)} className="btn btn-xs btn-circle btn-warning"><FaEdit size={10} /></button>
                      <button onClick={() => handleDeleteSocial(index)} className="btn btn-xs btn-circle btn-error"><FaTrashAlt size={10} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {user && (
              <button onClick={handleAddSocial} className="btn btn-circle btn-lg btn-ghost border-2 border-dashed border-base-content/20 hover:border-primary hover:text-primary transition-colors">
                <FaPlus />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals remain the same as requested */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <div className="card bg-base-100 shadow-2xl p-8 w-full max-w-lg border border-base-content/10 rounded-[2.5rem]">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
             <div className="w-2 h-8 bg-primary rounded-full"/> Update {editField}
          </h3>
          <div className="form-control">
            <textarea 
              className="textarea textarea-bordered h-40 rounded-2xl text-lg focus:ring-2 focus:ring-primary/20 transition-all" 
              value={tempValue} 
              onChange={(e) => setTempValue(e.target.value)} 
              placeholder={`Enter value(s)... (New line for multiples)`}
            />
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button className="btn btn-ghost rounded-2xl font-bold" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="btn btn-primary rounded-2xl px-8 font-bold shadow-lg shadow-primary/30" onClick={handleSave}>Update Profile</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSocialModalOpen} onClose={() => setIsSocialModalOpen(false)}>
        <div className="card bg-base-100 p-8 w-full max-w-md shadow-2xl rounded-[2.5rem] border border-base-content/10">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
             <div className="w-2 h-8 bg-secondary rounded-full"/> Link Details
          </h2>
          <div className="flex flex-col gap-4">
            <input type="text" placeholder="Label (e.g. Portfolio Website)" value={socialForm.label} onChange={(e) => setSocialForm({ ...socialForm, label: e.target.value })} className="input input-bordered rounded-2xl" />
            <input type="url" placeholder="Full URL Link" value={socialForm.href} onChange={(e) => setSocialForm({ ...socialForm, href: e.target.value })} className="input input-bordered rounded-2xl" />
            <select value={socialForm.icon} onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })} className="select select-bordered rounded-2xl font-bold">
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="google">Google Scholar</option>
                <option value="researchgate">ResearchGate</option>
                <option value="orcid">ORCID</option>
                <option value="book">Publications</option>
                <option value="globe">Other Website</option>
            </select>
            <button onClick={handleSaveSocial} className="btn btn-primary rounded-2xl mt-4 font-bold h-14 shadow-lg shadow-primary/20">Finalize Link</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)}>
        <div className="card bg-base-100 p-8 w-full max-w-md shadow-2xl rounded-[2.5rem] border border-base-content/10">
          <h3 className="text-2xl font-black mb-6">Update Profile Image</h3>
          <input type="url" placeholder="Direct Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input input-bordered w-full mb-6 rounded-2xl h-14" />
          {imageUrl && (
            <div className="avatar flex justify-center mb-6">
              <div className="w-32 h-32 rounded-3xl ring-4 ring-primary ring-offset-4 overflow-hidden shadow-2xl"><img src={imageUrl} alt="preview" className="object-cover" /></div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost rounded-2xl" onClick={() => setIsImageModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary px-8 rounded-2xl shadow-lg font-bold" onClick={handleImageUpdate} disabled={!imageUrl}>Save Changes</button>
          </div>
        </div>
      </Modal>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </section>
  );
};

export default Hero;