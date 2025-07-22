import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaAward, FaUserTie, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';
import Toast from './common/Toast';
import ConfirmationModal from './common/ConfirmationModal';

const MembershipsAndAwards = () => {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: '' // 'success' or 'error'
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({
    index: null,
    type: null
  });
  const [newMembership, setNewMembership] = useState({
    organization: '',
    period: '',
    role: ''
  });
  const [newAward, setNewAward] = useState({
    title: '',
    session: '',
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch memberships
        const membershipsRef = doc(db, "portfolio", "memberships");
        const membershipsSnap = await getDoc(membershipsRef);

        // Fetch awards
        const awardsRef = doc(db, "portfolio", "awards");
        const awardsSnap = await getDoc(awardsRef);

        if (membershipsSnap.exists()) {
          setMemberships(membershipsSnap.data().items || []);
        } else {
          // Fallback data
          setMemberships([
            {
              organization: "Institute of Electrical and Electronics Engineers (IEEE)",
              period: "From 2023 - Now",
              role: "Graduate Student Member & IEEE Young Professionals",
            },
            {
              organization: "International Association of Engineers (IAENG)",
              period: "From 2023 - Now",
              role: "Professional Member",
            }
          ]);
        }

        if (awardsSnap.exists()) {
          setAwards(awardsSnap.data().items || []);
        } else {
          // Fallback data
          setAwards([
            {
              title: "National Science and Technology (NST) Fellowship",
              session: "Session: 2023-2024",
              description: "Ministry of Science and Technology, Bangladesh",
            },
            {
              title: "Dean's List",
              session: "Session: 2020-2021",
              description: "Awarded the Dean's List Student accolade for exceptional academic performance in the B.Tech (Computer Science Engineering) Program at Adamas University.",
            },
            {
              title: "Merit Scholarship",
              session: "Session: 2020-2021",
              description: "The Adamas University Merit Scholarship for the 2020-2021 session is awarded based on academic performance.",
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddMembership = async () => {
    if (!newMembership.organization || !newMembership.period || !newMembership.role) {
      setToast({
        show: true,
        message: 'Please fill in all required fields',
        type: 'error'
      });
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "memberships");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null && editingType === 'membership') {
        updatedData = [...currentData];
        updatedData[editingIndex] = newMembership;
      } else {
        updatedData = [newMembership, ...currentData];
      }

      await updateDoc(docRef, { items: updatedData });
      setMemberships(updatedData);
      setShowMembershipModal(false);
      setEditingIndex(null);
      setEditingType(null);
      setNewMembership({ organization: '', period: '', role: '' });

      setToast({
        show: true,
        message: editingIndex !== null ? 'Membership updated successfully' : 'Membership added successfully',
        type: 'success'
      });
    } catch (error) {
      console.error("Error updating memberships:", error);
      setToast({
        show: true,
        message: editingIndex !== null ? 'Failed to update membership' : 'Failed to add membership',
        type: 'error'
      });
    }
  };

  const handleAddAward = async () => {
    if (!newAward.title || !newAward.session || !newAward.description) {
      setToast({
        show: true,
        message: 'Please fill in all required fields',
        type: 'error'
      });
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "awards");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null && editingType === 'award') {
        updatedData = [...currentData];
        updatedData[editingIndex] = newAward;
      } else {
        updatedData = [newAward, ...currentData];
      }

      await updateDoc(docRef, { items: updatedData });
      setAwards(updatedData);
      setShowAwardModal(false);
      setEditingIndex(null);
      setEditingType(null);
      setNewAward({ title: '', session: '', description: '' });

      setToast({
        show: true,
        message: editingIndex !== null ? 'Award updated successfully' : 'Award added successfully',
        type: 'success'
      });
    } catch (error) {
      console.error("Error updating awards:", error);
      setToast({
        show: true,
        message: editingIndex !== null ? 'Failed to update award' : 'Failed to add award',
        type: 'error'
      });
    }
  };

  const handleEditItem = (index, type) => {
    if (type === 'membership') {
      setNewMembership(memberships[index]);
      setEditingIndex(index);
      setEditingType('membership');
      setShowMembershipModal(true);
    } else {
      setNewAward(awards[index]);
      setEditingIndex(index);
      setEditingType('award');
      setShowAwardModal(true);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <section id="memberships-awards" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Professional Recognition
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Memberships in professional organizations and academic honors received
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Memberships */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 relative">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaUserTie className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Professional Memberships
              </h3>
            </div>

            {user && (
              <button
                onClick={() => {
                  setShowMembershipModal(true);
                  setEditingIndex(null);
                  setEditingType(null);
                  setNewMembership({ organization: '', period: '', role: '' });
                }}
                className="absolute top-4 right-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
              >
                <FaPlus size={12} /> Add
              </button>
            )}

            <div className="space-y-6">
              {memberships.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="pl-4 border-l-4 border-blue-200 relative group"
                >
                  {user && (
                    <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white p-1 rounded-bl">
                      <button
                        onClick={() => handleEditItem(index, 'membership')}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="Edit membership"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete({ index, type: 'membership' });
                          setShowDeleteModal(true);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Delete membership"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}
                  <div className="pr-8"> {/* Added padding to prevent text overlap */}
                    <div className="flex justify-between items-start flex-wrap gap-y-2">
                      <h4 className="text-xl font-semibold text-gray-900 pr-2">
                        {item.organization}
                      </h4>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {item.period}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{item.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 relative">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaAward className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Honors & Awards
              </h3>
            </div>

            {user && (
              <button
                onClick={() => {
                  setShowAwardModal(true);
                  setEditingIndex(null);
                  setEditingType(null);
                  setNewAward({ title: '', session: '', description: '' });
                }}
                className="absolute top-4 right-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
              >
                <FaPlus size={12} /> Add
              </button>
            )}

            <div className="space-y-6">
              {awards.map((award, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="pl-4 border-l-4 border-green-200 relative group"
                >
                  {user && (
                    <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white p-1 rounded-bl">
                      <button
                        onClick={() => handleEditItem(index, 'award')}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        aria-label="Edit award"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete({ index, type: 'award' });
                          setShowDeleteModal(true);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Delete membership"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}
                  <div className="pr-8"> {/* Added padding to prevent text overlap */}
                    <div className="flex justify-between items-start flex-wrap gap-y-2">
                      <h4 className="text-xl font-semibold text-gray-900 pr-2">
                        {award.title}
                      </h4>
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        {award.session}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{award.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Membership Modal */}
      <Modal isOpen={showMembershipModal} onClose={() => setShowMembershipModal(false)}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {editingIndex !== null ? 'Edit Membership' : 'Add New Membership'}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Organization*</label>
                <input
                  type="text"
                  value={newMembership.organization}
                  onChange={(e) => setNewMembership({ ...newMembership, organization: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Institute of Electrical and Electronics Engineers (IEEE)"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Period*</label>
                <input
                  type="text"
                  value={newMembership.period}
                  onChange={(e) => setNewMembership({ ...newMembership, period: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., From 2023 - Now"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Role*</label>
                <input
                  type="text"
                  value={newMembership.role}
                  onChange={(e) => setNewMembership({ ...newMembership, role: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Graduate Student Member"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => {
                  setShowMembershipModal(false);
                  setEditingIndex(null);
                  setEditingType(null);
                  setNewMembership({ organization: '', period: '', role: '' });
                }}
                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembership}
                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
              >
                {editingIndex !== null ? 'Update Membership' : 'Add Membership'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Award Modal */}
      <Modal isOpen={showAwardModal} onClose={() => setShowAwardModal(false)}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {editingIndex !== null ? 'Edit Award' : 'Add New Award'}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  value={newAward.title}
                  onChange={(e) => setNewAward({ ...newAward, title: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="e.g., National Science and Technology (NST) Fellowship"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Session*</label>
                <input
                  type="text"
                  value={newAward.session}
                  onChange={(e) => setNewAward({ ...newAward, session: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="e.g., Session: 2023-2024"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  value={newAward.description}
                  onChange={(e) => setNewAward({ ...newAward, description: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  rows={4}
                  placeholder="Description of the award..."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => {
                  setShowAwardModal(false);
                  setEditingIndex(null);
                  setEditingType(null);
                  setNewAward({ title: '', session: '', description: '' });
                }}
                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAward}
                className="px-4 py-2 text-sm sm:text-base bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors order-1 sm:order-2"
              >
                {editingIndex !== null ? 'Update Award' : 'Add Award'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          try {
            const { index, type } = itemToDelete;
            const docRef = doc(db, "portfolio", type === 'membership' ? "memberships" : "awards");
            const itemToRemove = type === 'membership' ? memberships[index] : awards[index];

            await updateDoc(docRef, {
              items: arrayRemove(itemToRemove)
            });

            if (type === 'membership') {
              setMemberships(prev => prev.filter((_, i) => i !== index));
            } else {
              setAwards(prev => prev.filter((_, i) => i !== index));
            }

            setToast({
              show: true,
              message: 'Item deleted successfully',
              type: 'success'
            });
          } catch (error) {
            console.error("Error deleting item:", error);
            setToast({
              show: true,
              message: 'Failed to delete item',
              type: 'error'
            });
          } finally {
            setShowDeleteModal(false);
          }
        }}
        title="Confirm Delete"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        confirmColor="red"
      />
    </section>
  );
};

export default MembershipsAndAwards;