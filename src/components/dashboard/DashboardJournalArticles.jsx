import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaRegNewspaper, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Modal from "../common/Modal";

const DashboardJournalArticles = () => {
    const [journalArticles, setJournalArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
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
        fetchJournalArticles();
    }, []);

    const fetchJournalArticles = async () => {
        try {
            const articlesCollection = collection(db, "journal_articles");
            const snapshot = await getDocs(articlesCollection);

            const articlesData = [];
            snapshot.forEach(yearDoc => {
                const articles = yearDoc.data().articles || [];
                articles.forEach((article, index) => {
                    articlesData.push({
                        ...article,
                        year: yearDoc.id,
                        docId: yearDoc.id,
                        articleIndex: index
                    });
                });
            });

            setJournalArticles(articlesData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching journal articles:", error);
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
            const articleData = {
                title: formData.title,
                authors: formData.authors,
                journal: formData.journal,
                link: formData.link,
                impact_factor: formData.impact_factor,
                cite_score: formData.cite_score,
                is_first_author: formData.is_first_author,
                is_corresponding_author: formData.is_corresponding_author,
                status: formData.status,
                year: formData.year
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
                        articles: [...existingArticles, articleData]
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
            fetchJournalArticles();
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
                    
                    fetchJournalArticles();
                }
            } catch (error) {
                console.error("Error deleting article:", error);
            }
        }
    };

    const openAddModal = () => {
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
        setIsModalOpen(true);
    };

    const filteredArticles = journalArticles.filter(article => {
        const title = article.title ? article.title.toLowerCase() : '';
        const authors = article.authors ? article.authors.toLowerCase() : '';
        const journal = article.journal ? article.journal.toLowerCase() : '';
        const year = article.year ? article.year.toString() : '';
        const searchTermLower = searchTerm.toLowerCase();

        return (
            title.includes(searchTermLower) ||
            authors.includes(searchTermLower) ||
            journal.includes(searchTermLower) ||
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
                        <FaRegNewspaper className="mr-3 text-blue-600" />
                        Journal Articles Management
                    </h2>
                    <p className="text-gray-500 mt-1">Manage all journal articles in your portfolio</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-grow max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search articles..."
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
                        Add New Article
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
                                Journal
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
                        {filteredArticles
                            .sort((a, b) => b.year.localeCompare(a.year))
                            .map((article) => (
                                <tr key={`${article.docId}-${article.articleIndex}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-400" />
                                            <span className="font-medium">{article.year}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-[200px]">
                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                            {article.title}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-[150px]">
                                        <div className="text-sm text-gray-500 whitespace-normal">
                                            {article.journal}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-500 space-y-1">
                                            {article.authors.split(',').map((author, i) => (
                                                <div key={i} className="whitespace-normal">
                                                    {author.trim()}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
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
                                    </td>
                                </tr>
                            ))
                        }
                        {filteredArticles.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                    {searchTerm ? "No matching articles found" : "No journal articles found. Add one to get started."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
        </div>
    );
};

export default DashboardJournalArticles;