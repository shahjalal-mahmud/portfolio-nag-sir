import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaUniversity } from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";
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
    university: {
      name: '',
      url: ''
    },
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
      await updateDoc(docRef, {
        items: arrayRemove(experienceData[itemToDelete])
      });

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
          const fallbackData = [
            {
              title: "Lecturer",
              university: {
                name: "Northern University of Business & Technology Khulna, Khulna-9100, Bangladesh",
                url: "https://nubtkhulna.ac.bd/"
              },
              period: "March 2024 – Ongoing",
              department: "Department of Computer Science and Engineering",
              courses: [
                "Artificial Intelligence and Expert systems",
                "Pattern Recognition",
                "Numerical Methods",
                "Computer Graphics and Multimedia System",
                "Digital Logic Design and more",
              ],
            },
            {
              title: "Adjunct Lecturer",
              university: {
                name: "North Western University, Khulna-9100, Bangladesh",
                url: "https://nwu.ac.bd/"
              },
              period: "January 2023 – February 2024",
              department: "Department of Computer Science and Engineering",
              courses: [
                "Computer Programming",
                "Numerical Analysis",
                "Digital Logic Design",
                "Artificial Intelligence and more",
              ],
            },
          ];
          setExperienceData(fallbackData);
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

      await updateDoc(docRef, {
        items: updatedData
      });

      setExperienceData(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewExperience({
        title: '',
        university: {
          name: '',
          url: ''
        },
        period: '',
        department: '',
        courses: []
      });
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

  const addCourseField = () => {
    setNewExperience({ ...newExperience, courses: [...newExperience.courses, ''] });
  };

  const removeCourseField = (index) => {
    const updatedCourses = newExperience.courses.filter((_, i) => i !== index);
    setNewExperience({ ...newExperience, courses: updatedCourses });
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <section id="experience" className="py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 relative inline-block">
            <MdWorkOutline className="inline-block text-blue-600 mr-3 align-middle" />
            Work Experience
          </h2>
          {user && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus /> Add New
            </button>
          )}
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-8 top-0 h-full w-1 bg-gray-200"></div>

          <div className="space-y-10">
            {experienceData.map((exp, idx) => (
              <div key={idx} className="relative">
                <div className="hidden md:block absolute left-8 transform -translate-x-1/2 -translate-y-1/2 top-12 w-5 h-5 rounded-full bg-blue-600 border-4 border-white z-10"></div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group bg-white md:ml-24 p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
                >
                  {user && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEditExperience(idx)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="Edit experience"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Delete experience"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-blue-600 font-medium mb-2">
                        <FaUniversity className="inline-block mr-2" />
                        {exp.department}
                      </p>
                      <p className="text-gray-500 italic">
                        <a
                          href={exp.university.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 hover:underline"
                        >
                          {exp.university.name}
                        </a>
                      </p>
                    </div>
                    <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg font-medium">
                      {exp.period}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200">
                      Courses Conducted
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {exp.courses.map((course, i) => (
                        <div key={i} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <span className="text-gray-700">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Experience Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setEditingIndex(null);
        setNewExperience({
          title: '',
          university: {
            name: '',
            url: ''
          },
          period: '',
          department: '',
          courses: []
        });
      }}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {editingIndex !== null ? 'Edit Experience' : 'Add New Experience'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Lecturer"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">University/Institution Name*</label>
                <input
                  type="text"
                  value={newExperience.university.name}
                  onChange={(e) => setNewExperience({
                    ...newExperience,
                    university: {
                      ...newExperience.university,
                      name: e.target.value
                    }
                  })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Northern University of Business & Technology Khulna"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">University/Institution URL</label>
                <input
                  type="url"
                  value={newExperience.university.url}
                  onChange={(e) => setNewExperience({
                    ...newExperience,
                    university: {
                      ...newExperience.university,
                      url: e.target.value
                    }
                  })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://example.edu"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Period*</label>
                <input
                  type="text"
                  value={newExperience.period}
                  onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., March 2024 – Ongoing"
                  required
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Department*</label>
                <input
                  type="text"
                  value={newExperience.department}
                  onChange={(e) => setNewExperience({ ...newExperience, department: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Department of Computer Science and Engineering"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Courses Conducted</label>
                <div className="space-y-3">
                  {newExperience.courses.map((course, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={course}
                        onChange={(e) => handleCourseChange(index, e.target.value)}
                        className="flex-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder={`Course ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeCourseField(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCourseField}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm sm:text-base mt-2"
                  >
                    <FaPlus size={12} /> Add Course
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  setNewExperience({
                    title: '',
                    university: {
                      name: '',
                      url: ''
                    },
                    period: '',
                    department: '',
                    courses: []
                  });
                }}
                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExperience}
                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
              >
                {editingIndex !== null ? 'Update Experience' : 'Add Experience'}
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
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Experience"
        message="Are you sure you want to delete this experience? This action cannot be undone."
        confirmText="Delete"
        confirmColor="red"
      />
    </section>
  );
};

export default Experience;