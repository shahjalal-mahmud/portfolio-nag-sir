import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaBookOpen, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Modal from "../common/Modal";

const DashboardBookChapters = () => {
    const [bookChapters, setBookChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        year: "",
        title: "",
        authors: "",
        book: "",
        link: "",
        is_first_author: false,
        is_corresponding_author: false,
        status: ""
    });

    useEffect(() => {
        fetchBookChapters();
    }, []);

    const fetchBookChapters = async () => {
        try {
            const chaptersCollection = collection(db, "book_chapters");
            const snapshot = await getDocs(chaptersCollection);

            const chaptersData = [];
            snapshot.forEach(yearDoc => {
                const chapters = yearDoc.data().chapters || [];
                chapters.forEach((chapter, index) => {
                    chaptersData.push({
                        ...chapter,
                        year: yearDoc.id,
                        docId: yearDoc.id,
                        chapterIndex: index
                    });
                });
            });

            setBookChapters(chaptersData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching book chapters:", error);
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
            const chapterData = {
                title: formData.title,
                authors: formData.authors,
                book: formData.book,
                link: formData.link,
                is_first_author: formData.is_first_author,
                is_corresponding_author: formData.is_corresponding_author,
                status: formData.status,
                year: formData.year
            };

            if (currentChapter) {
                // Editing an existing chapter
                const yearDocRef = doc(db, "book_chapters", currentChapter.docId);
                const yearDoc = await getDoc(yearDocRef);
                
                if (yearDoc.exists()) {
                    const chapters = [...yearDoc.data().chapters];
                    
                    // Check if year changed
                    if (currentChapter.year !== formData.year) {
                        // Remove from old year
                        chapters.splice(currentChapter.chapterIndex, 1);
                        await updateDoc(yearDocRef, { chapters });
                        
                        // Add to new year
                        const newYearDocRef = doc(db, "book_chapters", formData.year);
                        const newYearDoc = await getDoc(newYearDocRef);
                        
                        if (newYearDoc.exists()) {
                            const newChapters = [...newYearDoc.data().chapters, chapterData];
                            await updateDoc(newYearDocRef, { chapters: newChapters });
                        } else {
                            await setDoc(newYearDocRef, { chapters: [chapterData] });
                        }
                    } else {
                        // Update within same year
                        chapters[currentChapter.chapterIndex] = chapterData;
                        await updateDoc(yearDocRef, { chapters });
                    }
                }
            } else {
                // Adding a new chapter
                const yearDocRef = doc(db, "book_chapters", formData.year);
                const yearDoc = await getDoc(yearDocRef);

                if (yearDoc.exists()) {
                    const existingChapters = yearDoc.data().chapters || [];
                    await updateDoc(yearDocRef, {
                        chapters: [...existingChapters, chapterData]
                    });
                } else {
                    await setDoc(yearDocRef, {
                        chapters: [chapterData]
                    });
                }
            }

            setIsModalOpen(false);
            setCurrentChapter(null);
            setFormData({
                year: "",
                title: "",
                authors: "",
                book: "",
                link: "",
                is_first_author: false,
                is_corresponding_author: false,
                status: ""
            });
            fetchBookChapters();
        } catch (error) {
            console.error("Error saving book chapter:", error);
        }
    };

    const handleEdit = (chapter) => {
        setCurrentChapter(chapter);
        setFormData({
            year: chapter.year,
            title: chapter.title,
            authors: chapter.authors,
            book: chapter.book || "",
            link: chapter.link || "",
            is_first_author: chapter.is_first_author || false,
            is_corresponding_author: chapter.is_corresponding_author || false,
            status: chapter.status || ""
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (docId, chapterIndex) => {
        if (window.confirm("Are you sure you want to delete this chapter?")) {
            try {
                const yearDocRef = doc(db, "book_chapters", docId);
                const yearDoc = await getDoc(yearDocRef);

                if (yearDoc.exists()) {
                    const chapters = [...yearDoc.data().chapters];
                    chapters.splice(chapterIndex, 1);

                    // If last chapter in year, delete the entire year document
                    if (chapters.length === 0) {
                        await deleteDoc(yearDocRef);
                    } else {
                        await updateDoc(yearDocRef, { chapters });
                    }
                    
                    fetchBookChapters();
                }
            } catch (error) {
                console.error("Error deleting chapter:", error);
            }
        }
    };

    const openAddModal = () => {
        setCurrentChapter(null);
        setFormData({
            year: "",
            title: "",
            authors: "",
            book: "",
            link: "",
            is_first_author: false,
            is_corresponding_author: false,
            status: ""
        });
        setIsModalOpen(true);
    };

    const filteredChapters = bookChapters.filter(chapter => {
        const title = chapter.title ? chapter.title.toLowerCase() : '';
        const authors = chapter.authors ? chapter.authors.toLowerCase() : '';
        const book = chapter.book ? chapter.book.toLowerCase() : '';
        const year = chapter.year ? chapter.year.toString() : '';
        const searchTermLower = searchTerm.toLowerCase();

        return (
            title.includes(searchTermLower) ||
            authors.includes(searchTermLower) ||
            book.includes(searchTermLower) ||
            year.includes(searchTerm)
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center text-gray-800">
                        <FaBookOpen className="mr-3 text-amber-600" />
                        Book Chapters Management
                    </h2>
                    <p className="text-gray-500 mt-1">Manage all book chapters in your portfolio</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-grow max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search chapters..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={openAddModal}
                        className="btn btn-primary gap-2"
                    >
                        <FaPlus />
                        Add New Chapter
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
                                Book
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Authors
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredChapters
                            .sort((a, b) => b.year.localeCompare(a.year))
                            .map((chapter) => (
                                <tr key={`${chapter.docId}-${chapter.chapterIndex}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-400" />
                                            <span className="font-medium">{chapter.year}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-[200px]">
                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                            {chapter.title}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-[150px]">
                                        <div className="text-sm text-gray-500 whitespace-normal">
                                            {chapter.book}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-500 space-y-1">
                                            {chapter.authors.split(',').map((author, i) => (
                                                <div key={i} className="whitespace-normal">
                                                    {author.trim()}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEdit(chapter)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(chapter.docId, chapter.chapterIndex)}
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
                        {filteredChapters.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                    {searchTerm ? "No matching chapters found" : "No book chapters found. Add one to get started."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        {currentChapter ? "Edit Chapter" : "Add New Chapter"}
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

                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="Chapter Title"
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

                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Book *</label>
                                <input
                                    type="text"
                                    name="book"
                                    value={formData.book}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="Book Title"
                                    required
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
                                    <option value="Submitted">Submitted</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-3 pt-1">
                                <input
                                    type="checkbox"
                                    name="is_first_author"
                                    checked={formData.is_first_author}
                                    onChange={handleInputChange}
                                    className="checkbox checkbox-primary"
                                    id="firstAuthorCheckbox"
                                />
                                <label htmlFor="firstAuthorCheckbox" className="text-sm font-medium text-gray-700">
                                    First Author
                                </label>
                            </div>

                            <div className="flex items-center space-x-3 pt-1">
                                <input
                                    type="checkbox"
                                    name="is_corresponding_author"
                                    checked={formData.is_corresponding_author}
                                    onChange={handleInputChange}
                                    className="checkbox checkbox-primary"
                                    id="correspondingAuthorCheckbox"
                                />
                                <label htmlFor="correspondingAuthorCheckbox" className="text-sm font-medium text-gray-700">
                                    Corresponding Author
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
                                {currentChapter ? "Update Chapter" : "Add Chapter"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default DashboardBookChapters;