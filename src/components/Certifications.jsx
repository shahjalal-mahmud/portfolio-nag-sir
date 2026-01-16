import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaCertificate, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';
import Toast from './common/Toast';
import ConfirmationModal from './common/ConfirmationModal';

const Certifications = () => {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);
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
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "certifications");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        updatedData = [...currentData];
        updatedData[editingIndex] = newCertification;
      } else {
        updatedData = [newCertification, ...currentData];
      }

      await updateDoc(docRef, { items: updatedData });

      setCertifications(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewCertification({ title: '', provider: '' });

      setToastMessage(editingIndex !== null ? 'Certification updated successfully!' : 'Certification added successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error adding/updating certification:", error);
      setToastMessage('Failed to save certification.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleDeleteCertification = async (index) => {
    try {
      const docRef = doc(db, "portfolio", "certifications");
      await updateDoc(docRef, {
        items: arrayRemove(certifications[index])
      });

      setCertifications(prev => prev.filter((_, i) => i !== index));
      setToastMessage('Certification deleted successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting certification:", error);
      setToastMessage('Failed to delete certification.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleEditCertification = (index) => {
    setNewCertification(certifications[index]);
    setEditingIndex(index);
    setShowAddModal(true);
  };

  if (loading) return <LoadingAnimation />;

  return (
    <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100 text-base-content">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FaCertificate className="text-primary text-2xl" />
          </div>
          <h2 className="text-4xl font-bold mb-4 relative inline-block text-primary">
            Professional Certifications
          </h2>
          <p className="text-lg opacity-70 max-w-3xl mx-auto">
            Validated skills and knowledge through accredited programs
          </p>
        </div>

        {/* Action Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-semibold">My Certifications</h3>
          {user && (
            <button
              onClick={() => {
                setShowAddModal(true);
                setEditingIndex(null);
                setNewCertification({ title: '', provider: '' });
              }}
              className="btn btn-primary"
            >
              <FaPlus /> Add New
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="card bg-base-200 shadow-md hover:shadow-xl border border-base-300 transition-all duration-300 group overflow-hidden"
            >
              {/* Decorative top border */}
              <div className="h-1 w-full bg-primary opacity-50"></div>
              
              <div className="card-body relative p-6">
                {user && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-base-100 p-1 rounded-lg shadow-sm">
                    <button onClick={() => handleEditCertification(index)} className="btn btn-ghost btn-xs text-info"><FaEdit /></button>
                    <button onClick={() => { setCertToDelete(index); setShowDeleteModal(true); }} className="btn btn-ghost btn-xs text-error"><FaTrash /></button>
                  </div>
                )}
                
                <div className="pr-8">
                  <h3 className="card-title text-xl font-bold">{cert.title}</h3>
                  <p className="opacity-80 mt-2">{cert.provider}</p>
                </div>

                {/* Subtle icon background */}
                <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
                   <FaCertificate size={48} />
                </div>
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
            className="btn btn-primary btn-outline btn-wide"
          >
            View All Certificates
            <FaExternalLinkAlt className="ml-2 text-sm" />
          </a>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setEditingIndex(null);
        setNewCertification({ title: '', provider: '' });
      }}>
        <div className="bg-base-100 rounded-xl p-6 w-full max-w-2xl">
          <h3 className="text-2xl font-bold mb-6">
            {editingIndex !== null ? 'Edit Certification' : 'Add New Certification'}
          </h3>

          <div className="form-control w-full gap-4">
            <div>
              <label className="label"><span className="label-text font-bold">Certification Title*</span></label>
              <input
                type="text"
                value={newCertification.title}
                onChange={(e) => setNewCertification({ ...newCertification, title: e.target.value })}
                className="input input-bordered w-full"
                placeholder="e.g., Introduction to IoT & Cybersecurity"
              />
            </div>

            <div>
              <label className="label"><span className="label-text font-bold">Provider*</span></label>
              <input
                type="text"
                value={newCertification.provider}
                onChange={(e) => setNewCertification({ ...newCertification, provider: e.target.value })}
                className="input input-bordered w-full"
                placeholder="e.g., CISCO, Coursera, Udemy"
              />
            </div>
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddCertification}>
              {editingIndex !== null ? 'Update Certification' : 'Add Certification'}
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
          handleDeleteCertification(certToDelete);
          setShowDeleteModal(false);
        }}
        title="Delete Certification"
        message="Are you sure you want to delete this certification?"
        confirmText="Delete"
        confirmColor="error"
      />
    </section>
  );
};

export default Certifications;