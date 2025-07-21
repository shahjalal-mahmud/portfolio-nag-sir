import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaUserTie, FaEnvelope, FaExternalLinkAlt, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';

const References = () => {
  const { user } = useAuth();
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newReference, setNewReference] = useState({
    name: '',
    title: '',
    institution: '',
    location: '',
    email: '',
    link: ''
  });

  useEffect(() => {
    const fetchReferencesData = async () => {
      try {
        const docRef = doc(db, "portfolio", "references");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setReferences(docSnap.data().items || []);
        } else {
          // Fallback data if document doesn't exist
          const fallbackData = [
            {
              name: "Dr. Anupam Kumar Bairagi",
              title: "Professor",
              institution: "Computer Science and Engineering Discipline, Khulna University",
              location: "Khulna-9208, Bangladesh",
              email: "anupam@cse.ku.ac.bd",
              link: "https://ku.ac.bd/discipline/cse/faculty/anupam",
            },
            {
              name: "Dr. C Kishor Kumar Reddy",
              title: "Associate Professor",
              institution: "Department of Computer Science and Engineering, Stanley College of Engineering & Technology for Women",
              location: "Hyderabad, Telangana, India",
              email: "drckkreddy@gmail.com",
            }
          ];
          setReferences(fallbackData);
        }
      } catch (error) {
        console.error("Error fetching references data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferencesData();
  }, []);

  const handleAddReference = async () => {
    if (!newReference.name || !newReference.title || !newReference.institution || !newReference.location || !newReference.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "references");
      // Get current data first
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        // If editing, replace the item at editingIndex
        updatedData = [...currentData];
        updatedData[editingIndex] = newReference;
      } else {
        // If adding new, append the new item (to bottom)
        updatedData = [...currentData, newReference];
      }

      // Update the document with the new array
      await updateDoc(docRef, {
        items: updatedData
      });

      // Update local state
      setReferences(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewReference({
        name: '',
        title: '',
        institution: '',
        location: '',
        email: '',
        link: ''
      });
    } catch (error) {
      console.error("Error adding/updating reference:", error);
    }
  };

  const handleDeleteReference = async (index) => {
    try {
      const docRef = doc(db, "portfolio", "references");
      await updateDoc(docRef, {
        items: arrayRemove(references[index])
      });

      setReferences(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting reference:", error);
    }
  };

  const handleEditReference = (index) => {
    setNewReference(references[index]);
    setEditingIndex(index);
    setShowAddModal(true);
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <section id="references" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaUserTie className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Professional References
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Esteemed academic and professional contacts
          </p>
        </div>

        {/* References Grid with Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">My References</h3>
          {user && (
            <button
              onClick={() => {
                setShowAddModal(true);
                setEditingIndex(null);
                setNewReference({
                  name: '',
                  title: '',
                  institution: '',
                  location: '',
                  email: '',
                  link: ''
                });
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus /> Add New
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {references.map((ref, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md relative"
            >
              {user && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleEditReference(index)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Edit reference"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteReference(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete reference"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              )}
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaUserTie className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {ref.link ? (
                      <a
                        href={ref.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors duration-200 flex items-center"
                      >
                        {ref.name}
                        <FaExternalLinkAlt className="ml-2 text-sm" />
                      </a>
                    ) : (
                      ref.name
                    )}
                  </h3>
                  <p className="text-blue-600 font-medium">{ref.title}</p>
                </div>
              </div>

              <div className="space-y-3 pl-16">
                <p className="text-gray-700">{ref.institution}</p>
                <p className="text-gray-600">{ref.location}</p>
                <div className="flex items-start mt-4">
                  <FaEnvelope className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                  <a
                    href={`mailto:${ref.email}`}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {ref.email}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Reference Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setEditingIndex(null);
        setNewReference({
          name: '',
          title: '',
          institution: '',
          location: '',
          email: '',
          link: ''
        });
      }}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {editingIndex !== null ? 'Edit Reference' : 'Add New Reference'}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Name*</label>
                <input
                  type="text"
                  value={newReference.name}
                  onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Dr. John Smith"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  value={newReference.title}
                  onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Professor, Associate Professor"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Institution*</label>
                <input
                  type="text"
                  value={newReference.institution}
                  onChange={(e) => setNewReference({ ...newReference, institution: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., University of Example"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Location*</label>
                <input
                  type="text"
                  value={newReference.location}
                  onChange={(e) => setNewReference({ ...newReference, location: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., City, Country"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  value={newReference.email}
                  onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., example@university.edu"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Profile Link (Optional)</label>
                <input
                  type="url"
                  value={newReference.link}
                  onChange={(e) => setNewReference({ ...newReference, link: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://example.com/profile"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  setNewReference({
                    name: '',
                    title: '',
                    institution: '',
                    location: '',
                    email: '',
                    link: ''
                  });
                }}
                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReference}
                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
              >
                {editingIndex !== null ? 'Update Reference' : 'Add Reference'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default References;