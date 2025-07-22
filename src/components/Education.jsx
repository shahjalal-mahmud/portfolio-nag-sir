import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaPlus, FaTrash } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';
import Toast from '../components/common/Toast';
import ConfirmationModal from '../components/common/ConfirmationModal';

const Education = () => {
  const { user } = useAuth();
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: '' // 'success' or 'error'
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [newEducation, setNewEducation] = useState({
    title: '',
    institution: '',
    url: '',
    year: '',
    result: '',
    courses: ''
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
          // Fallback data if document doesn't exist
          const fallbackData = [
            {
              title: "Master of Science in Computer Science & Engineering",
              institution: "Khulna University, Khulna - 9208, Bangladesh",
              url: "https://ku.ac.bd/",
              year: "Jan 2023 – Nov 2024",
              result: "CGPA: 3.96 (Out of 4.00)",
              courses: "Research Methodology & Ethics, Network Optimization, Human-Computer Interaction, Advanced Probability & Statistics, Advanced Software Engineering, Software Evaluation & Maintenance",
            },
            {
              title: "Bachelor of Technology in Computer Science & Engineering",
              institution: "Adamas University, Kolkata - 700126, India",
              url: "https://adamasuniversity.ac.in/",
              year: "Jul 2018 – Jun 2022",
              result: "CGPA: 9.64 (Out of 10)",
              courses: "Programming & Data Structures, Operating Systems, Computer Networks, Database Management, AI, ML, IoT, Computer Vision, Information Retrieval, and more.",
            },
            {
              title: "Higher Secondary Certificate (Science)",
              institution: "Government Brajalal College, Khulna - 9202, Bangladesh",
              url: "https://www.blcollege.edu.bd/",
              year: "May 2014 – Jul 2016",
              result: "GPA: 5.00 (Out of 5.00)",
            },
            {
              title: "Secondary School Certificate (Science)",
              institution: "Damodar M. M. Secondary School, Khulna - 9210, Bangladesh",
              url: "https://www.sohopathi.com/damodar-m-m-high-school/",
              year: "Jan 2012 – Mar 2014",
              result: "GPA: 5.00 (Out of 5.00)",
            }
          ];
          setEducationData(fallbackData);
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
    if (!newEducation.title || !newEducation.institution || !newEducation.year || !newEducation.result) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "education");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      const updatedData = [newEducation, ...currentData];

      await updateDoc(docRef, {
        items: updatedData
      });

      setEducationData(prev => [newEducation, ...prev]);
      setShowAddModal(false);
      setNewEducation({
        title: '',
        institution: '',
        url: '',
        year: '',
        result: '',
        courses: ''
      });
      showToast('Education added successfully!', 'success');
    } catch (error) {
      console.error("Error adding education:", error);
      showToast('Failed to add education. Please try again.', 'error');
    }
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

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <section
      id="education"
      className="text-gray-900 px-6 pt-16 pb-28"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto" data-aos="fade-up" data-aos-delay="100">
        <div className="flex justify-between items-center mb-14">
          <h3 className="text-3xl lg:text-4xl font-bold">Education</h3>
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
          {/* Center Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 w-1 h-full bg-primary transform -translate-x-1/2"></div>

          <div className="space-y-20">
            {educationData.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col lg:flex-row items-start gap-6 lg:gap-0 ${isLeft ? "lg:justify-start" : "lg:justify-end"
                    }`}
                  data-aos={isLeft ? "fade-right" : "fade-left"}
                  data-aos-delay={idx * 100}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-2 lg:top-1/2 lg:-translate-y-1/2 z-20">
                    <div className="w-4 h-4 rounded-full bg-primary border-4 border-white"></div>
                  </div>

                  {/* Timeline Card */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`group bg-white shadow-md rounded-xl p-6 w-full lg:w-[45%] z-10 relative ${isLeft ? "lg:mr-auto" : "lg:ml-auto"}`}
                  >
                    {user && (
                      <button
                        onClick={() => handleDeleteClick(idx)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Delete education"
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
                    <div className="text-sm text-primary font-semibold mb-1">
                      {item.year}
                    </div>
                    <h4 className="text-xl font-bold">{item.title}</h4>
                    <p className="text-sm mt-1 font-medium italic">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 hover:underline"
                      >
                        {item.institution}
                      </a>
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-semibold">{item.result}</span>
                    </p>
                    {item.courses && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Courses:</span>{" "}
                        {item.courses}
                      </p>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Education Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Add New Education
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  value={newEducation.title}
                  onChange={(e) => setNewEducation({ ...newEducation, title: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Master of Science in Computer Science"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Institution*</label>
                <input
                  type="text"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., University of Example"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Institution URL</label>
                <input
                  type="url"
                  value={newEducation.url}
                  onChange={(e) => setNewEducation({ ...newEducation, url: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://example.edu"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Year*</label>
                <input
                  type="text"
                  value={newEducation.year}
                  onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., 2020 - 2022"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Result*</label>
                <input
                  type="text"
                  value={newEducation.result}
                  onChange={(e) => setNewEducation({ ...newEducation, result: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., GPA: 3.8/4.0"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Courses (Optional)</label>
                <textarea
                  value={newEducation.courses}
                  onChange={(e) => setNewEducation({ ...newEducation, courses: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows={3}
                  placeholder="List of courses separated by commas"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEducation}
                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
              >
                Add Education
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteEducation}
        message="Are you sure you want to delete this education entry? This action cannot be undone."
        confirmText="Delete"
        confirmColor="red"
        title="Delete Education"
      />

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </section>
  );
};

export default Education;