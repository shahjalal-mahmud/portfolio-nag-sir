import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from '../hero/Modal';
import LoadingAnimation from '.././LoadingAnimation';
import Toast from '../common/Toast';
import ConfirmationModal from '../common/ConfirmationModal';

const JournalReviews = () => {
  const { user } = useAuth();
  const [journalReviews, setJournalReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [newJournalReview, setNewJournalReview] = useState({
    name: '',
    url: '',
  });

  useEffect(() => {
    const fetchJournalReviewsData = async () => {
      try {
        const docRef = doc(db, "portfolio", "journalReviews");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data().items || [];
          setJournalReviews(data);
        } else {
          // Fallback data
          const fallbackData = [
            {
              name: "Pattern Recognition, Elsevier",
              url: "https://www.sciencedirect.com/journal/pattern-recognition",
            },
            {
              name: "IEEE Access, IEEE",
              url: "https://ieeeaccess.ieee.org",
            },
            {
              name: "Transactions on Emerging Telecommunications Technologies, Wiley",
              url: "https://onlinelibrary.wiley.com/journal/21613915",
            },
            {
              name: "Human-Centric Intelligent Systems, Springer",
              url: "https://link.springer.com/journal/44230",
            },
            {
              name: "PLOS Digital Health, PLOS",
              url: "https://journals.plos.org/digitalhealth/",
            },
            {
              name: "Frontiers in Nutrition, Frontiers",
              url: "https://www.frontiersin.org/journals/nutrition",
            },
            {
              name: "Frontiers in Oncology, Frontiers",
              url: "https://www.frontiersin.org/journals/oncology",
            },
            {
              name: "Computer Methods in Biomechanics and Biomedical Engineering, Taylor & Francis",
              url: "https://www.tandfonline.com/journals/gcmb20",
            },
            {
              name: "Artificial Intelligence and Applications, Bon View Publishing",
              url: "https://ojs.bonviewpress.com/index.php/AIA/index",
            },
            {
              name: "International Journal of Computing and Digital Systems, University of Bahrain, Bahrain",
              url: "https://ijcds.uob.edu.bh/",
            },
            {
              name: "Discover Artificial Intelligence, Springer Nature",
              url: "https://link.springer.com/journal/44163",
            },
          ];
          setJournalReviews(fallbackData);
        }
      } catch (error) {
        console.error("Error fetching journal reviews data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournalReviewsData();
  }, []);

  const handleAddJournalReview = async () => {
    if (!newJournalReview.name || !newJournalReview.url) {
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "journalReviews");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        updatedData = [...currentData];
        updatedData[editingIndex] = newJournalReview;
      } else {
        updatedData = [newJournalReview, ...currentData];
      }

      await updateDoc(docRef, { items: updatedData });
      setJournalReviews(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewJournalReview({
        name: '',
        url: ''
      });
      setToastMessage(editingIndex !== null ? 'Journal review updated successfully' : 'Journal review added successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error updating journal reviews:", error);
      setToastMessage(`Failed to ${editingIndex !== null ? 'update' : 'add'} journal review`);
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleDeleteJournalReview = (index) => {
    setReviewToDelete(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (reviewToDelete === null) return;

    try {
      const docRef = doc(db, "portfolio", "journalReviews");
      await updateDoc(docRef, {
        items: arrayRemove(journalReviews[reviewToDelete])
      });

      setJournalReviews(prev => prev.filter((_, i) => i !== reviewToDelete));
      setToastMessage('Journal review deleted successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting journal review:", error);
      setToastMessage('Failed to delete journal review');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleEditJournalReview = (index) => {
    setNewJournalReview(journalReviews[index]);
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
          <h3 className="text-2xl font-bold text-gray-900">Journal Article Reviews</h3>
          <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {journalReviews.length} Journals
          </div>
        </div>

        {user && (
          <button
            onClick={() => {
              setShowAddModal(true);
              setEditingIndex(null);
              setNewJournalReview({
                name: '',
                url: ''
              });
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus /> Add New
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {journalReviews.map((journal, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative group"
          >
            {user && (
              <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditJournalReview(index);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-colors bg-white p-1 rounded"
                  aria-label="Edit journal review"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteJournalReview(index);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors bg-white p-1 rounded"
                  aria-label="Delete journal review"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}
            <a
              href={journal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-4">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{journal.name.split(',')[0]}</p>
                  <p className="text-gray-600 text-sm">{journal.name.split(',')[1]}</p>
                  <p className="text-gray-500 text-xs mt-1">{journal.year}</p>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Journal Review Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setEditingIndex(null);
        setNewJournalReview({
          name: '',
          url: ''
        });
      }}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {editingIndex !== null ? 'Edit Journal Review' : 'Add New Journal Review'}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Journal Name*</label>
                <input
                  type="text"
                  value={newJournalReview.name}
                  onChange={(e) => setNewJournalReview({ ...newJournalReview, name: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Pattern Recognition, Elsevier"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">URL*</label>
                <input
                  type="url"
                  value={newJournalReview.url}
                  onChange={(e) => setNewJournalReview({ ...newJournalReview, url: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://example.com/journal"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  setNewJournalReview({
                    name: '',
                    url: ''
                  });
                }}
                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddJournalReview}
                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
              >
                {editingIndex !== null ? 'Update Review' : 'Add Review'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this journal review?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        title="Delete Journal Review"
      />
    </div>
  );
};

export default JournalReviews;