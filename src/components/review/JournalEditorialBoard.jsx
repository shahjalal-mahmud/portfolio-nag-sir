import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaExternalLinkAlt, FaCalendarCheck, FaAward, FaBuilding } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from '../hero/Modal';
import LoadingAnimation from '.././LoadingAnimation';
import Toast from '../common/Toast';
import ConfirmationModal from '../common/ConfirmationModal';

const fallbackEditorialBoard = [];

const JournalEditorialBoard = () => {
    const { user } = useAuth();
    const [editorialBoards, setEditorialBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState(null);
    const [newBoard, setNewBoard] = useState({
        title: '',
        url: '',
        publisher: '',
        joiningDate: '',
        impactFactor: '',
        role: ''
    });

    useEffect(() => {
        const fetchEditorialBoards = async () => {
            try {
                const docRef = doc(db, "portfolio", "journalEditorialBoards");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data().items || [];
                    setEditorialBoards(data);
                } else {
                    setEditorialBoards(fallbackEditorialBoard);
                }
            } catch (error) {
                console.error("Error fetching editorial boards:", error);
                setEditorialBoards(fallbackEditorialBoard);
            } finally {
                setLoading(false);
            }
        };

        fetchEditorialBoards();
    }, []);

    const handleAddBoard = async () => {
        if (!newBoard.title || !newBoard.publisher || !newBoard.joiningDate) {
            setToastMessage('Please fill in all required fields');
            setToastType('error');
            setShowToast(true);
            return;
        }

        try {
            const docRef = doc(db, "portfolio", "journalEditorialBoards");
            const docSnap = await getDoc(docRef);
            const currentData = docSnap.exists() ? docSnap.data().items : [];

            let updatedData;
            if (editingIndex !== null) {
                updatedData = [...currentData];
                updatedData[editingIndex] = newBoard;
            } else {
                updatedData = [newBoard, ...currentData];
            }

            await updateDoc(docRef, { items: updatedData });
            setEditorialBoards(updatedData);
            setShowAddModal(false);
            setEditingIndex(null);
            setNewBoard({ title: '', url: '', publisher: '', joiningDate: '', impactFactor: '', role: '' });
            setToastMessage(editingIndex !== null ? 'Updated successfully' : 'Added successfully');
            setToastType('success');
            setShowToast(true);
        } catch (error) {
            console.error("Error updating editorial boards:", error);
            setToastMessage(`Failed to save record`);
            setToastType('error');
            setShowToast(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (boardToDelete === null) return;
        try {
            const docRef = doc(db, "portfolio", "journalEditorialBoards");
            await updateDoc(docRef, {
                items: arrayRemove(editorialBoards[boardToDelete])
            });
            setEditorialBoards(prev => prev.filter((_, i) => i !== boardToDelete));
            setToastMessage('Deleted successfully');
            setToastType('success');
            setShowToast(true);
        } catch (error) {
            console.error("Error deleting:", error);
            setToastMessage('Failed to delete');
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsDeleteModalOpen(false);
            setBoardToDelete(null);
        }
    };

    if (loading) return <LoadingAnimation />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">
                        Editorial Board <span className="text-primary">Memberships</span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <span className="badge badge-ghost font-bold py-3 uppercase tracking-tighter">
                            {editorialBoards.length} Journal Appointments
                        </span>
                    </div>
                </div>

                {user && (
                    <button
                        onClick={() => {
                            setShowAddModal(true);
                            setEditingIndex(null);
                            setNewBoard({ title: '', url: '', publisher: '', joiningDate: '', impactFactor: '', role: '' });
                        }}
                        className="btn btn-primary btn-md shadow-lg gap-2"
                    >
                        <FaPlus /> New Appointment
                    </button>
                )}
            </div>

            {editorialBoards.length === 0 ? (
                <div className="hero bg-base-200 rounded-3xl p-10 border border-dashed border-base-300">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <p className="py-6 text-base-content/60">No editorial board memberships have been added yet.</p>
                            {user && <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-outline">Add Entry</button>}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence>
                        {editorialBoards.map((board, index) => (
                            <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative"
                            >
                                <div className="h-full bg-base-100 rounded-3xl border border-base-300 group-hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-2xl overflow-hidden p-6 md:p-8 flex flex-col">
                                    
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                                            <FaAward size={24} />
                                        </div>
                                        {user && (
                                            <div className="flex gap-1">
                                                <button onClick={() => { setNewBoard(board); setEditingIndex(index); setShowAddModal(true); }} className="btn btn-ghost btn-circle btn-sm text-info"><FaEdit /></button>
                                                <button onClick={() => { setBoardToDelete(index); setIsDeleteModalOpen(true); }} className="btn btn-ghost btn-circle btn-sm text-error"><FaTrash /></button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grow space-y-4">
                                        {board.url ? (
                                            <a href={board.url} target="_blank" rel="noopener noreferrer" className="group/link flex items-center gap-2 text-2xl font-black text-base-content hover:text-primary transition-colors leading-tight">
                                                {board.title} <FaExternalLinkAlt size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                            </a>
                                        ) : (
                                            <h3 className="text-2xl font-black text-base-content leading-tight">{board.title}</h3>
                                        )}

                                        <div className="flex flex-wrap gap-2 items-center">
                                            <div className="badge badge-secondary py-3 px-4 font-bold tracking-tight">
                                                {board.role || 'Editorial Board Member'}
                                            </div>
                                            {board.impactFactor && (
                                                <div className="badge badge-outline border-base-content/20 py-3 px-4 font-bold text-xs">
                                                    IF: {board.impactFactor}
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-base-200">
                                            <div className="flex items-center gap-3 text-sm font-medium opacity-70">
                                                <FaBuilding className="text-primary" />
                                                {board.publisher}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm font-medium opacity-70">
                                                <FaCalendarCheck className="text-primary" />
                                                Joined {board.joiningDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal Redesign */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-2xl border border-base-300 overflow-hidden">
                    <div className="bg-primary p-6 text-primary-content">
                        <h3 className="text-2xl font-black">
                            {editingIndex !== null ? 'Modify Appointment' : 'New Board Appointment'}
                        </h3>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control col-span-1 md:col-span-2">
                                <label className="label-text font-bold text-xs uppercase opacity-60 mb-2">Journal Title*</label>
                                <input type="text" value={newBoard.title} onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })} className="input input-bordered focus:input-primary bg-base-200/50" placeholder="e.g. Pattern Recognition" />
                            </div>
                            <div className="form-control col-span-1 md:col-span-2">
                                <label className="label-text font-bold text-xs uppercase opacity-60 mb-2">Journal Web URL</label>
                                <input type="url" value={newBoard.url} onChange={(e) => setNewBoard({ ...newBoard, url: e.target.value })} className="input input-bordered focus:input-primary bg-base-200/50" placeholder="https://" />
                            </div>
                            <div className="form-control">
                                <label className="label-text font-bold text-xs uppercase opacity-60 mb-2">Publisher*</label>
                                <input type="text" value={newBoard.publisher} onChange={(e) => setNewBoard({ ...newBoard, publisher: e.target.value })} className="input input-bordered focus:input-primary bg-base-200/50" placeholder="Elsevier" />
                            </div>
                            <div className="form-control">
                                <label className="label-text font-bold text-xs uppercase opacity-60 mb-2">Role</label>
                                <input type="text" value={newBoard.role} onChange={(e) => setNewBoard({ ...newBoard, role: e.target.value })} className="input input-bordered focus:input-primary bg-base-200/50" placeholder="Associate Editor" />
                            </div>
                            <div className="form-control">
                                <label className="label-text font-bold text-xs uppercase opacity-60 mb-2">Joining Date*</label>
                                <input type="text" value={newBoard.joiningDate} onChange={(e) => setNewBoard({ ...newBoard, joiningDate: e.target.value })} className="input input-bordered focus:input-primary bg-base-200/50" placeholder="Jan 2024" />
                            </div>
                            <div className="form-control">
                                <label className="label-text font-bold text-xs uppercase opacity-60 mb-2">Impact Factor</label>
                                <input type="text" value={newBoard.impactFactor} onChange={(e) => setNewBoard({ ...newBoard, impactFactor: e.target.value })} className="input input-bordered focus:input-primary bg-base-200/50" placeholder="8.5" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setShowAddModal(false)} className="btn btn-ghost">Cancel</button>
                            <button onClick={handleAddBoard} className="btn btn-primary px-8">Save Record</button>
                        </div>
                    </div>
                </div>
            </Modal>

            {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
            <ConfirmationModal
                isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete} message="Remove this editorial board record?"
                confirmText="Delete" cancelText="Cancel" confirmColor="red" title="Confirm Removal"
            />
        </div>
    );
};

export default JournalEditorialBoard;