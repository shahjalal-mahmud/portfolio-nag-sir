import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaRegNewspaper, FaEdit, FaTrash, FaPlus, FaQuoteRight } from 'react-icons/fa';
import { FiBarChart2 } from 'react-icons/fi';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from "../common/Modal";

const JournalArticles = () => {
    const { user } = useAuth();
    const [journalArticles, setJournalArticles] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [formData, setFormData] = useState({
        year: "",
        title: "",
        authors: "",
        journal: "",
        link: "",
        impact_factor: "",
        cite_score: "",
        is_first_author: false,
        is_corresponding_author: false,
        status: ""
    });

    useEffect(() => {
        const fetchJournalArticles = async () => {
            try {
                const articlesCollection = collection(db, 'journal_articles');
                const snapshot = await getDocs(articlesCollection);
                
                const articlesData = {};
                snapshot.forEach(doc => {
                    if (doc.data().articles) {
                        articlesData[doc.id] = doc.data().articles.map((article, index) => ({
                            ...article,
                            docId: doc.id,
                            articleIndex: index
                        }));
                    }
                });

                setJournalArticles(articlesData);
                
                // Set the most recent year as active by default
                const years = Object.keys(articlesData).sort((a, b) => b.localeCompare(a));
                if (years.length > 0) {
                    setActiveYear(years[0]);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching journal articles:', error);
                setLoading(false);
            }
        };

        fetchJournalArticles();
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
            const articleData = {
                title: formData.title,
                authors: formData.authors,
                journal: formData.journal,
                link: formData.link,
                impact_factor: formData.impact_factor,
                cite_score: formData.cite_score,
                is_first_author: formData.is_first_author,
                is_corresponding_author: formData.is_corresponding_author,
                status: formData.status
            };

            if (currentArticle) {
                // Editing an existing article
                const yearDocRef = doc(db, "journal_articles", currentArticle.docId);
                const yearDoc = await getDoc(yearDocRef);
                
                if (yearDoc.exists()) {
                    const articles = [...yearDoc.data().articles];
                    
                    // Check if year changed
                    if (currentArticle.year !== formData.year) {
                        // Remove from old year
                        articles.splice(currentArticle.articleIndex, 1);
                        await updateDoc(yearDocRef, { articles });
                        
                        // Add to new year
                        const newYearDocRef = doc(db, "journal_articles", formData.year);
                        const newYearDoc = await getDoc(newYearDocRef);
                        
                        if (newYearDoc.exists()) {
                            const newArticles = [...newYearDoc.data().articles, articleData];
                            await updateDoc(newYearDocRef, { articles: newArticles });
                        } else {
                            await setDoc(newYearDocRef, { articles: [articleData] });
                        }
                    } else {
                        // Update within same year
                        articles[currentArticle.articleIndex] = articleData;
                        await updateDoc(yearDocRef, { articles });
                    }
                }
            } else {
                // Adding a new article
                const yearDocRef = doc(db, "journal_articles", formData.year);
                const yearDoc = await getDoc(yearDocRef);

                if (yearDoc.exists()) {
                    const existingArticles = yearDoc.data().articles || [];
                    await updateDoc(yearDocRef, {
                        articles: [articleData, ...existingArticles]
                    });
                } else {
                    await setDoc(yearDocRef, {
                        articles: [articleData]
                    });
                }
            }

            setIsModalOpen(false);
            setCurrentArticle(null);
            setFormData({
                year: "",
                title: "",
                authors: "",
                journal: "",
                link: "",
                impact_factor: "",
                cite_score: "",
                is_first_author: false,
                is_corresponding_author: false,
                status: ""
            });
            // Refresh data
            setLoading(true);
            const articlesCollection = collection(db, 'journal_articles');
            const snapshot = await getDocs(articlesCollection);
            
            const articlesData = {};
            snapshot.forEach(doc => {
                if (doc.data().articles) {
                    articlesData[doc.id] = doc.data().articles.map((article, index) => ({
                        ...article,
                        docId: doc.id,
                        articleIndex: index
                    }));
                }
            });

            setJournalArticles(articlesData);
            setLoading(false);
        } catch (error) {
            console.error("Error saving journal article:", error);
        }
    };

    const handleEdit = (article) => {
        setCurrentArticle(article);
        setFormData({
            year: article.year,
            title: article.title,
            authors: article.authors,
            journal: article.journal || "",
            link: article.link || "",
            impact_factor: article.impact_factor || "",
            cite_score: article.cite_score || "",
            is_first_author: article.is_first_author || false,
            is_corresponding_author: article.is_corresponding_author || false,
            status: article.status || ""
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (docId, articleIndex) => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            try {
                const yearDocRef = doc(db, "journal_articles", docId);
                const yearDoc = await getDoc(yearDocRef);

                if (yearDoc.exists()) {
                    const articles = [...yearDoc.data().articles];
                    articles.splice(articleIndex, 1);

                    // If last article in year, delete the entire year document
                    if (articles.length === 0) {
                        await deleteDoc(yearDocRef);
                    } else {
                        await updateDoc(yearDocRef, { articles });
                    }
                    
                    // Refresh data
                    setLoading(true);
                    const articlesCollection = collection(db, 'journal_articles');
                    const snapshot = await getDocs(articlesCollection);
                    
                    const articlesData = {};
                    snapshot.forEach(doc => {
                        if (doc.data().articles) {
                            articlesData[doc.id] = doc.data().articles.map((article, index) => ({
                                ...article,
                                docId: doc.id,
                                articleIndex: index
                            }));
                        }
                    });

                    setJournalArticles(articlesData);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error deleting article:", error);
            }
        }
    };

    const openAddModal = () => {
        setCurrentArticle(null);
        setFormData({
            year: activeYear || new Date().getFullYear().toString(),
            title: "",
            authors: "",
            journal: "",
            link: "",
            impact_factor: "",
            cite_score: "",
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
                    <p>Loading journal articles...</p>
                </div>
            </section>
        );
    }

    const years = Object.keys(journalArticles).sort((a, b) => b.localeCompare(a));

    if (years.length === 0) {
        return (
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <p>No journal articles found.</p>
                    {user && (
                        <button
                            onClick={openAddModal}
                            className="mt-4 btn btn-primary gap-2"
                        >
                            <FaPlus />
                            Add New Article
                        </button>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section
            id='journal-articles'
            className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-50 text-blue-600">
                        <FaRegNewspaper className="text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Journal Articles
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Peer-reviewed research publications in academic journals
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex overflow-x-auto pb-4 scrollbar-hide w-full">
                        <div className="flex flex-wrap justify-center gap-2 mx-auto">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setActiveYear(year)}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center ${
                                        activeYear === year
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {year}
                                    <span className="ml-2 text-xs bg-white/20 rounded-full px-2 py-0.5">
                                        {journalArticles[year].length}
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
                            Add New Article
                        </button>
                    )}
                </div>

                <div className="space-y-6">
                    {journalArticles[activeYear]?.map((article, index) => (
                        <div
                            key={index}
                            className="relative border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 bg-white hover:shadow-sm"
                        >
                            {user && (
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(article)}
                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article.docId, article.articleIndex)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                            <div className="flex flex-col md:flex-row md:justify-between">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 leading-snug">
                                        <a
                                            href={article.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            {article.title}
                                        </a>
                                    </h3>

                                    <div className="mt-3 flex items-center text-sm text-blue-600">
                                        <FaQuoteRight className="mr-2 text-xs opacity-70" />
                                        <span className="italic">{article.journal}</span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {article.impact_factor && (
                                            <span className="inline-flex items-center text-xs font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full">
                                                <FiBarChart2 className="mr-1" />
                                                IF: {article.impact_factor}
                                            </span>
                                        )}
                                        {article.cite_score && (
                                            <span className="inline-flex items-center text-xs font-medium bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                                                <FiBarChart2 className="mr-1" />
                                                CiteScore: {article.cite_score}
                                            </span>
                                        )}
                                        {(article.is_first_author || article.is_corresponding_author) && (
                                            <div className="flex gap-2">
                                                {article.is_first_author && (
                                                    <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                                        First Author
                                                    </span>
                                                )}
                                                {article.is_corresponding_author && (
                                                    <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                                                        Corresponding Author
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <p className="mt-4 text-sm text-gray-600">
                                        {article.authors.split(/(Anindya Nag)/).map((part, idx) =>
                                            part === "Anindya Nag" ? (
                                                <strong key={idx} className="text-gray-900 font-semibold">Anindya Nag</strong>
                                            ) : (
                                                part
                                            )
                                        )}
                                    </p>
                                </div>

                                <div className="mt-4 md:mt-0 md:ml-6">
                                    <a
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <span>View Article</span>
                                        <FaExternalLinkAlt className="ml-2 text-xs" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for adding/editing articles */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        {currentArticle ? "Edit Article" : "Add New Article"}
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
                                    placeholder="Article Title"
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
                                <label className="block text-sm font-medium text-gray-700">Journal *</label>
                                <input
                                    type="text"
                                    name="journal"
                                    value={formData.journal}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="Journal Name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Impact Factor</label>
                                <input
                                    type="text"
                                    name="impact_factor"
                                    value={formData.impact_factor}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="5.678"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">CiteScore</label>
                                <input
                                    type="text"
                                    name="cite_score"
                                    value={formData.cite_score}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="8.9"
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
                                    <option value="Under Review">Under Review</option>
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
                                {currentArticle ? "Update Article" : "Add Article"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
};

export default JournalArticles;