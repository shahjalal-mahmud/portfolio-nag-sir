import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaExternalLinkAlt, FaGraduationCap, FaCalendarAlt, FaUniversity, FaAward, FaBookOpen, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import LoadingAnimation from '../components/LoadingAnimation';
import Toast from '../components/common/Toast';
import ConfirmationModal from '../components/common/ConfirmationModal';

const Education = () => {
  const { user } = useAuth();
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: ''
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [newEducation, setNewEducation] = useState({
    title: '',
    institution: '',
    url: '',
    year: '',
    result: '',
    courses: '',
    isPresent: false
  });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const toggleCardExpansion = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const docRef = doc(db, "portfolio", "education");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEducationData(docSnap.data().items || []);
        } else {
          setEducationData([]);
        }
      } catch (error) {
        console.error("Error fetching education data:", error);
        showToast('Failed to load education data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEducationData();
  }, []);

  const handleAddEducation = async () => {
    if (!newEducation.title || !newEducation.institution || !newEducation.year) {
      showToast('Please fill in all required fields (Title, Institution, and Year)', 'error');
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "education");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        updatedData = [...currentData];
        updatedData[editingIndex] = newEducation;
      } else {
        updatedData = [newEducation, ...currentData];
      }

      await updateDoc(docRef, { items: updatedData });

      setEducationData(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewEducation({
        title: '', institution: '', url: '', year: '', result: '', courses: '', isPresent: false
      });
      
      showToast(editingIndex !== null ? 'Education updated successfully!' : 'Education added successfully!', 'success');
    } catch (error) {
      console.error("Error adding/updating education:", error);
      showToast('Failed to save education. Please try again.', 'error');
    }
  };

  const handleEditEducation = (index) => {
    setNewEducation(educationData[index]);
    setEditingIndex(index);
    setShowAddModal(true);
  };

  const handleDeleteClick = (index) => {
    setItemToDelete(index);
    setShowConfirmModal(true);
  };

  const handleDeleteEducation = async () => {
    try {
      const docRef = doc(db, "portfolio", "education");
      await updateDoc(docRef, {
        items: arrayRemove(educationData[itemToDelete])
      });

      setEducationData(prev => prev.filter((_, i) => i !== itemToDelete));
      setShowConfirmModal(false);
      showToast('Education deleted successfully!', 'success');
    } catch (error) {
      console.error("Error deleting education:", error);
      showToast('Failed to delete education. Please try again.', 'error');
    }
  };

  const resetForm = () => {
    setNewEducation({
      title: '', institution: '', url: '', year: '', result: '', courses: '', isPresent: false
    });
    setEditingIndex(null);
    setShowAddModal(false);
  };

  if (loading) return <LoadingAnimation />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: "auto", opacity: 1 }
  };

  return (
    <>
      <section id="education" className="py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-12 md:mb-16 lg:mb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-primary text-sm font-medium uppercase tracking-wider">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Academic Journey</span>
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                    Education
                    <span className="text-primary">.</span>
                  </h2>
                  <p className="mt-3 md:mt-4 text-base-content/70 text-lg max-w-2xl">
                    My academic background and qualifications
                  </p>
                </div>
              </div>
              {user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary gap-2 px-6 py-3 rounded-lg font-semibold"
                >
                  <FaPlus className="text-sm" />
                  <span>Add New</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Education Cards Grid */}
          {educationData.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {educationData.map((item, idx) => {
                const coursesArray = item.courses ? item.courses.split(', ') : [];
                const showExpandButton = coursesArray.length > 0;
                const isExpanded = expandedCards[idx];
                
                return (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants}
                    className="card bg-base-100 shadow-lg hover:shadow-xl border border-base-300/50 transition-all duration-300 group h-full flex flex-col"
                  >
                    <div className="card-body p-6 flex flex-col h-full">
                      {/* Main Content - Always Visible */}
                      <div className="flex-1">
                        {/* Logo/Icon and Title */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <FaGraduationCap className="text-xl text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base-content/70 hover:text-primary transition-colors inline-flex items-center gap-2 text-sm"
                            >
                              <FaUniversity className="text-xs" />
                              <span className="line-clamp-1">{item.institution}</span>
                              <FaExternalLinkAlt className="text-[10px]" />
                            </a>
                          </div>
                        </div>

                        {/* Year and Result Badges */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="badge badge-outline gap-2 px-3 py-2">
                            <FaCalendarAlt className="text-primary" />
                            <span className="text-sm">{item.year}</span>
                          </div>
                          {item.isPresent && (
                            <div className="badge badge-success gap-1 px-3 py-2">
                              <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                              Present
                            </div>
                          )}
                          {item.result && (
                            <div className="badge badge-info gap-2 px-3 py-2">
                              <FaAward />
                              <span className="font-medium">{item.result}</span>
                            </div>
                          )}
                        </div>

                        {/* Expandable Section - Coursework */}
                        <AnimatePresence>
                          {showExpandButton && (
                            <motion.div
                              initial="collapsed"
                              animate={isExpanded ? "expanded" : "collapsed"}
                              exit="collapsed"
                              variants={expandVariants}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 border-t border-base-300/30">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <FaBookOpen className="text-secondary" />
                                    <span className="text-sm font-semibold text-base-content/70">
                                      Key Coursework
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {coursesArray.map((course, i) => (
                                    <span 
                                      key={i} 
                                      className="badge badge-outline py-1.5 px-3 text-xs"
                                    >
                                      {course}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Expand Button and Admin Actions */}
                      <div className="mt-6 pt-4 border-t border-base-300/30">
                        <div className="flex items-center justify-between">
                          {showExpandButton && (
                            <button
                              onClick={() => toggleCardExpansion(idx)}
                              className="btn btn-ghost btn-sm gap-2 text-sm"
                            >
                              {isExpanded ? (
                                <>
                                  <span>Show Less</span>
                                  <FaChevronUp className="text-xs" />
                                </>
                              ) : (
                                <>
                                  <span>Show Coursework</span>
                                  <FaChevronDown className="text-xs" />
                                </>
                              )}
                            </button>
                          )}
                          {user && (
                            <div className="flex gap-1 ml-auto">
                              <button
                                onClick={() => handleEditEducation(idx)}
                                className="btn btn-ghost btn-sm btn-square"
                                aria-label="Edit"
                              >
                                <FaEdit className="text-base-content/60 hover:text-primary" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(idx)}
                                className="btn btn-ghost btn-sm btn-square"
                                aria-label="Delete"
                              >
                                <FaTrash className="text-base-content/60 hover:text-error" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 md:py-24">
              <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-base-300 rounded-full flex items-center justify-center mb-6">
                <FaGraduationCap className="text-3xl md:text-4xl text-base-content/40" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Education Records</h3>
              <p className="text-base-content/60 max-w-md mx-auto">
                {user ? "Add your first education record to get started." : "Education information will appear here once added."}
              </p>
              {user && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary mt-6"
                >
                  Add Education
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Education Modal - Fixed Version */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-base-100 p-6 border-b border-base-300 rounded-t-2xl z-20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {editingIndex !== null ? 'Edit Education' : 'Add Education'}
                    </h3>
                    <p className="text-base-content/70 mt-1 text-sm">
                      {editingIndex !== null ? 'Update your education details' : 'Add your new academic achievement'}
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="btn btn-ghost btn-circle"
                    aria-label="Close"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Degree Title <span className="text-error">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        value={newEducation.title}
                        onChange={(e) => setNewEducation({ ...newEducation, title: e.target.value })}
                        className="input input-bordered w-full"
                        placeholder="e.g., Bachelor of Science in Computer Science"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Institution <span className="text-error">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                        className="input input-bordered w-full"
                        placeholder="University name and location"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Institution URL</span>
                      </label>
                      <input
                        type="url"
                        value={newEducation.url}
                        onChange={(e) => setNewEducation({ ...newEducation, url: e.target.value })}
                        className="input input-bordered w-full"
                        placeholder="https://university.edu"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Timeline <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={newEducation.year}
                          onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                          className="input input-bordered w-full"
                          placeholder="e.g., 2020 - 2024"
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Grade/Result</span>
                        </label>
                        <input
                          type="text"
                          value={newEducation.result}
                          onChange={(e) => setNewEducation({ ...newEducation, result: e.target.value })}
                          className="input input-bordered w-full"
                          placeholder="e.g., GPA: 3.9/4.0"
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Coursework</span>
                      </label>
                      <textarea
                        value={newEducation.courses}
                        onChange={(e) => setNewEducation({ ...newEducation, courses: e.target.value })}
                        className="textarea textarea-bordered w-full resize-none"
                        rows={4}
                        placeholder="List key courses separated by commas (e.g., Data Structures, Algorithms, Database Systems)"
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Separate courses with commas
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-3">
                        <input
                          type="checkbox"
                          id="isPresent"
                          checked={newEducation.isPresent}
                          onChange={(e) => setNewEducation({ ...newEducation, isPresent: e.target.checked })}
                          className="checkbox checkbox-primary"
                        />
                        <span className="label-text">
                          Currently enrolled in this program
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-base-300">
                  <button
                    onClick={resetForm}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEducation}
                    className="btn btn-primary"
                  >
                    {editingIndex !== null ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteEducation}
        message="Are you sure you want to delete this education record? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
        title="Delete Education Record"
      />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </>
  );
};

export default Education;