import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaCertificate, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';

const Certifications = () => {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newCertification, setNewCertification] = useState({
    title: '',
    provider: ''
  });

  useEffect(() => {
    const fetchCertificationsData = async () => {
      try {
        const docRef = doc(db, "portfolio", "certifications");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCertifications(docSnap.data().items || []);
        } else {
          // Fallback data if document doesn't exist
          const fallbackData = [
            {
              title: "Introduction to IoT & Cybersecurity",
              provider: "CISCO",
            },
            {
              title: "Advance Your Skills in Deep Learning and Neural Networks",
              provider: "LinkedIn Learning",
            },
            {
              title: "Python for Beginners & Intro to Data Structures & Algorithms",
              provider: "Udemy",
            },
            {
              title: "Excel Skills for Business, Intro to ML, Computer Vision Basics, Python Data Structures",
              provider: "Coursera",
            },
          ];
          setCertifications(fallbackData);
        }
      } catch (error) {
        console.error("Error fetching certifications data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificationsData();
  }, []);

  const handleAddCertification = async () => {
    if (!newCertification.title || !newCertification.provider) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "certifications");
      // Get current data first
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        // If editing, replace the item at editingIndex
        updatedData = [...currentData];
        updatedData[editingIndex] = newCertification;
      } else {
        // If adding new, prepend the new item
        updatedData = [newCertification, ...currentData];
      }

      // Update the document with the new array
      await updateDoc(docRef, {
        items: updatedData
      });

      // Update local state
      setCertifications(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewCertification({
        title: '',
        provider: ''
      });
    } catch (error) {
      console.error("Error adding/updating certification:", error);
    }
  };

  const handleDeleteCertification = async (index) => {
    try {
      const docRef = doc(db, "portfolio", "certifications");
      await updateDoc(docRef, {
        items: arrayRemove(certifications[index])
      });

      setCertifications(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting certification:", error);
    }
  };

  const handleEditCertification = (index) => {
    setNewCertification(certifications[index]);
    setEditingIndex(index);
    setShowAddModal(true);
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaCertificate className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Professional Certifications
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Validated skills and knowledge through accredited programs
          </p>
        </div>

        {/* Certifications grid with add button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">My Certifications</h3>
          {user && (
            <button
              onClick={() => {
                setShowAddModal(true);
                setEditingIndex(null);
                setNewCertification({ title: '', provider: '' });
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus /> Add New
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {user && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white p-1 rounded-bl">
                  <button
                    onClick={() => handleEditCertification(index)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Edit certification"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteCertification(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete certification"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
              
              <div className="pr-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{cert.title}</h3>
                <p className="text-gray-700 mb-4">{cert.provider}</p>
              </div>
              
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-8 h-8 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <a
            href="https://drive.google.com/drive/folders/1uQgdJbvhIzTYHG4_f9ULuEc6CaPcC7dH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            View All Certificates
            <FaExternalLinkAlt className="ml-2 text-sm" />
          </a>
        </div>
      </div>

      {/* Add/Edit Certification Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setEditingIndex(null);
        setNewCertification({ title: '', provider: '' });
      }}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {editingIndex !== null ? 'Edit Certification' : 'Add New Certification'}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  value={newCertification.title}
                  onChange={(e) => setNewCertification({ ...newCertification, title: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Introduction to IoT & Cybersecurity"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Provider*</label>
                <input
                  type="text"
                  value={newCertification.provider}
                  onChange={(e) => setNewCertification({ ...newCertification, provider: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., CISCO, Coursera, Udemy"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  setNewCertification({ title: '', provider: '' });
                }}
                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCertification}
                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
              >
                {editingIndex !== null ? 'Update Certification' : 'Add Certification'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Certifications;