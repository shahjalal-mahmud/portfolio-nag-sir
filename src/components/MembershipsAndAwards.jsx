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
    type: '' 
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
        const membershipsRef = doc(db, "portfolio", "memberships");
        const membershipsSnap = await getDoc(membershipsRef);
        const awardsRef = doc(db, "portfolio", "awards");
        const awardsSnap = await getDoc(awardsRef);

        if (membershipsSnap.exists()) {
          setMemberships(membershipsSnap.data().items || []);
        }
        if (awardsSnap.exists()) {
          setAwards(awardsSnap.data().items || []);
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
      setToast({ show: true, message: 'Please fill in all required fields', type: 'error' });
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
      setToast({ show: true, message: editingIndex !== null ? 'Membership updated successfully' : 'Membership added successfully', type: 'success' });
    } catch (error) {
      console.error("Error updating memberships:", error);
      setToast({ show: true, message: 'Operation failed', type: 'error' });
    }
  };

  const handleAddAward = async () => {
    if (!newAward.title || !newAward.session || !newAward.description) {
      setToast({ show: true, message: 'Please fill in all required fields', type: 'error' });
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
      setToast({ show: true, message: editingIndex !== null ? 'Award updated successfully' : 'Award added successfully', type: 'success' });
    } catch (error) {
      console.error("Error updating awards:", error);
      setToast({ show: true, message: 'Operation failed', type: 'error' });
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

  if (loading) return <LoadingAnimation />;

  return (
    <section id="memberships-awards" className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100 text-base-content">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 relative inline-block text-primary">
            Professional Recognition
          </h2>
          <p className="text-lg opacity-70 max-w-3xl mx-auto">
            Memberships in professional organizations and academic honors received
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Memberships Card */}
          <div className="card bg-base-200 shadow-xl border border-base-300 relative p-8">
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <FaUserTie className="text-primary text-2xl" />
              </div>
              <h3 className="card-title text-2xl font-bold">Professional Memberships</h3>
            </div>

            {user && (
              <button
                onClick={() => {
                  setShowMembershipModal(true);
                  setEditingIndex(null);
                  setEditingType(null);
                  setNewMembership({ organization: '', period: '', role: '' });
                }}
                className="btn btn-primary btn-sm absolute top-4 right-4"
              >
                <FaPlus size={12} /> Add
              </button>
            )}

            <div className="space-y-6">
              {memberships.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  className="pl-4 border-l-4 border-primary relative group"
                >
                  {user && (
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-base-100 rounded-bl-lg">
                      <button onClick={() => handleEditItem(index, 'membership')} className="btn btn-ghost btn-xs text-info"><FaEdit /></button>
                      <button onClick={() => { setItemToDelete({ index, type: 'membership' }); setShowDeleteModal(true); }} className="btn btn-ghost btn-xs text-error"><FaTrash /></button>
                    </div>
                  )}
                  <div className="pr-8">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h4 className="text-xl font-semibold">{item.organization}</h4>
                      <span className="badge badge-primary badge-outline font-medium">{item.period}</span>
                    </div>
                    <p className="mt-2 opacity-80">{item.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Awards Card */}
          <div className="card bg-base-200 shadow-xl border border-base-300 relative p-8">
            <div className="flex items-center mb-6">
              <div className="bg-secondary/10 p-3 rounded-full mr-4">
                <FaAward className="text-secondary text-2xl" />
              </div>
              <h3 className="card-title text-2xl font-bold">Honors & Awards</h3>
            </div>

            {user && (
              <button
                onClick={() => {
                  setShowAwardModal(true);
                  setEditingIndex(null);
                  setEditingType(null);
                  setNewAward({ title: '', session: '', description: '' });
                }}
                className="btn btn-secondary btn-sm absolute top-4 right-4"
              >
                <FaPlus size={12} /> Add
              </button>
            )}

            <div className="space-y-6">
              {awards.map((award, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  className="pl-4 border-l-4 border-secondary relative group"
                >
                  {user && (
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-base-100 rounded-bl-lg">
                      <button onClick={() => handleEditItem(index, 'award')} className="btn btn-ghost btn-xs text-info"><FaEdit /></button>
                      <button onClick={() => { setItemToDelete({ index, type: 'award' }); setShowDeleteModal(true); }} className="btn btn-ghost btn-xs text-error"><FaTrash /></button>
                    </div>
                  )}
                  <div className="pr-8">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h4 className="text-xl font-semibold">{award.title}</h4>
                      <span className="badge badge-secondary badge-outline font-medium">{award.session}</span>
                    </div>
                    <p className="mt-2 opacity-80">{award.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Membership Modal Content */}
      <Modal isOpen={showMembershipModal} onClose={() => setShowMembershipModal(false)}>
        <div className="bg-base-100 rounded-xl p-6 w-full max-w-2xl">
          <h3 className="text-2xl font-bold mb-6">
            {editingIndex !== null ? 'Edit Membership' : 'Add New Membership'}
          </h3>
          <div className="form-control gap-4">
            <div>
              <label className="label"><span className="label-text font-bold">Organization*</span></label>
              <input 
                type="text" 
                className="input input-bordered w-full" 
                value={newMembership.organization}
                onChange={(e) => setNewMembership({ ...newMembership, organization: e.target.value })}
              />
            </div>
            <div>
              <label className="label"><span className="label-text font-bold">Period*</span></label>
              <input 
                type="text" 
                className="input input-bordered w-full" 
                value={newMembership.period}
                onChange={(e) => setNewMembership({ ...newMembership, period: e.target.value })}
              />
            </div>
            <div>
              <label className="label"><span className="label-text font-bold">Role*</span></label>
              <input 
                type="text" 
                className="input input-bordered w-full" 
                value={newMembership.role}
                onChange={(e) => setNewMembership({ ...newMembership, role: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setShowMembershipModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddMembership}>
              {editingIndex !== null ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Award Modal Content */}
      <Modal isOpen={showAwardModal} onClose={() => setShowAwardModal(false)}>
        <div className="bg-base-100 rounded-xl p-6 w-full max-w-2xl">
          <h3 className="text-2xl font-bold mb-6">
            {editingIndex !== null ? 'Edit Award' : 'Add New Award'}
          </h3>
          <div className="form-control gap-4">
            <div>
              <label className="label"><span className="label-text font-bold">Title*</span></label>
              <input 
                type="text" 
                className="input input-bordered w-full" 
                value={newAward.title}
                onChange={(e) => setNewAward({ ...newAward, title: e.target.value })}
              />
            </div>
            <div>
              <label className="label"><span className="label-text font-bold">Session*</span></label>
              <input 
                type="text" 
                className="input input-bordered w-full" 
                value={newAward.session}
                onChange={(e) => setNewAward({ ...newAward, session: e.target.value })}
              />
            </div>
            <div>
              <label className="label"><span className="label-text font-bold">Description*</span></label>
              <textarea 
                className="textarea textarea-bordered w-full" 
                rows={4}
                value={newAward.description}
                onChange={(e) => setNewAward({ ...newAward, description: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setShowAwardModal(false)}>Cancel</button>
            <button className="btn btn-secondary" onClick={handleAddAward}>
              {editingIndex !== null ? 'Update' : 'Add'}
            </button>
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
            await updateDoc(docRef, { items: arrayRemove(itemToRemove) });
            if (type === 'membership') {
              setMemberships(prev => prev.filter((_, i) => i !== index));
            } else {
              setAwards(prev => prev.filter((_, i) => i !== index));
            }
            setToast({ show: true, message: 'Deleted successfully', type: 'success' });
          } catch (error) {
            setToast({ show: true, message: 'Delete failed', type: 'error' });
          } finally {
            setShowDeleteModal(false);
          }
        }}
        title="Confirm Delete"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        confirmColor="error"
      />
    </section>
  );
};

export default MembershipsAndAwards;