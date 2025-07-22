import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaBook, FaEdit, FaTrash, FaPlus, FaCalendarAlt } from "react-icons/fa";
import { HiOutlineCalendar } from 'react-icons/hi';
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
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });
    const [hoveredBook, setHoveredBook] = useState(null);
    const [formData, setFormData] = useState({
        year: "",
        title: "",
        authors: "",
        publisher: "",
        isbn: "",
        link: "",
        is_first_author: false,
        status: ""
    });

    // Close toast after 5 seconds
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false });
            }, 5000);
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
                    ...book,
                    docId: doc.id,
                    bookIndex: index
                }));
            });

            setEditedBooks(booksData);

            // Set the most recent year as active by default
            const years = Object.keys(booksData).sort((a, b) => b.localeCompare(a));
            if (years.length > 0) {
                setActiveYear(years[0]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching edited books:", error);
            setLoading(false);
            showToast('Failed to fetch books', 'error');
        }
    };

    useEffect(() => {
        fetchEditedBooks();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({
            show: true,
            message,
            type
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const bookData = {
                title: formData.title,
                authors: formData.authors,
                publisher: formData.publisher,
                isbn: formData.isbn,
                link: formData.link,
                is_first_author: formData.is_first_author,
                status: formData.status
            };

            if (currentBook) {
                // Editing an existing book
                const yearDocRef = doc(db, "edited_books", currentBook.docId);
                const yearDoc = await getDoc(yearDocRef);

                if (yearDoc.exists()) {
                    const books = [...yearDoc.data().books];

                    // Check if year changed
                    if (currentBook.year !== formData.year) {
                        // Remove from old year
                        books.splice(currentBook.bookIndex, 1);
                        await updateDoc(yearDocRef, { books });

                        // Add to new year
                        const newYearDocRef = doc(db, "edited_books", formData.year);
                        const newYearDoc = await getDoc(newYearDocRef);

                        if (newYearDoc.exists()) {
                            const newBooks = [...newYearDoc.data().books, bookData];
                            await updateDoc(newYearDocRef, { books: newBooks });
                        } else {
                            await setDoc(newYearDocRef, { books: [bookData] });
                        }
                    } else {
                        // Update within same year
                        books[currentBook.bookIndex] = bookData;
                        await updateDoc(yearDocRef, { books });
                    }
                }
                showToast('Book updated successfully');
            } else {
                // Adding a new book
                const yearDocRef = doc(db, "edited_books", formData.year);
                const yearDoc = await getDoc(yearDocRef);

                if (yearDoc.exists()) {
                    const existingBooks = yearDoc.data().books || [];
                    await updateDoc(yearDocRef, {
                        books: [bookData, ...existingBooks]
                    });
                } else {
                    await setDoc(yearDocRef, {
                        books: [bookData]
                    });
                }
                showToast('Book added successfully');
            }

            setIsModalOpen(false);
            setCurrentBook(null);
            setFormData({
                year: "",
                title: "",
                authors: "",
                publisher: "",
                isbn: "",
                link: "",
                is_first_author: false,
                status: ""
            });

            // Refresh data
            await fetchEditedBooks();
        } catch (error) {
            console.error("Error saving book:", error);
            showToast('Failed to save book', 'error');
        }
    };

    const handleEdit = (book) => {
        setCurrentBook(book);
        setFormData({
            year: book.year,
            title: book.title,
            authors: book.authors,
            publisher: book.publisher,
            isbn: book.isbn || "",
            link: book.link || "",
            is_first_author: book.is_first_author || false,
            status: book.status || ""
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

                // If last book in year, delete the entire year document
                if (books.length === 0) {
                    await deleteDoc(yearDocRef);
                } else {
                    await updateDoc(yearDocRef, { books });
                }

                // Refresh data
                await fetchEditedBooks();
                showToast('Book deleted successfully');
            }
        } catch (error) {
            console.error("Error deleting book:", error);
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
            title: "",
            authors: "",
            publisher: "",
            isbn: "",
            link: "",
            is_first_author: false,
            status: ""
        });
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <p>Loading edited books...</p>
                </div>
            </section>
        );
    }

    const years = Object.keys(editedBooks).sort((a, b) => b.localeCompare(a));

    return (
        <section
            id="edited-books"
            className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* Toast Notification */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Book"
                message="Are you sure you want to delete this book? This action cannot be undone."
                confirmText="Delete"
                confirmColor="red"
            />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-50 text-blue-600">
                        <FaBook className="text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Edited Books
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Scholarly collections and editorial contributions
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    {years.length > 0 && (
                        <div className="flex overflow-x-auto pb-4 scrollbar-hide w-full">
                            <div className="flex space-x-2 mx-auto">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => setActiveYear(year)}
                                        className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center ${activeYear === year
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <HiOutlineCalendar className="mr-2" />
                                        {year}
                                        <span className="ml-2 text-xs bg-white/20 rounded-full px-2 py-0.5">
                                            {editedBooks[year]?.length || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {user && (
                        <button
                            onClick={openAddModal}
                            className="btn btn-primary gap-2 whitespace-nowrap"
                        >
                            <FaPlus />
                            Add New Book
                        </button>
                    )}
                </div>

                {years.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {editedBooks[activeYear]?.map((book, index) => (
                            <div
                                key={index}
                                className="relative border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 bg-white hover:shadow-sm"
                                onMouseEnter={() => setHoveredBook(index)}
                                onMouseLeave={() => setHoveredBook(null)}
                            >
                                {user && (
                                    <div className={`absolute top-4 right-4 flex space-x-2 transition-opacity duration-200 ${hoveredBook === index ? 'opacity-100' : 'opacity-0'}`}>
                                        <button
                                            onClick={() => handleEdit(book)}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(book)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                                <div className="flex flex-col h-full">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                                            <a
                                                href={book.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {book.title}
                                            </a>
                                        </h3>

                                        {book.is_first_author && (
                                            <span className="inline-block mt-2 text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                                Lead Editor
                                            </span>
                                        )}

                                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                                            <p className="flex">
                                                <span className="font-medium text-gray-700 min-w-[70px]">Editors:</span>
                                                <span className="ml-2">
                                                    {book.authors.split(/(Anindya Nag)/).map((part, idx) =>
                                                        part === "Anindya Nag" ? (
                                                            <span
                                                                key={idx}
                                                                className="font-semibold text-gray-900"
                                                            >
                                                                Anindya Nag
                                                            </span>
                                                        ) : (
                                                            part
                                                        )
                                                    )}
                                                </span>
                                            </p>
                                            <p className="flex">
                                                <span className="font-medium text-gray-700 min-w-[70px]">Publisher:</span>
                                                <span className="ml-2">{book.publisher}</span>
                                            </p>

                                            {book.isbn && (
                                                <p className="flex">
                                                    <span className="font-medium text-gray-700 min-w-[70px]">ISBN:</span>
                                                    <span className="ml-2 font-mono">{book.isbn}</span>
                                                </p>
                                            )}

                                            {book.status && !book.isbn && (
                                                <p className="flex items-center">
                                                    <span className="font-medium text-gray-700 min-w-[70px]">Status:</span>
                                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                                                        {book.status}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {book.link && (
                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                            <a
                                                href={book.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <span>View Publication</span>
                                                <FaExternalLinkAlt className="ml-2 text-xs" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No edited books found</p>
                        {user && (
                            <button
                                onClick={openAddModal}
                                className="mt-4 btn btn-primary gap-2"
                            >
                                <FaPlus />
                                Add New Book
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal for adding/editing books */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        {currentBook ? "Edit Book" : "Add New Book"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Year *</label>
                                <input
                                    type="text"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="2023"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="Book Title"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Authors *</label>
                                <input
                                    type="text"
                                    name="authors"
                                    value={formData.authors}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="Author1, Author2, Author3"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Publisher *</label>
                                <input
                                    type="text"
                                    name="publisher"
                                    value={formData.publisher}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="Publisher Name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">ISBN</label>
                                <input
                                    type="text"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="ISBN Number"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Link</label>
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select status</option>
                                    <option value="Published">Published</option>
                                    <option value="In Press">In Press</option>
                                    <option value="Forthcoming">Forthcoming</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-3 pt-1">
                                <input
                                    type="checkbox"
                                    name="is_first_author"
                                    checked={formData.is_first_author}
                                    onChange={handleInputChange}
                                    className="checkbox checkbox-primary"
                                    id="leadEditorCheckbox"
                                />
                                <label htmlFor="leadEditorCheckbox" className="text-sm font-medium text-gray-700">
                                    Lead Editor
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {currentBook ? "Update Book" : "Add Book"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
};

export default EditedBooks;