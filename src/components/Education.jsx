import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
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

  return (
    <>
      <section id="education" className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FaGraduationCap className="text-xl text-primary" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-base-content">
                  Education
                </h2>
              </div>
              <div className="h-1 w-16 bg-primary rounded-full ml-13"></div>
            </div>
            {user && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary btn-sm sm:btn-md gap-2"
              >
                <FaPlus className="text-sm" /> Add New
              </button>
            )}
          </div>

          {/* Timeline */}
          {educationData.length > 0 ? (
            <div className="relative">
              {/* Timeline Line - Hidden on mobile */}
              <div className="hidden md:block absolute left-8 top-8 bottom-8 w-0.5 bg-base-300"></div>

              {/* Education Cards */}
              <div className="space-y-8">
                {educationData.map((item, idx) => {
                  const coursesArray = item.courses ? item.courses.split(', ') : [];

                  return (
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
                                  onClick={() => handleEditEducation(idx)}
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

                            {/* Year Badge */}
                            <div className="mb-1">
                              <span className="badge badge-primary badge-sm font-semibold uppercase tracking-wide">
                                {item.year}
                              </span>
                              {item.isPresent && (
                                <span className="badge badge-success badge-sm font-semibold ml-2">
                                  <span className="w-1.5 h-1.5 bg-current rounded-full mr-1"></span>
                                  Present
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-2 pr-16">
                              {item.title}
                            </h3>

                            {/* Institution Link */}
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors mb-2 group/link"
                              >
                                <FaUniversity className="text-lg shrink-0" />
                                <span className="font-medium text-sm sm:text-base">{item.institution}</span>
                              </a>
                            )}

                            {/* Result Badge */}
                            {item.result && (
                              <div className="mb-4">
                                <div className="inline-flex items-center gap-2 badge badge-info badge-lg px-3 py-3">
                                  <FaAward className="text-sm" />
                                  <span className="font-medium">{item.result}</span>
                                </div>
                              </div>
                            )}

                            {/* Courses */}
                            {coursesArray.length > 0 && (
                              <div className="border-t border-base-300 pt-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <FaBookOpen className="text-sm text-base-content/60" />
                                  <span className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                                    Key Coursework
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {coursesArray.map((course, i) => (
                                    <span
                                      key={i}
                                      className="badge badge-ghost text-xs sm:text-sm px-3 py-3 hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                      {course.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
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
                  <FaPlus className="mr-2" /> Add Education
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Modal */}
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
              className="relative bg-base-100 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl z-10"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-base-100 border-b border-base-300 px-6 py-4 z-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-base-content">
                    {editingIndex !== null ? 'Edit Education' : 'New Education'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="btn btn-ghost btn-circle btn-sm"
                    aria-label="Close"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-4">

                  {/* Degree Title */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-sm">Degree Title</span>
                    </label>
                    <input
                      type="text"
                      value={newEducation.title}
                      onChange={(e) => setNewEducation({ ...newEducation, title: e.target.value })}
                      className="input input-bordered focus:input-primary"
                      placeholder="e.g., Bachelor of Science in Computer Science"
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
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                        className="input input-bordered focus:input-primary"
                        placeholder="University name"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-sm">Website URL</span>
                      </label>
                      <input
                        type="url"
                        value={newEducation.url}
                        onChange={(e) => setNewEducation({ ...newEducation, url: e.target.value })}
                        className="input input-bordered focus:input-primary"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Year & Result */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-sm">Timeline</span>
                      </label>
                      <input
                        type="text"
                        value={newEducation.year}
                        onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                        className="input input-bordered focus:input-primary"
                        placeholder="e.g., 2020 - 2024"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-sm">Grade/Result</span>
                      </label>
                      <input
                        type="text"
                        value={newEducation.result}
                        onChange={(e) => setNewEducation({ ...newEducation, result: e.target.value })}
                        className="input input-bordered focus:input-primary"
                        placeholder="e.g., GPA: 3.9/4.0"
                      />
                    </div>
                  </div>

                  {/* Coursework */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-sm">Key Coursework</span>
                    </label>
                    <textarea
                      value={newEducation.courses}
                      onChange={(e) => setNewEducation({ ...newEducation, courses: e.target.value })}
                      className="textarea textarea-bordered focus:textarea-primary resize-none"
                      rows={4}
                      placeholder="Data Structures, Algorithms, Database Systems, Web Development"
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">
                        Separate courses with commas
                      </span>
                    </label>
                  </div>

                  {/* Currently Enrolled Checkbox */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="checkbox"
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

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-base-100 border-t border-base-300 px-6 py-4 flex justify-end gap-3">
                <button
                  className="btn btn-ghost btn-sm sm:btn-md"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm sm:btn-md"
                  onClick={handleAddEducation}
                >
                  {editingIndex !== null ? 'Update' : 'Save Education'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteEducation}
        message="Are you sure you want to delete this education record? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
        title="Delete Education Record"
      />

      {/* Toast Notification */}
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