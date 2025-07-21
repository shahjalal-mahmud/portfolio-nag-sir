import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from '../hero/Modal';
import LoadingAnimation from '.././LoadingAnimation';

const fallbackTechnicalProgram = [
  {
    name: "ICRTCIS-2025",
    date: "June 2025",
    title: "6th Int. Conf. on Recent Trends in Communication & Intelligent System",
    location: "Jaipur, Rajasthan, India",
    publisher: "Springer, IET",
  }
];

const TechnicalProgramCommittee = () => {
  const { user } = useAuth();
  const [technicalPrograms, setTechnicalPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newProgram, setNewProgram] = useState({
    name: '',
    date: '',
    title: '',
    location: '',
    publisher: ''
  });

  useEffect(() => {
    const fetchTechnicalPrograms = async () => {
      try {
        const docRef = doc(db, "portfolio", "technicalPrograms");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data().items || [];
          setTechnicalPrograms(data);
        } else {
          setTechnicalPrograms(fallbackTechnicalProgram);
        }
      } catch (error) {
        console.error("Error fetching technical programs:", error);
        setTechnicalPrograms(fallbackTechnicalProgram);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicalPrograms();
  }, []);

  const handleAddProgram = async () => {
    if (!newProgram.name || !newProgram.date || !newProgram.title || !newProgram.location || !newProgram.publisher) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "technicalPrograms");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        updatedData = [...currentData];
        updatedData[editingIndex] = newProgram;
      } else {
        // Add new item to the top
        updatedData = [newProgram, ...currentData];
      }

      await updateDoc(docRef, { items: updatedData });
      setTechnicalPrograms(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewProgram({
        name: '',
        date: '',
        title: '',
        location: '',
        publisher: ''
      });
    } catch (error) {
      console.error("Error updating technical programs:", error);
    }
  };

  const handleDeleteProgram = async (index) => {
    try {
      const docRef = doc(db, "portfolio", "technicalPrograms");
      await updateDoc(docRef, {
        items: arrayRemove(technicalPrograms[index])
      });

      setTechnicalPrograms(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting technical program:", error);
    }
  };

  const handleEditProgram = (index) => {
    setNewProgram(technicalPrograms[index]);
    setEditingIndex(index);
    setShowAddModal(true);
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="mb-20">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <h3 className="text-2xl font-bold text-gray-900">Technical Program Committee Member</h3>
          <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {technicalPrograms.length} Conference{technicalPrograms.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {user && (
          <button
            onClick={() => {
              setShowAddModal(true);
              setEditingIndex(null);
              setNewProgram({
                name: '',
                date: '',
                title: '',
                location: '',
                publisher: ''
              });
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus /> Add New
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {technicalPrograms.map((conf, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
          >
            {user && (
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditProgram(index);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-colors bg-white p-1 rounded"
                  aria-label="Edit program"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteProgram(index);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors bg-white p-1 rounded"
                  aria-label="Delete program"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold text-blue-700">{conf.name}</h4>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {conf.date}
                </span>
              </div>
              
              <p className="text-gray-800 mb-3">{conf.title}</p>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {conf.location}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span>Published by <span className="font-medium">{conf.publisher}</span></span>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Technical Program Committee Member
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Program Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setEditingIndex(null);
        setNewProgram({
          name: '',
          date: '',
          title: '',
          location: '',
          publisher: ''
        });
      }}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {editingIndex !== null ? 'Edit Technical Program' : 'Add New Technical Program'}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Conference Name*</label>
                <input
                  type="text"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., ICRTCIS-2025"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Date*</label>
                <input
                  type="text"
                  value={newProgram.date}
                  onChange={(e) => setNewProgram({ ...newProgram, date: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., June 2025"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Conference Title*</label>
                <input
                  type="text"
                  value={newProgram.title}
                  onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., 6th Int. Conf. on Recent Trends..."
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Location*</label>
                <input
                  type="text"
                  value={newProgram.location}
                  onChange={(e) => setNewProgram({ ...newProgram, location: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Jaipur, Rajasthan, India"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Publisher*</label>
                <input
                  type="text"
                  value={newProgram.publisher}
                  onChange={(e) => setNewProgram({ ...newProgram, publisher: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Springer, IET"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  setNewProgram({
                    name: '',
                    date: '',
                    title: '',
                    location: '',
                    publisher: ''
                  });
                }}
                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProgram}
                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
              >
                {editingIndex !== null ? 'Update Program' : 'Add Program'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TechnicalProgramCommittee;