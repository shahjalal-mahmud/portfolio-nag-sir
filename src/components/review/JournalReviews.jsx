import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaExternalLinkAlt, FaQuoteLeft, FaBookOpen } from "react-icons/fa";
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
          setJournalReviews([]);
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
      setNewJournalReview({ name: '', url: '' });
      setToastMessage(editingIndex !== null ? 'Updated successfully' : 'Added successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error updating journal reviews:", error);
      setToastMessage('Failed to save changes');
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
      await updateDoc(docRef, { items: arrayRemove(journalReviews[reviewToDelete]) });
      setJournalReviews(prev => prev.filter((_, i) => i !== reviewToDelete));
      setToastMessage('Deleted successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting journal review:", error);
      setToastMessage('Failed to delete');
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

  if (loading) return <LoadingAnimation />;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header section with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
            <FaBookOpen className="animate-pulse" /> Peer Review Contributions
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-base-content">
            Journal Article <span className="text-primary">Reviews</span>
          </h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-base-200 px-6 py-3 rounded-2xl border border-base-300 flex items-center gap-4 shadow-inner">
             <div className="text-3xl font-black text-primary">{journalReviews.length}</div>
             <div className="text-xs font-bold leading-tight uppercase opacity-60">Verified<br/>Journals</div>
          </div>
          {user && (
            <button
              onClick={() => {
                setShowAddModal(true);
                setEditingIndex(null);
                setNewJournalReview({ name: '', url: '' });
              }}
              className="btn btn-primary shadow-lg shadow-primary/30"
            >
              <FaPlus /> Add New
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {journalReviews.map((journal, index) => {
            const [jName, publisher] = journal.name.split(',').map(s => s.trim());
            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="h-full bg-base-100 rounded-2xl border border-base-300 group-hover:border-primary/50 p-6 transition-all duration-300 shadow-sm group-hover:shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300">
                        <FaQuoteLeft size={18} />
                      </div>
                      <a 
                        href={journal.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-circle btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Visit Journal"
                      >
                        <FaExternalLinkAlt size={14} className="text-primary" />
                      </a>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-base-content leading-tight group-hover:text-primary transition-colors">
                        {jName}
                      </h4>
                      {publisher && (
                        <span className="badge badge-secondary badge-outline badge-sm mt-2 font-semibold">
                          {publisher}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-base-200 pt-4">
                    <div className="text-[10px] font-black uppercase tracking-tighter opacity-40">Reviewer Record</div>
                    
                    {user && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditJournalReview(index)}
                          className="btn btn-square btn-ghost btn-xs text-info"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteJournalReview(index)}
                          className="btn btn-square btn-ghost btn-xs text-error"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal - Themed and Responsive */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-base-300">
          <div className="bg-primary p-6 text-primary-content">
            <h3 className="text-2xl font-black">
              {editingIndex !== null ? 'Edit Reviewer Entry' : 'New Journal Contribution'}
            </h3>
            <p className="text-sm opacity-80 font-medium">Add journal details and verification link</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold uppercase text-xs opacity-60">Journal & Publisher</span>
              </label>
              <input
                type="text"
                value={newJournalReview.name}
                onChange={(e) => setNewJournalReview({ ...newJournalReview, name: e.target.value })}
                className="input input-bordered focus:input-primary w-full bg-base-200/50"
                placeholder="e.g., Pattern Recognition, Elsevier"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold uppercase text-xs opacity-60">Verification / Journal URL</span>
              </label>
              <input
                type="url"
                value={newJournalReview.url}
                onChange={(e) => setNewJournalReview({ ...newJournalReview, url: e.target.value })}
                className="input input-bordered focus:input-primary w-full bg-base-200/50"
                placeholder="https://journal-link.com"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddJournalReview}
                className="btn btn-primary px-8"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Standard Notifications */}
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
        message="Are you sure you want to remove this journal review record from your portfolio?"
        confirmText="Remove"
        cancelText="Cancel"
        confirmColor="red"
        title="Delete Record"
      />
    </div>
  );
};

export default JournalReviews;