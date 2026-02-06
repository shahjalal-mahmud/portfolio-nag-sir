import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
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
          // Fallback data safely removed
          setExperienceData([]);
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
    <section id="experience" className="py-12 sm:py-16 lg:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MdWorkOutline className="text-xl text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-base-content">
                Experience
              </h2>
            </div>
            <div className="h-1 w-16 bg-primary rounded-full ml-13"></div>
          </div>
          {user && (
            <button 
              onClick={() => setShowAddModal(true)} 
              className="btn btn-primary btn-sm sm:btn-md gap-2"
            >
              <FaPlus className="text-sm" /> Add Position
            </button>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line - Hidden on mobile */}
          <div className="hidden md:block absolute left-8 top-8 bottom-8 w-0.5 bg-base-300"></div>
          
          {/* Experience Cards */}
          <div className="space-y-8">
            {experienceData.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot - Hidden on mobile */}
                <div className="hidden md:flex absolute left-[1.6rem] top-6 w-4 h-4 rounded-full bg-primary border-4 border-base-100 z-10 shadow-lg"></div>
                
                {/* Card */}
                <div className="md:ml-20">
                  <div className="card bg-base-100 border border-base-300 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
                    <div className="card-body p-5 sm:p-6 lg:p-8">
                      
                      {/* Admin Controls */}
                      {user && (
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditExperience(idx)} 
                            className="btn btn-circle btn-ghost btn-xs text-info hover:bg-info/10"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(idx)} 
                            className="btn btn-circle btn-ghost btn-xs text-error hover:bg-error/10"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}

                      {/* Period Badge */}
                      <div className="mb-3">
                        <span className="badge badge-primary badge-sm font-semibold uppercase tracking-wide">
                          {exp.period}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-4 pr-16">
                        {exp.title}
                      </h3>

                      {/* Department */}
                      <div className="flex items-center gap-2 mb-2 text-base-content/80">
                        <MdSchool className="text-lg shrink-0" />
                        <span className="font-medium text-sm sm:text-base">{exp.department}</span>
                      </div>

                      {/* University Link */}
                      <a
                        href={exp.university.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors mb-6 group/link"
                      >
                        <span className="underline decoration-dotted underline-offset-2">{exp.university.name}</span>
                        <FaExternalLinkAlt className="text-xs opacity-50 group-hover/link:opacity-100" />
                      </a>

                      {/* Courses */}
                      <div className="border-t border-base-300 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <FaBookOpen className="text-sm text-base-content/60" />
                          <span className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                            Courses Taught
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exp.courses.map((course, i) => (
                            <span 
                              key={i} 
                              className="badge badge-ghost text-xs sm:text-sm px-3 py-3 hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-base-100 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
          
          {/* Modal Header */}
          <div className="sticky top-0 bg-base-100 border-b border-base-300 px-6 py-4 z-10">
            <h3 className="text-2xl font-bold text-base-content">
              {editingIndex !== null ? 'Edit Experience' : 'New Experience'}
            </h3>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <div className="space-y-4">
              
              {/* Job Title */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-sm">Job Title</span>
                </label>
                <input 
                  type="text" 
                  value={newExperience.title} 
                  onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} 
                  className="input input-bordered focus:input-primary" 
                  placeholder="e.g. Assistant Professor" 
                  required 
                />
              </div>

              {/* Institution & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-sm">Institution</span>
                  </label>
                  <input 
                    type="text" 
                    value={newExperience.university.name} 
                    onChange={(e) => setNewExperience({ ...newExperience, university: { ...newExperience.university, name: e.target.value } })} 
                    className="input input-bordered focus:input-primary" 
                    required 
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-sm">Website URL</span>
                  </label>
                  <input 
                    type="url" 
                    value={newExperience.university.url} 
                    onChange={(e) => setNewExperience({ ...newExperience, university: { ...newExperience.university, url: e.target.value } })} 
                    className="input input-bordered focus:input-primary" 
                    placeholder="https://..." 
                  />
                </div>
              </div>

              {/* Department & Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-sm">Department</span>
                  </label>
                  <input 
                    type="text" 
                    value={newExperience.department} 
                    onChange={(e) => setNewExperience({ ...newExperience, department: e.target.value })} 
                    className="input input-bordered focus:input-primary" 
                    required 
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-sm">Time Period</span>
                  </label>
                  <input 
                    type="text" 
                    value={newExperience.period} 
                    onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })} 
                    className="input input-bordered focus:input-primary" 
                    placeholder="e.g. 2024 - Present" 
                    required 
                  />
                </div>
              </div>

              {/* Courses */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-sm">Courses Taught</span>
                </label>
                <div className="space-y-2">
                  {newExperience.courses.map((course, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        type="text" 
                        value={course} 
                        onChange={(e) => handleCourseChange(index, e.target.value)} 
                        className="input input-bordered input-sm flex-1" 
                        placeholder="Course name"
                      />
                      <button 
                        onClick={() => removeCourseField(index)} 
                        className="btn btn-square btn-sm btn-error btn-outline"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addCourseField} 
                    className="btn btn-ghost btn-sm text-primary gap-2"
                  >
                    <FaPlus className="text-xs" /> Add Course
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-base-100 border-t border-base-300 px-6 py-4 flex justify-end gap-3">
            <button 
              className="btn btn-ghost btn-sm sm:btn-md" 
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary btn-sm sm:btn-md" 
              onClick={handleAddExperience}
            >
              Save Experience
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ show: false, message: '', type: '' })} 
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={confirmDelete} 
        title="Delete Experience" 
        message="This will permanently remove this record. Continue?" 
        confirmText="Delete" 
        confirmColor="red" 
      />
    </section>
  );
};

export default Experience;