import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaMapMarkerAlt, FaRegCalendarAlt, FaBuilding, FaMicrochip } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from '../hero/Modal';
import LoadingAnimation from '.././LoadingAnimation';
import Toast from '../common/Toast';
import ConfirmationModal from '../common/ConfirmationModal';

const ConferenceReviews = () => {
  const { user } = useAuth();
  const [conferenceReviews, setConferenceReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [newConferenceReview, setNewConferenceReview] = useState({
    name: '',
    date: '',
    title: '',
    location: '',
    publisher: ''
  });

  useEffect(() => {
    const fetchConferenceReviewsData = async () => {
      try {
        const docRef = doc(db, "portfolio", "conferenceReviews");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setConferenceReviews(docSnap.data().items || []);
        } else {
          setConferenceReviews([]);
        }
      } catch (error) {
        console.error("Error fetching conference reviews data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConferenceReviewsData();
  }, []);

  const handleAddConferenceReview = async () => {
    if (!newConferenceReview.name || !newConferenceReview.date || !newConferenceReview.title || !newConferenceReview.location || !newConferenceReview.publisher) {
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "conferenceReviews");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        updatedData = [...currentData];
        updatedData[editingIndex] = newConferenceReview;
      } else {
        updatedData = [newConferenceReview, ...currentData];
      }

      await updateDoc(docRef, { items: updatedData });
      setConferenceReviews(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewConferenceReview({ name: '', date: '', title: '', location: '', publisher: '' });
      setToastMessage(editingIndex !== null ? 'Updated successfully' : 'Added successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error updating conference reviews:", error);
      setToastMessage(`Failed to save review`);
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (reviewToDelete === null) return;
    try {
      const docRef = doc(db, "portfolio", "conferenceReviews");
      await updateDoc(docRef, { items: arrayRemove(conferenceReviews[reviewToDelete]) });
      setConferenceReviews(prev => prev.filter((_, i) => i !== reviewToDelete));
      setToastMessage('Conference review deleted');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting:", error);
      setToastMessage('Failed to delete');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        {/* Title & Tagline */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-sm">
            <FaMicrochip /> Academic Contributions
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">
            Conference <span className="text-primary">Reviews</span>
          </h2>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-4">
          {/* Statistics Card */}
          <div className="stats shadow bg-base-200 hidden sm:inline-flex">
            <div className="stat py-2 px-4">
              <div className="stat-title text-xs uppercase">Total Experiences</div>
              <div className="stat-value text-2xl text-primary">
                {conferenceReviews.length}
              </div>
            </div>
          </div>

          {/* Admin Action Button */}
          {user && (
            <button
              onClick={() => {
                setShowAddModal(true);
                setEditingIndex(null);
                setNewConferenceReview({
                  name: '',
                  date: '',
                  title: '',
                  location: '',
                  publisher: ''
                });
              }}
              className="btn btn-primary btn-md shadow-lg shadow-primary/20 gap-2"
            >
              <FaPlus /> Add Experience
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {conferenceReviews.map((conf, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="group relative h-full"
            >
              <div className="h-full bg-base-100 border border-base-300 hover:border-primary/50 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col">

                {/* Header: Acronym & Date */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <span className="px-3 py-1 bg-base-200 text-base-content rounded-md text-xs font-black uppercase tracking-widest">
                    {conf.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-base-content/60 font-semibold italic">
                    <FaRegCalendarAlt className="text-primary" />
                    {conf.date}
                  </div>
                </div>

                {/* Main Content */}
                <div className="grow">
                  <h4 className="text-lg font-bold text-base-content leading-snug group-hover:text-primary transition-colors mb-4">
                    {conf.title}
                  </h4>

                  <div className="space-y-2 text-sm text-base-content/70">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="mt-1 text-primary shrink-0" />
                      <span>{conf.location}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaBuilding className="mt-1 text-primary shrink-0" />
                      <span>Published via <span className="text-base-content font-bold">{conf.publisher}</span></span>
                    </div>
                  </div>
                </div>

                {/* Footer / Actions */}
                <div className="mt-6 pt-4 border-t border-base-200 flex justify-between items-center">
                  <div className="badge badge-outline badge-sm font-bold opacity-50 uppercase tracking-tighter">Verified Reviewer</div>

                  {user && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setNewConferenceReview(conf); setEditingIndex(index); setShowAddModal(true); }}
                        className="btn btn-ghost btn-xs text-info hover:bg-info/10"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => { setReviewToDelete(index); setIsDeleteModalOpen(true); }}
                        className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Section */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-xl border border-base-300 overflow-hidden">
          <div className="p-1 bg-primary" />
          <div className="p-8">
            <h3 className="text-2xl font-black mb-6">
              {editingIndex !== null ? 'Modify' : 'New'} Review Experience
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label-text text-xs font-bold uppercase mb-1">Acronym</label>
                  <input
                    type="text" value={newConferenceReview.name}
                    onChange={(e) => setNewConferenceReview({ ...newConferenceReview, name: e.target.value })}
                    className="input input-bordered focus:input-primary bg-base-200"
                    placeholder="WcCST-2026"
                  />
                </div>
                <div className="form-control">
                  <label className="label-text text-xs font-bold uppercase mb-1">Date</label>
                  <input
                    type="text" value={newConferenceReview.date}
                    onChange={(e) => setNewConferenceReview({ ...newConferenceReview, date: e.target.value })}
                    className="input input-bordered focus:input-primary bg-base-200"
                    placeholder="March 2026"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label-text text-xs font-bold uppercase mb-1">Full Title</label>
                <textarea
                  value={newConferenceReview.title}
                  onChange={(e) => setNewConferenceReview({ ...newConferenceReview, title: e.target.value })}
                  className="textarea textarea-bordered focus:textarea-primary bg-base-200 leading-tight"
                  placeholder="World Conference on..."
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label-text text-xs font-bold uppercase mb-1">Location</label>
                  <input
                    type="text" value={newConferenceReview.location}
                    onChange={(e) => setNewConferenceReview({ ...newConferenceReview, location: e.target.value })}
                    className="input input-bordered focus:input-primary bg-base-200"
                    placeholder="Punjab, India"
                  />
                </div>
                <div className="form-control">
                  <label className="label-text text-xs font-bold uppercase mb-1">Publisher</label>
                  <input
                    type="text" value={newConferenceReview.publisher}
                    onChange={(e) => setNewConferenceReview({ ...newConferenceReview, publisher: e.target.value })}
                    className="input input-bordered focus:input-primary bg-base-200"
                    placeholder="IEEE"
                  />
                </div>
              </div>
            </div>

            <div className="modal-action mt-10">
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleAddConferenceReview} className="btn btn-primary px-8">Save Experience</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Notifications */}
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
      <ConfirmationModal
        isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete} message="Delete this review entry?"
        confirmText="Remove" cancelText="Cancel" confirmColor="red" title="Confirm Delete"
      />
    </div>
  );
};

export default ConferenceReviews;