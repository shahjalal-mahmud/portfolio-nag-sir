import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit} from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from '../hero/Modal';
import LoadingAnimation from '.././LoadingAnimation';

const fallbackEditorialBoard = [];

const JournalEditorialBoard = () => {
    const { user } = useAuth();
    const [editorialBoards, setEditorialBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
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
            alert('Please fill in all required fields');
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
                // Add new item to the top
                updatedData = [newBoard, ...currentData];
            }

            await updateDoc(docRef, { items: updatedData });
            setEditorialBoards(updatedData);
            setShowAddModal(false);
            setEditingIndex(null);
            setNewBoard({
                title: '',
                url: '',
                publisher: '',
                joiningDate: '',
                impactFactor: '',
                role: ''
            });
        } catch (error) {
            console.error("Error updating editorial boards:", error);
        }
    };

    const handleDeleteBoard = async (index) => {
        try {
            const docRef = doc(db, "portfolio", "journalEditorialBoards");
            await updateDoc(docRef, {
                items: arrayRemove(editorialBoards[index])
            });

            setEditorialBoards(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Error deleting editorial board:", error);
        }
    };

    const handleEditBoard = (index) => {
        setNewBoard(editorialBoards[index]);
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
                    <h3 className="text-2xl font-bold text-gray-900">Journal Editorial Board Members</h3>
                    <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {editorialBoards.length} Journal{editorialBoards.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {user && (
                    <button
                        onClick={() => {
                            setShowAddModal(true);
                            setEditingIndex(null);
                            setNewBoard({
                                title: '',
                                url: '',
                                publisher: '',
                                joiningDate: '',
                                impactFactor: '',
                                role: ''
                            });
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <FaPlus /> Add New
                    </button>
                )}
            </div>

            {editorialBoards.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                    <p className="text-gray-500 text-lg">No editorial board memberships to show</p>
                    {user && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mx-auto"
                        >
                            <FaPlus /> Add Your First Journal
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {editorialBoards.map((board, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="relative"
                        >
                            {user && (
                                <div className="absolute top-2 right-2 flex gap-2 z-10">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleEditBoard(index);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 transition-colors bg-white p-1 rounded"
                                        aria-label="Edit board"
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeleteBoard(index);
                                        }}
                                        className="text-red-500 hover:text-red-700 transition-colors bg-white p-1 rounded"
                                        aria-label="Delete board"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            )}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md h-full">
                                <div className="flex justify-between items-start mb-2">
                                    {board.url ? (
                                        <a
                                            href={board.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xl font-bold text-blue-700 hover:text-blue-800 hover:underline"
                                        >
                                            {board.title}
                                        </a>
                                    ) : (
                                        <h4 className="text-xl font-bold text-blue-700">{board.title}</h4>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <p className="text-gray-800 font-medium">{board.publisher}</p>
                                </div>

                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    Joined: {board.joiningDate}
                                </div>

                                {board.impactFactor && (
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                        </svg>
                                        Impact Factor: {board.impactFactor}
                                    </div>
                                )}

                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {board.role || 'Editorial Board Member'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Board Modal */}
            <Modal isOpen={showAddModal} onClose={() => {
                setShowAddModal(false);
                setEditingIndex(null);
                setNewBoard({
                    title: '',
                    url: '',
                    publisher: '',
                    joiningDate: '',
                    impactFactor: '',
                    role: ''
                });
            }}>
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
                    <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                            {editingIndex !== null ? 'Edit Editorial Board' : 'Add New Editorial Board'}
                        </h3>

                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Journal Title*</label>
                                <input
                                    type="text"
                                    value={newBoard.title}
                                    onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })}
                                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="e.g., Pattern Recognition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Journal URL</label>
                                <input
                                    type="url"
                                    value={newBoard.url}
                                    onChange={(e) => setNewBoard({ ...newBoard, url: e.target.value })}
                                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="https://example.com/journal"
                                />
                            </div>

                            <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Publisher*</label>
                                <input
                                    type="text"
                                    value={newBoard.publisher}
                                    onChange={(e) => setNewBoard({ ...newBoard, publisher: e.target.value })}
                                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="e.g., Elsevier"
                                />
                            </div>

                            <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Joining Date*</label>
                                <input
                                    type="text"
                                    value={newBoard.joiningDate}
                                    onChange={(e) => setNewBoard({ ...newBoard, joiningDate: e.target.value })}
                                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="e.g., January 2023"
                                />
                            </div>

                            <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Impact Factor</label>
                                <input
                                    type="text"
                                    value={newBoard.impactFactor}
                                    onChange={(e) => setNewBoard({ ...newBoard, impactFactor: e.target.value })}
                                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="e.g., 8.518"
                                />
                            </div>

                            <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Role</label>
                                <input
                                    type="text"
                                    value={newBoard.role}
                                    onChange={(e) => setNewBoard({ ...newBoard, role: e.target.value })}
                                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="e.g., Associate Editor"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingIndex(null);
                                    setNewBoard({
                                        title: '',
                                        url: '',
                                        publisher: '',
                                        joiningDate: '',
                                        impactFactor: '',
                                        role: ''
                                    });
                                }}
                                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddBoard}
                                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
                            >
                                {editingIndex !== null ? 'Update Board' : 'Add Board'}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default JournalEditorialBoard;