import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaExternalLinkAlt, FaBookOpen } from "react-icons/fa";
import { MdWorkOutline, MdSchool } from "react-icons/md";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';
import Toast from './common/Toast';
import ConfirmationModal from './common/ConfirmationModal';

const Experience = () => {
  const { user } = useAuth();
  const [experienceData, setExperienceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [newExperience, setNewExperience] = useState({
    title: '',
    university: { name: '', url: '' },
    period: '',
    department: '',
    courses: []
  });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 5000);
  };

  const handleDeleteClick = (index) => {
    setItemToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;
    try {
      const docRef = doc(db, "portfolio", "experience");
      await updateDoc(docRef, { items: arrayRemove(experienceData[itemToDelete]) });
      setExperienceData(prev => prev.filter((_, i) => i !== itemToDelete));
      showToast('Experience deleted successfully', 'success');
    } catch (error) {
      console.error("Error deleting experience:", error);
      showToast('Failed to delete experience', 'error');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    const fetchExperienceData = async () => {
      try {
        const docRef = doc(db, "portfolio", "experience");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExperienceData(docSnap.data().items || []);
        } else {
          // Fallback static data
          setExperienceData([
            {
              title: "Lecturer",
              university: { name: "Northern University of Business & Technology Khulna", url: "https://nubtkhulna.ac.bd/" },
              period: "March 2024 – Ongoing",
              department: "Department of Computer Science and Engineering",
              courses: ["Artificial Intelligence", "Pattern Recognition", "Numerical Methods"],
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching experience data:", error);
        showToast('Failed to load experience data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchExperienceData();
  }, []);

  const handleAddExperience = async () => {
    if (!newExperience.title || !newExperience.university.name || !newExperience.period || !newExperience.department) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    try {
      const docRef = doc(db, "portfolio", "experience");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];
      let updatedData;
      if (editingIndex !== null) {
        updatedData = [...currentData];
        updatedData[editingIndex] = newExperience;
        showToast('Experience updated successfully', 'success');
      } else {
        updatedData = [newExperience, ...currentData];
        showToast('Experience added successfully', 'success');
      }
      await updateDoc(docRef, { items: updatedData });
      setExperienceData(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewExperience({ title: '', university: { name: '', url: '' }, period: '', department: '', courses: [] });
    } catch (error) {
      console.error("Error adding/updating experience:", error);
      showToast('Failed to save experience', 'error');
    }
  };

  const handleEditExperience = (index) => {
    setNewExperience(experienceData[index]);
    setEditingIndex(index);
    setShowAddModal(true);
  };

  const handleCourseChange = (index, value) => {
    const updatedCourses = [...newExperience.courses];
    updatedCourses[index] = value;
    setNewExperience({ ...newExperience, courses: updatedCourses });
  };

  const addCourseField = () => setNewExperience({ ...newExperience, courses: [...newExperience.courses, ''] });
  const removeCourseField = (index) => setNewExperience({ ...newExperience, courses: newExperience.courses.filter((_, i) => i !== index) });

  if (loading) return <LoadingAnimation />;

  return (
    <section id="experience" className="py-20 px-4 bg-base-200/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-base-content flex items-center gap-4">
              <span className="p-3 bg-primary text-primary-content rounded-2xl shadow-lg">
                <MdWorkOutline />
              </span>
              Experience
            </h2>
            <div className="h-1.5 w-24 bg-primary rounded-full"></div>
          </div>
          {user && (
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary shadow-lg hover:scale-105 transition-all">
              <FaPlus /> Add New Position
            </button>
          )}
        </div>

        {/* Card-Based Grid Layout (No Timelines) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {experienceData.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-base-300 group"
            >
              <div className="card-body p-6 md:p-8">
                {/* Admin Toolbar */}
                {user && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleEditExperience(idx)} className="btn btn-circle btn-ghost btn-sm text-info bg-info/5"><FaEdit /></button>
                    <button onClick={() => handleDeleteClick(idx)} className="btn btn-circle btn-ghost btn-sm text-error bg-error/5"><FaTrash /></button>
                  </div>
                )}

                {/* Header: Title & Timeframe */}
                <div className="flex flex-col gap-1 mb-6">
                  <span className="badge badge-primary badge-sm font-bold tracking-widest uppercase py-3">{exp.period}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-base-content mt-2 leading-tight">
                    {exp.title}
                  </h3>
                </div>

                {/* University Info */}
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center gap-3 text-lg font-semibold text-primary/80">
                    <MdSchool className="text-2xl" />
                    <span>{exp.department}</span>
                  </div>
                  <a
                    href={exp.university.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors italic text-sm md:text-base underline underline-offset-4 decoration-dotted"
                  >
                    {exp.university.name} <FaExternalLinkAlt size={12} />
                  </a>
                </div>

                {/* Courses Conducted */}
                <div className="mt-auto">
                  <div className="divider divider-start font-bold text-xs uppercase opacity-50 tracking-tighter">
                    <FaBookOpen className="mr-2" /> Courses Handled
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.courses.map((course, i) => (
                      <div key={i} className="badge badge-ghost font-medium py-4 px-4 bg-base-200 border-none hover:bg-primary/10 hover:text-primary transition-colors">
                        {course}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modern daisyUI Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-base-100 p-6 md:p-10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <h3 className="text-3xl font-black mb-8 text-base-content">
            {editingIndex !== null ? 'Edit Experience' : 'New Experience'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control md:col-span-2">
              <label className="label"><span className="label-text font-bold uppercase text-xs opacity-60">Job Title</span></label>
              <input type="text" value={newExperience.title} onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} className="input input-bordered w-full focus:input-primary" placeholder="e.g. Assistant Professor" required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold uppercase text-xs opacity-60">Institution</span></label>
              <input type="text" value={newExperience.university.name} onChange={(e) => setNewExperience({ ...newExperience, university: { ...newExperience.university, name: e.target.value } })} className="input input-bordered w-full" required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold uppercase text-xs opacity-60">Website URL</span></label>
              <input type="url" value={newExperience.university.url} onChange={(e) => setNewExperience({ ...newExperience, university: { ...newExperience.university, url: e.target.value } })} className="input input-bordered w-full" placeholder="https://..." />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold uppercase text-xs opacity-60">Department</span></label>
              <input type="text" value={newExperience.department} onChange={(e) => setNewExperience({ ...newExperience, department: e.target.value })} className="input input-bordered w-full" required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold uppercase text-xs opacity-60">Time Period</span></label>
              <input type="text" value={newExperience.period} onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })} className="input input-bordered w-full" placeholder="e.g. 2024 - Present" required />
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="label"><span className="label-text font-bold uppercase text-xs opacity-60">Courses Conducted</span></label>
              {newExperience.courses.map((course, index) => (
                <div key={index} className="flex gap-2">
                  <input type="text" value={course} onChange={(e) => handleCourseChange(index, e.target.value)} className="input input-bordered flex-1" />
                  <button onClick={() => removeCourseField(index)} className="btn btn-error btn-square btn-outline"><FaTrash /></button>
                </div>
              ))}
              <button onClick={addCourseField} className="btn btn-sm btn-ghost text-primary"><FaPlus /> Add Course Field</button>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-10">
            <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary px-10" onClick={handleAddExperience}>Save Experience</button>
          </div>
        </div>
      </Modal>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />}
      <ConfirmationModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} title="Delete Experience" message="This will permanently remove this record. Continue?" confirmText="Delete" confirmColor="red" />
    </section>
  );
};

export default Experience;