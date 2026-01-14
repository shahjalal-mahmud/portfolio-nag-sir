import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaBook, FaEdit, FaTrash, FaPlus, FaCalendarAlt, FaUserEdit, FaBarcode } from "react-icons/fa";
import { HiOutlineCalendar, HiOutlineBookOpen, HiOutlineExternalLink } from 'react-icons/hi';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from '../../context/useAuth';
import Modal from "../common/Modal";
import Toast from "../common/Toast";
import ConfirmationModal from "../common/ConfirmationModal";

const EditedBooks = () => {
    const { user } = useAuth();
    const [editedBooks, setEditedBooks] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [currentBook, setCurrentBook] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [formData, setFormData] = useState({
        year: "", title: "", authors: "", publisher: "", isbn: "", link: "", is_first_author: false, status: ""
    });

    // Logic remains identical to original
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast({ ...toast, show: false }), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const fetchEditedBooks = async () => {
        try {
            const booksCollection = collection(db, "edited_books");
            const snapshot = await getDocs(booksCollection);
            const booksData = {};
            snapshot.forEach(doc => {
                booksData[doc.id] = doc.data().books.map((book, index) => ({
                    ...book, docId: doc.id, bookIndex: index
                }));
            });
            setEditedBooks(booksData);
            const years = Object.keys(booksData).sort((a, b) => b.localeCompare(a));
            if (years.length > 0) setActiveYear(years[0]);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching edited books:", error);
            setLoading(false);
            showToast('Failed to fetch books', 'error');
        }
    };

    useEffect(() => { fetchEditedBooks(); }, []);

    const showToast = (message, type = 'success') => setToast({ show: true, message, type });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const bookData = {
                title: formData.title, authors: formData.authors, publisher: formData.publisher,
                isbn: formData.isbn, link: formData.link, is_first_author: formData.is_first_author, status: formData.status
            };
            if (currentBook) {
                const yearDocRef = doc(db, "edited_books", currentBook.docId);
                const yearDoc = await getDoc(yearDocRef);
                if (yearDoc.exists()) {
                    const books = [...yearDoc.data().books];
                    if (currentBook.year !== formData.year) {
                        books.splice(currentBook.bookIndex, 1);
                        await updateDoc(yearDocRef, { books });
                        const newYearDocRef = doc(db, "edited_books", formData.year);
                        const newYearDoc = await getDoc(newYearDocRef);
                        if (newYearDoc.exists()) {
                            const newBooks = [...newYearDoc.data().books, bookData];
                            await updateDoc(newYearDocRef, { books: newBooks });
                        } else {
                            await setDoc(newYearDocRef, { books: [bookData] });
                        }
                    } else {
                        books[currentBook.bookIndex] = bookData;
                        await updateDoc(yearDocRef, { books });
                    }
                }
                showToast('Book updated successfully');
            } else {
                const yearDocRef = doc(db, "edited_books", formData.year);
                const yearDoc = await getDoc(yearDocRef);
                if (yearDoc.exists()) {
                    const existingBooks = yearDoc.data().books || [];
                    await updateDoc(yearDocRef, { books: [bookData, ...existingBooks] });
                } else {
                    await setDoc(yearDocRef, { books: [bookData] });
                }
                showToast('Book added successfully');
            }
            setIsModalOpen(false);
            setCurrentBook(null);
            await fetchEditedBooks();
        } catch (error) {
            showToast('Failed to save book', 'error');
        }
    };

    const handleEdit = (book) => {
        setCurrentBook(book);
        setFormData({
            year: book.docId, title: book.title, authors: book.authors,
            publisher: book.publisher, isbn: book.isbn || "", link: book.link || "",
            is_first_author: book.is_first_author || false, status: book.status || ""
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (book) => {
        setBookToDelete(book);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!bookToDelete) return;
        try {
            const { docId, bookIndex } = bookToDelete;
            const yearDocRef = doc(db, "edited_books", docId);
            const yearDoc = await getDoc(yearDocRef);
            if (yearDoc.exists()) {
                const books = [...yearDoc.data().books];
                books.splice(bookIndex, 1);
                books.length === 0 ? await deleteDoc(yearDocRef) : await updateDoc(yearDocRef, { books });
                await fetchEditedBooks();
                showToast('Book deleted successfully');
            }
        } catch (error) {
            showToast('Failed to delete book', 'error');
        } finally {
            setIsDeleteModalOpen(false);
            setBookToDelete(null);
        }
    };

    const openAddModal = () => {
        setCurrentBook(null);
        setFormData({
            year: activeYear || new Date().getFullYear().toString(),
            title: "", authors: "", publisher: "", isbn: "", link: "", is_first_author: false, status: ""
        });
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center bg-base-100">
                <span className="loading loading-ring loading-lg text-primary"></span>
            </div>
        );
    }

    const years = Object.keys(editedBooks).sort((a, b) => b.localeCompare(a));

    return (
        <section id="edited-books" className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100 text-base-content min-h-screen">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            
            <ConfirmationModal 
                isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={handleDeleteConfirm} title="Delete Publication"
                message="This will permanently remove this book from your portfolio."
                confirmText="Delete" confirmColor="error"
            />

            <div className="max-w-6xl mx-auto">
                {/* Modern Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-2">
                        <div className="badge badge-primary badge-outline gap-2 py-3 px-4 mb-2">
                            <FaBook className="text-xs" /> Scholarly Contributions
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            Edited <span className="text-primary italic">Books</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-primary rounded-full"></div>
                    </div>
                    {user && (
                        <button onClick={openAddModal} className="btn btn-primary btn-md shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                            <FaPlus /> Add Publication
                        </button>
                    )}
                </div>

                {/* Modern Year Tabs */}
                {years.length > 0 && (
                    <div className="sticky top-4 z-10 backdrop-blur-md bg-base-100/70 p-2 rounded-2xl border border-base-200 shadow-sm mb-10 overflow-x-auto">
                        <div className="flex space-x-2">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setActiveYear(year)}
                                    className={`btn btn-sm md:btn-md flex-none rounded-xl transition-all border-none ${
                                        activeYear === year 
                                        ? 'btn-primary shadow-md' 
                                        : 'bg-transparent hover:bg-base-200'
                                    }`}
                                >
                                    <HiOutlineCalendar className="text-lg" />
                                    {year}
                                    <div className={`badge badge-sm ml-1 ${activeYear === year ? 'badge-ghost' : 'badge-base-300'}`}>
                                        {editedBooks[year]?.length || 0}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modern Book Cards Grid */}
                {years.length > 0 ? (
                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {editedBooks[activeYear]?.map((book, index) => (
                            <div
                                key={index}
                                className="group relative bg-base-200/50 hover:bg-base-200 rounded-3xl p-6 md:p-8 transition-all duration-300 border border-transparent hover:border-primary/20 hover:shadow-2xl flex flex-col justify-between"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {user && (
                                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(book)} className="btn btn-circle btn-sm btn-ghost bg-base-100 shadow-sm text-info"><FaEdit /></button>
                                        <button onClick={() => handleDeleteClick(book)} className="btn btn-circle btn-sm btn-ghost bg-base-100 shadow-sm text-error"><FaTrash /></button>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-primary-content transition-colors">
                                            <HiOutlineBookOpen className="text-2xl" />
                                        </div>
                                        {book.status && (
                                            <span className="badge badge-outline badge-warning font-semibold py-3">{book.status}</span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
                                        {book.title}
                                    </h3>

                                    {book.is_first_author && (
                                        <div className="badge badge-primary gap-1 mb-6 py-3">
                                            <FaUserEdit className="text-xs" /> Lead Editor
                                        </div>
                                    )}

                                    <div className="space-y-4 text-sm">
                                        <div className="flex gap-3">
                                            <span className="opacity-60 font-medium min-w-[80px]">Editors</span>
                                            <p className="flex-1 font-semibold">
                                                {book.authors.split(/(Anindya Nag)/).map((part, idx) =>
                                                    part === "Anindya Nag" ? (
                                                        <span key={idx} className="text-primary underline decoration-2 underline-offset-4">Anindya Nag</span>
                                                    ) : part
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="opacity-60 font-medium min-w-[80px]">Publisher</span>
                                            <span className="flex-1 italic">{book.publisher}</span>
                                        </div>
                                        {book.isbn && (
                                            <div className="flex gap-3">
                                                <span className="opacity-60 font-medium min-w-[80px]">ISBN</span>
                                                <span className="flex-1 font-mono tracking-wider bg-base-300/50 px-2 rounded">{book.isbn}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {book.link && (
                                    <div className="mt-8 pt-6 border-t border-base-300">
                                        <a
                                            href={book.link} target="_blank" rel="noopener noreferrer"
                                            className="btn btn-block btn-ghost hover:btn-primary group/btn rounded-xl"
                                        >
                                            Explore Publication
                                            <HiOutlineExternalLink className="text-lg group-hover/btn:translate-x-1 transition-transform" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-base-200/30 rounded-3xl border-2 border-dashed border-base-300">
                        <div className="flex justify-center mb-4 opacity-20"><FaBook size={60} /></div>
                        <p className="text-xl font-medium opacity-60">No publications found for this period</p>
                    </div>
                )}
            </div>

            {/* Modern Styled Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-2">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-content shadow-lg shadow-primary/30">
                            {currentBook ? <FaEdit size={20} /> : <FaPlus size={20} />}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">{currentBook ? "Modify Publication" : "New Publication"}</h3>
                            <p className="text-sm opacity-60">Complete the details of the edited collection</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest">Year *</label>
                                <input type="text" name="year" value={formData.year} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" required placeholder="e.g. 2024" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest">Title *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" required placeholder="The Future of AI" />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label font-bold text-xs uppercase tracking-widest">List of Editors *</label>
                                <input type="text" name="authors" value={formData.authors} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" required placeholder="Separate with commas" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest">Publisher *</label>
                                <input type="text" name="publisher" value={formData.publisher} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest">ISBN</label>
                                <input type="text" name="isbn" value={formData.isbn} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" placeholder="XXX-XXXXXXXXXX" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest">External Link</label>
                                <input type="url" name="link" value={formData.link} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" placeholder="https://doi.org/..." />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest">Publication Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="select select-bordered focus:select-primary bg-base-200 border-none">
                                    <option value="">Status</option>
                                    <option value="Published">Published</option>
                                    <option value="In Press">In Press</option>
                                    <option value="Forthcoming">Forthcoming</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-base-200 p-4 rounded-2xl mt-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="is_first_author" checked={formData.is_first_author} onChange={handleInputChange} className="checkbox checkbox-primary" />
                                <span className="text-sm font-bold">Mark as Lead Editor contribution</span>
                            </label>
                        </div>

                        <div className="modal-action gap-2">
                            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Discard</button>
                            <button type="submit" className="btn btn-primary px-8 shadow-lg shadow-primary/20">
                                {currentBook ? "Save Changes" : "Publish to Portfolio"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
};

export default EditedBooks;