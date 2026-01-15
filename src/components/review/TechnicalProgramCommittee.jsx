import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaMapMarkerAlt, FaBook, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from '../hero/Modal';
import LoadingAnimation from '.././LoadingAnimation';
import Toast from '../common/Toast';
import ConfirmationModal from '../common/ConfirmationModal';

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
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
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setShowToast(true);
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
        updatedData = [newProgram, ...currentData];
      }

      await updateDoc(docRef, { items: updatedData });
      setTechnicalPrograms(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewProgram({ name: '', date: '', title: '', location: '', publisher: '' });
      setToastMessage(editingIndex !== null ? 'Program updated successfully' : 'Program added successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error updating technical programs:", error);
      setToastMessage(`Failed to ${editingIndex !== null ? 'update' : 'add'} program`);
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleDeleteProgram = (index) => {
    setProgramToDelete(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (programToDelete === null) return;
    try {
      const docRef = doc(db, "portfolio", "technicalPrograms");
      await updateDoc(docRef, {
        items: arrayRemove(technicalPrograms[programToDelete])
      });
      setTechnicalPrograms(prev => prev.filter((_, i) => i !== programToDelete));
      setToastMessage('Program deleted successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting technical program:", error);
      setToastMessage('Failed to delete program');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsDeleteModalOpen(false);
      setProgramToDelete(null);
    }
  };

  const handleEditProgram = (index) => {
    setNewProgram(technicalPrograms[index]);
    setEditingIndex(index);
    setShowAddModal(true);
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-sm">
            <FaShieldAlt /> Professional Service
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">
            Technical Program <span className="text-primary">Committee</span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="stats shadow bg-base-200 hidden sm:inline-flex">
            <div className="stat py-2 px-4">
              <div className="stat-title text-xs uppercase">Total Roles</div>
              <div className="stat-value text-2xl text-primary">{technicalPrograms.length}</div>
            </div>
          </div>
          
          {user && (
            <button
              onClick={() => {
                setShowAddModal(true);
                setEditingIndex(null);
                setNewProgram({ name: '', date: '', title: '', location: '', publisher: '' });
              }}
              className="btn btn-primary btn-md shadow-lg shadow-primary/20 gap-2"
            >
              <FaPlus /> Add Program
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
        <AnimatePresence>
          {technicalPrograms.map((conf, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="h-full card bg-base-100 border border-base-300 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
                {/* Accent bar */}
                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="card-body p-6">
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="badge badge-primary badge-outline font-bold p-3">
                      {conf.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-base-content/60 bg-base-200 px-3 py-1 rounded-full">
                      <FaCalendarAlt className="text-primary" />
                      {conf.date}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold leading-tight text-base-content mb-4 group-hover:text-primary transition-colors">
                    {conf.title}
                  </h3>

                  {/* Details Metadata */}
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-3 text-sm text-base-content/70">
                      <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-primary shrink-0">
                        <FaMapMarkerAlt />
                      </div>
                      <span>{conf.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-base-content/70">
                      <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-primary shrink-0">
                        <FaBook />
                      </div>
                      <span>Publisher: <span className="font-semibold text-base-content">{conf.publisher}</span></span>
                    </div>
                  </div>

                  {/* Role Footer */}
                  <div className="mt-6 pt-4 border-t border-base-200 flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-success flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      Active Member
                    </span>
                    
                    {/* Admin Actions */}
                    {user && (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleEditProgram(index)}
                          className="btn btn-ghost btn-xs text-info hover:bg-info/10"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProgram(index)}
                          className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modern Add/Edit Modal Content */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-base-300">
          <div className="p-1 bg-primary" /> {/* Top accent line */}
          <div className="p-8">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              {editingIndex !== null ? <FaEdit className="text-primary"/> : <FaPlus className="text-primary"/>}
              {editingIndex !== null ? 'Modify Program' : 'Add New Entry'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control w-full">
                <label className="label text-xs font-bold uppercase opacity-60">Conference Acronym</label>
                <input
                  type="text"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  className="input input-bordered focus:input-primary w-full bg-base-200/50"
                  placeholder="e.g., ICRTCIS-2025"
                />
              </div>

              <div className="form-control w-full">
                <label className="label text-xs font-bold uppercase opacity-60">Event Date</label>
                <input
                  type="text"
                  value={newProgram.date}
                  onChange={(e) => setNewProgram({ ...newProgram, date: e.target.value })}
                  className="input input-bordered focus:input-primary w-full bg-base-200/50"
                  placeholder="e.g., June 2025"
                />
              </div>

              <div className="form-control w-full md:col-span-2">
                <label className="label text-xs font-bold uppercase opacity-60">Full Conference Title</label>
                <input
                  type="text"
                  value={newProgram.title}
                  onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                  className="input input-bordered focus:input-primary w-full bg-base-200/50"
                  placeholder="6th International Conference on..."
                />
              </div>

              <div className="form-control w-full">
                <label className="label text-xs font-bold uppercase opacity-60">Venue / Location</label>
                <input
                  type="text"
                  value={newProgram.location}
                  onChange={(e) => setNewProgram({ ...newProgram, location: e.target.value })}
                  className="input input-bordered focus:input-primary w-full bg-base-200/50"
                  placeholder="City, Country"
                />
              </div>

              <div className="form-control w-full">
                <label className="label text-xs font-bold uppercase opacity-60">Publisher</label>
                <input
                  type="text"
                  value={newProgram.publisher}
                  onChange={(e) => setNewProgram({ ...newProgram, publisher: e.target.value })}
                  className="input input-bordered focus:input-primary w-full bg-base-200/50"
                  placeholder="e.g., IEEE, Springer"
                />
              </div>
            </div>

            <div className="modal-action mt-10">
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddProgram}
                className="btn btn-primary px-8"
              >
                {editingIndex !== null ? 'Save Changes' : 'Publish Program'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Keep your existing Toast and Confirmation Components */}
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
        message="This action cannot be undone. Are you sure you want to remove this committee record?"
        confirmText="Remove"
        cancelText="Keep"
        confirmColor="red"
        title="Confirm Deletion"
      />
    </div>
  );
};

export default TechnicalProgramCommittee;