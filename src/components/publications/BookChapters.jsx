import React, { useState, useEffect } from 'react';
import { FaBookOpen, FaExternalLinkAlt, FaEdit, FaTrash, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Modal from '../common/Modal';
import { useAuth } from '../../context/useAuth';

const BookChapters = () => {
    const [bookChapters, setBookChapters] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentChapter, setCurrentChapter] = useState(null);
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
    const { user } = useAuth(); // Get current user from auth context

    useEffect(() => {
        const fetchBookChapters = async () => {
            try {
                const chaptersCollection = collection(db, 'book_chapters');
                const snapshot = await getDocs(chaptersCollection);
                
                const chaptersData = {};
                snapshot.forEach(doc => {
                    if (doc.data().chapters) {
                        chaptersData[doc.id] = doc.data().chapters.map((chapter, index) => ({
                            ...chapter,
                            docId: doc.id,
                            chapterIndex: index
                        }));
                    }
                });

                setBookChapters(chaptersData);
                
                // Set the most recent year as active by default
                const years = Object.keys(chaptersData).sort((a, b) => b.localeCompare(a));
                if (years.length > 0) {
                    setActiveYear(years[0]);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching book chapters:', error);
                setLoading(false);
            }
        };

        fetchBookChapters();
    }, []);

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
                status: formData.status
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
                        chapters: [chapterData, ...existingChapters]
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
            // Refresh data
            setLoading(true);
            const chaptersCollection = collection(db, 'book_chapters');
            const snapshot = await getDocs(chaptersCollection);
            
            const chaptersData = {};
            snapshot.forEach(doc => {
                if (doc.data().chapters) {
                    chaptersData[doc.id] = doc.data().chapters.map((chapter, index) => ({
                        ...chapter,
                        docId: doc.id,
                        chapterIndex: index
                    }));
                }
            });

            setBookChapters(chaptersData);
            setLoading(false);
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
                    
                    // Refresh data
                    setLoading(true);
                    const chaptersCollection = collection(db, 'book_chapters');
                    const snapshot = await getDocs(chaptersCollection);
                    
                    const chaptersData = {};
                    snapshot.forEach(doc => {
                        if (doc.data().chapters) {
                            chaptersData[doc.id] = doc.data().chapters.map((chapter, index) => ({
                                ...chapter,
                                docId: doc.id,
                                chapterIndex: index
                            }));
                        }
                    });

                    setBookChapters(chaptersData);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error deleting chapter:", error);
            }
        }
    };

    const openAddModal = () => {
        setCurrentChapter(null);
        setFormData({
            year: activeYear || new Date().getFullYear().toString(),
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

    if (loading) {
        return (
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <p>Loading book chapters...</p>
                </div>
            </section>
        );
    }

    const years = Object.keys(bookChapters).sort((a, b) => b.localeCompare(a));

    if (years.length === 0) {
        return (
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <p>No book chapters found.</p>
                    {user && (
                        <button
                            onClick={openAddModal}
                            className="mt-4 btn btn-primary gap-2"
                        >
                            <FaPlus />
                            Add New Chapter
                        </button>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section
            id='book-chapters'
            className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-amber-50 text-amber-600">
                        <FaBookOpen className="text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Book Chapters
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Scholarly contributions to edited volumes and collections
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex overflow-x-auto pb-4 scrollbar-hide w-full">
                        <div className="flex space-x-2 mx-auto">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setActiveYear(year)}
                                    className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center ${activeYear === year
                                        ? 'bg-amber-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <HiOutlineCalendar className="mr-2" />
                                    {year}
                                    <span className="ml-2 text-xs bg-white/20 rounded-full px-2 py-0.5">
                                        {bookChapters[year]?.length || 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {user && (
                        <button
                            onClick={openAddModal}
                            className="btn btn-primary gap-2 whitespace-nowrap"
                        >
                            <FaPlus />
                            Add New Chapter
                        </button>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {bookChapters[activeYear]?.map((chapter, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 bg-white hover:shadow-sm relative"
                        >
                            {user && (
                                <div className="absolute top-4 right-4 flex space-x-2">
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
                            )}
                            <div className="flex flex-col h-full">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 leading-snug mb-3">
                                        <a
                                            href={chapter.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-amber-600 transition-colors"
                                        >
                                            {chapter.title}
                                        </a>
                                    </h3>

                                    <div className="flex items-start text-sm text-gray-600 mb-3">
                                        <FaBookOpen className="mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
                                        <span className="italic">{chapter.book}</span>
                                    </div>

                                    <p className="text-sm text-gray-700 mb-4">
                                        {chapter.authors.split(/(Anindya Nag)/).map((part, idx) =>
                                            part === "Anindya Nag" ? (
                                                <strong key={idx} className="text-gray-900 font-semibold">Anindya Nag</strong>
                                            ) : (
                                                part
                                            )
                                        )}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {chapter.is_first_author && (
                                            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                                First Author
                                            </span>
                                        )}
                                        {chapter.is_corresponding_author && (
                                            <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                                                Corresponding Author
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <a
                                        href={chapter.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors"
                                    >
                                        <span>View Chapter</span>
                                        <FaExternalLinkAlt className="ml-2 text-xs" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for adding/editing chapters */}
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
        </section>
    );
};

export default BookChapters;