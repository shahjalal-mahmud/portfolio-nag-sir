import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaBook, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Modal from "../common/Modal";

const DashboardEditedBooks = () => {
    const [editedBooks, setEditedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
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

    useEffect(() => {
        fetchEditedBooks();
    }, []);

    const fetchEditedBooks = async () => {
        try {
            const booksCollection = collection(db, "edited_books");
            const snapshot = await getDocs(booksCollection);

            const booksData = [];
            snapshot.forEach(yearDoc => {
                const books = yearDoc.data().books || [];
                books.forEach((book, index) => {
                    booksData.push({
                        ...book,
                        year: yearDoc.id,
                        docId: yearDoc.id,
                        bookIndex: index
                    });
                });
            });

            setEditedBooks(booksData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching edited books:", error);
            setLoading(false);
        }
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
                status: formData.status,
                year: formData.year
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
            } else {
                // Adding a new book
                const yearDocRef = doc(db, "edited_books", formData.year);
                const yearDoc = await getDoc(yearDocRef);

                if (yearDoc.exists()) {
                    const existingBooks = yearDoc.data().books || [];
                    await updateDoc(yearDocRef, {
                        books: [...existingBooks, bookData]
                    });
                } else {
                    await setDoc(yearDocRef, {
                        books: [bookData]
                    });
                }
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
            fetchEditedBooks();
        } catch (error) {
            console.error("Error saving book:", error);
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

    const handleDelete = async (docId, bookIndex) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
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

                    fetchEditedBooks();
                }
            } catch (error) {
                console.error("Error deleting book:", error);
            }
        }
    };

    const openAddModal = () => {
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
        setIsModalOpen(true);
    };

    const filteredBooks = editedBooks.filter(book => {
        const title = book.title ? book.title.toLowerCase() : '';
        const authors = book.authors ? book.authors.toLowerCase() : '';
        const publisher = book.publisher ? book.publisher.toLowerCase() : '';
        const year = book.year ? book.year.toString() : '';
        const searchTermLower = searchTerm.toLowerCase();

        return (
            title.includes(searchTermLower) ||
            authors.includes(searchTermLower) ||
            publisher.includes(searchTermLower) ||
            year.includes(searchTerm)
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center text-gray-800">
                        <FaBook className="mr-3 text-blue-600" />
                        Edited Books Management
                    </h2>
                    <p className="text-gray-500 mt-1">Manage all edited books in your portfolio</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-grow max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search books..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={openAddModal}
                        className="btn btn-primary gap-2"
                    >
                        <FaPlus />
                        Add New Book
                    </button>
                </div>
            </div>

            <div className="w-full overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Year
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Authors
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Publisher
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBooks
                            .sort((a, b) => b.year.localeCompare(a.year)) // Sort by year descending
                            .map((book) => (
                                <tr key={`${book.docId}-${book.bookIndex}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-400" />
                                            <span className="font-medium">{book.year}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-[200px]">
                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                            {book.title}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-500 space-y-1">
                                            {book.authors.split(',').map((author, i) => (
                                                <div key={i} className="whitespace-normal">
                                                    {author.trim()}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-[150px]">
                                        <div className="text-sm text-gray-500 whitespace-normal">
                                            {book.publisher}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEdit(book)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book.docId, book.bookIndex)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                        {filteredBooks.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                    {searchTerm ? "No matching books found" : "No edited books found. Add one to get started."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
        </div>
    );
};

export default DashboardEditedBooks;