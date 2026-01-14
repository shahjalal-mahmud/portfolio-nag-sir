import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaTools, FaCode, FaLanguage, FaRocket } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';
import Toast from './common/Toast';
import ConfirmationModal from './common/ConfirmationModal';

const Skills = () => {
  const { user } = useAuth();
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [newSkill, setNewSkill] = useState({
    title: '',
    content: '',
    icon: ''
  });

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const docRef = doc(db, "portfolio", "skills");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSkillsData(docSnap.data().items || []);
        } else {
          const fallbackData = [
            { title: "Languages", content: "English (Full Professional Proficiency), Bangla (Native), Hindi (Limited Working Proficiency)", icon: "🌐" },
            { title: "Programming", content: "Python (NumPy, SciPy, Matplotlib, Pandas), C, C++", icon: "💻" },
            { title: "Platforms", content: "Visual Studio, Google Collab, Anaconda, PyCharm, Web, Windows, Arduino", icon: "🖥️" },
            { title: "Tools", content: "MySQL Workbench", icon: "🛠️" },
            { title: "Document Creation", content: "Microsoft Office Suite, LaTeX", icon: "📄" },
            { title: "Soft Skills", content: "Teamwork, Leadership, Communication, Project Management, Writing, Time Management", icon: "🤝" },
          ];
          setSkillsData(fallbackData);
        }
      } catch (error) {
        console.error("Error fetching skills data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkillsData();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill.title || !newSkill.content) {
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "skills");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        updatedData = [...currentData];
        updatedData[editingIndex] = newSkill;
      } else {
        updatedData = [newSkill, ...currentData];
      }

      await updateDoc(docRef, { items: updatedData });
      setSkillsData(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewSkill({ title: '', content: '', icon: '' });
      setToastMessage(editingIndex !== null ? 'Skill updated successfully' : 'Skill added successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error adding/updating skill:", error);
      setToastMessage(`Failed to save skill`);
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (skillToDelete === null) return;
    try {
      const docRef = doc(db, "portfolio", "skills");
      await updateDoc(docRef, { items: arrayRemove(skillsData[skillToDelete]) });
      setSkillsData(prev => prev.filter((_, i) => i !== skillToDelete));
      setToastMessage('Skill deleted successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting skill:", error);
      setToastMessage('Failed to delete skill');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsDeleteModalOpen(false);
      setSkillToDelete(null);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
              <FaRocket /> Expertise
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight">
              Professional <span className="text-primary">Skills</span>
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl">
              A comprehensive set of technical and interpersonal competencies developed through academic and professional experience.
            </p>
          </div>
          {user && (
            <button
              onClick={() => {
                setShowAddModal(true);
                setEditingIndex(null);
                setNewSkill({ title: '', content: '', icon: '' });
              }}
              className="btn btn-primary shadow-lg gap-2"
            >
              <FaPlus /> Add Skill
            </button>
          )}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {skillsData.map((skill, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -5 }}
                className="group relative h-full"
              >
                <div className="h-full bg-base-100 border border-base-300 group-hover:border-primary/50 rounded-3xl p-8 transition-all duration-300 shadow-sm group-hover:shadow-xl flex flex-col">
                  {/* Card Accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-colors rounded-t-3xl" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-4xl bg-base-200 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      {skill.icon || "⭐"}
                    </div>
                    {user && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setNewSkill(skill); setEditingIndex(index); setShowAddModal(true); }}
                          className="btn btn-ghost btn-circle btn-sm text-info hover:bg-info/10"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          onClick={() => { setSkillToDelete(index); setIsDeleteModalOpen(true); }}
                          className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-base-content mb-3 uppercase tracking-tight">
                    {skill.title}
                  </h3>
                  
                  <div className="flex-grow">
                    <p className="text-base-content/70 leading-relaxed font-medium">
                      {skill.content}
                    </p>
                  </div>

                  {/* Decorative element */}
                  <div className="mt-6 flex justify-end opacity-10 group-hover:opacity-30 transition-opacity">
                    <FaCode size={24} className="text-primary" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modern Modal Design */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-xl border border-base-300 overflow-hidden">
          <div className="p-1 bg-primary" />
          <div className="p-8">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
              {editingIndex !== null ? <FaEdit className="text-primary"/> : <FaPlus className="text-primary"/>}
              {editingIndex !== null ? 'Modify Skill' : 'New Competency'}
            </h3>

            <div className="space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold uppercase text-xs opacity-60 tracking-widest">Skill Title*</span>
                </label>
                <input
                  type="text"
                  value={newSkill.title}
                  onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                  className="input input-bordered focus:input-primary w-full bg-base-200/50"
                  placeholder="e.g., Technical Proficiency"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold uppercase text-xs opacity-60 tracking-widest">Description/Content*</span>
                </label>
                <textarea
                  value={newSkill.content}
                  onChange={(e) => setNewSkill({ ...newSkill, content: e.target.value })}
                  className="textarea textarea-bordered focus:textarea-primary w-full bg-base-200/50 min-h-[120px]"
                  placeholder="List skills separated by commas..."
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold uppercase text-xs opacity-60 tracking-widest">Icon (Emoji)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill.icon}
                    onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                    className="input input-bordered focus:input-primary flex-grow bg-base-200/50"
                    placeholder="e.g., 💻"
                  />
                  <div className="bg-base-300 w-12 h-12 rounded-lg flex items-center justify-center text-xl">
                    {newSkill.icon || "?"}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-action mt-10">
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost font-bold">Cancel</button>
              <button onClick={handleAddSkill} className="btn btn-primary px-8 font-black uppercase tracking-widest">
                Save Skill
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Global Components */}
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="This will permanently remove this skill from your professional profile. Continue?"
        confirmText="Remove Skill"
        cancelText="Keep"
        confirmColor="red"
        title="Delete Record"
      />
    </section>
  );
};

export default Skills;