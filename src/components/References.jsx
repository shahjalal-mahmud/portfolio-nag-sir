import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaUserTie, FaEnvelope, FaExternalLinkAlt, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';
import Toast from './common/Toast';
import ConfirmationModal from './common/ConfirmationModal';

const References = () => {
  const { user } = useAuth();
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [refToDelete, setRefToDelete] = useState(null);
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
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "references");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        updatedData = [...currentData];
        updatedData[editingIndex] = newReference;
      } else {
        updatedData = [...currentData, newReference];
      }

      await updateDoc(docRef, { items: updatedData });

      setReferences(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewReference({ name: '', title: '', institution: '', location: '', email: '', link: '' });

      setToastMessage(editingIndex !== null ? 'Reference updated successfully!' : 'Reference added successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error adding/updating reference:", error);
      setToastMessage('Failed to save reference. Please try again.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleDeleteReference = async (index) => {
    try {
      const docRef = doc(db, "portfolio", "references");
      await updateDoc(docRef, {
        items: arrayRemove(references[index])
      });

      setReferences(prev => prev.filter((_, i) => i !== index));
      setToastMessage('Reference deleted successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting reference:", error);
      setToastMessage('Failed to delete reference.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleEditReference = (index) => {
    setNewReference(references[index]);
    setEditingIndex(index);
    setShowAddModal(true);
  };

  if (loading) return <LoadingAnimation />;

  return (
    <section id="references" className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100 text-base-content">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FaUserTie className="text-primary text-2xl" />
          </div>
          <h2 className="text-4xl font-bold mb-4 relative inline-block text-primary">
            Professional References
          </h2>
          <p className="text-lg opacity-70 max-w-3xl mx-auto">
            Esteemed academic and professional contacts
          </p>
        </div>

        {/* Action Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-semibold">My References</h3>
          {user && (
            <button
              onClick={() => {
                setShowAddModal(true);
                setEditingIndex(null);
                setNewReference({ name: '', title: '', institution: '', location: '', email: '', link: '' });
              }}
              className="btn btn-primary"
            >
              <FaPlus /> Add New
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {references.map((ref, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="card bg-base-200 border border-base-300 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="card-body p-8 relative">
                {user && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditReference(index)} className="btn btn-ghost btn-xs text-info" aria-label="Edit reference">
                      <FaEdit size={16} />
                    </button>
                    <button onClick={() => { setRefToDelete(index); setShowDeleteModal(true); }} className="btn btn-ghost btn-xs text-error" aria-label="Delete reference">
                      <FaTrash size={16} />
                    </button>
                  </div>
                )}
                
                <div className="flex items-start mb-6">
                  <div className="bg-primary text-primary-content p-4 rounded-2xl mr-5 shadow-lg">
                    <FaUserTie className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="card-title text-2xl font-bold">
                      {ref.link ? (
                        <a href={ref.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                          {ref.name} <FaExternalLinkAlt className="text-xs" />
                        </a>
                      ) : ref.name}
                    </h3>
                    <p className="text-primary font-medium tracking-wide uppercase text-sm mt-1">{ref.title}</p>
                  </div>
                </div>

                <div className="space-y-3 pl-2 border-l-2 border-primary/20">
                  <p className="font-semibold opacity-90">{ref.institution}</p>
                  <p className="text-sm opacity-70">{ref.location}</p>
                  <div className="flex items-center mt-4">
                    <FaEnvelope className="text-primary mr-3 opacity-70" />
                    <a href={`mailto:${ref.email}`} className="link link-primary link-hover text-sm font-medium break-all">
                      {ref.email}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setEditingIndex(null);
        setNewReference({ name: '', title: '', institution: '', location: '', email: '', link: '' });
      }}>
        <div className="bg-base-100 rounded-2xl p-6 w-full max-w-2xl shadow-xl border border-base-300">
          <h3 className="text-2xl font-bold mb-6 text-primary">
            {editingIndex !== null ? 'Edit Reference' : 'Add New Reference'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Name*</span></label>
              <input
                type="text"
                value={newReference.name}
                onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="Dr. John Smith"
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Title*</span></label>
              <input
                type="text"
                value={newReference.title}
                onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="e.g., Professor"
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label"><span className="label-text font-bold">Institution*</span></label>
              <input
                type="text"
                value={newReference.institution}
                onChange={(e) => setNewReference({ ...newReference, institution: e.target.value })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="University Name"
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Location*</span></label>
              <input
                type="text"
                value={newReference.location}
                onChange={(e) => setNewReference({ ...newReference, location: e.target.value })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="City, Country"
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Email*</span></label>
              <input
                type="email"
                value={newReference.email}
                onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="email@example.com"
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label"><span className="label-text font-bold">Profile Link (Optional)</span></label>
              <input
                type="url"
                value={newReference.link}
                onChange={(e) => setNewReference({ ...newReference, link: e.target.value })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="https://example.com/profile"
              />
            </div>
          </div>

          <div className="modal-action mt-8">
            <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary px-8" onClick={handleAddReference}>
              {editingIndex !== null ? 'Update Reference' : 'Add Reference'}
            </button>
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
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          handleDeleteReference(refToDelete);
          setShowDeleteModal(false);
        }}
        title="Delete Reference"
        message="Are you sure you want to delete this reference contact?"
        confirmText="Delete"
        confirmColor="error"
      />
    </section>
  );
};

export default References;