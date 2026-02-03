import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaRegNewspaper, FaEdit, FaTrash, FaPlus, FaQuoteRight, FaAward, FaUserCheck } from 'react-icons/fa';
import { FiBarChart2, FiArrowUpRight, FiLayers } from 'react-icons/fi';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from "../common/Modal";
import Toast from '../common/Toast';
import ConfirmationModal from "../common/ConfirmationModal";

const JournalArticles = () => {
    const { user } = useAuth();
    const [journalArticles, setJournalArticles] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [formData, setFormData] = useState({
        year: "", title: "", authors: "", journal: "", link: "",
        impact_factor: "", cite_score: "", is_first_author: false,
        is_corresponding_author: false, status: ""
    });

    // Logic remains strictly unchanged as requested
    useEffect(() => {
        const fetchJournalArticles = async () => {
            try {
                const articlesCollection = collection(db, 'journal_articles');
                const snapshot = await getDocs(articlesCollection);
                const articlesData = {};
                snapshot.forEach(doc => {
                    if (doc.data().articles) {
                        articlesData[doc.id] = doc.data().articles.map((article, index) => ({
                            ...article, docId: doc.id, articleIndex: index
                        }));
                    }
                });
                setJournalArticles(articlesData);
                const years = Object.keys(articlesData).sort((a, b) => b.localeCompare(a));
                if (years.length > 0) setActiveYear(years[0]);
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
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const articleData = {
                title: formData.title, authors: formData.authors, journal: formData.journal,
                link: formData.link, impact_factor: formData.impact_factor, cite_score: formData.cite_score,
                is_first_author: formData.is_first_author, is_corresponding_author: formData.is_corresponding_author,
                status: formData.status
            };
            if (currentArticle) {
                const yearDocRef = doc(db, "journal_articles", currentArticle.docId);
                const yearDoc = await getDoc(yearDocRef);
                if (yearDoc.exists()) {
                    const articles = [...yearDoc.data().articles];
                    if (currentArticle.year !== formData.year) {
                        articles.splice(currentArticle.articleIndex, 1);
                        await updateDoc(yearDocRef, { articles });
                        const newYearDocRef = doc(db, "journal_articles", formData.year);
                        const newYearDoc = await getDoc(newYearDocRef);
                        if (newYearDoc.exists()) {
                            const newArticles = [...newYearDoc.data().articles, articleData];
                            await updateDoc(newYearDocRef, { articles: newArticles });
                        } else {
                            await setDoc(newYearDocRef, { articles: [articleData] });
                        }
                    } else {
                        articles[currentArticle.articleIndex] = articleData;
                        await updateDoc(yearDocRef, { articles });
                    }
                }
            } else {
                const yearDocRef = doc(db, "journal_articles", formData.year);
                const yearDoc = await getDoc(yearDocRef);
                if (yearDoc.exists()) {
                    const existingArticles = yearDoc.data().articles || [];
                    await updateDoc(yearDocRef, { articles: [articleData, ...existingArticles] });
                } else {
                    await setDoc(yearDocRef, { articles: [articleData] });
                }
            }
            setIsModalOpen(false);
            setCurrentArticle(null);
            setFormData({
                year: "", title: "", authors: "", journal: "", link: "",
                impact_factor: "", cite_score: "", is_first_author: false,
                is_corresponding_author: false, status: ""
            });
            setLoading(true);
            const articlesCollection = collection(db, 'journal_articles');
            const snapshot = await getDocs(articlesCollection);
            const articlesData = {};
            snapshot.forEach(doc => {
                if (doc.data().articles) {
                    articlesData[doc.id] = doc.data().articles.map((article, index) => ({
                        ...article, docId: doc.id, articleIndex: index
                    }));
                }
            });
            setJournalArticles(articlesData);
            setLoading(false);
            setToastMessage(currentArticle ? 'Article updated successfully' : 'Article added successfully');
            setToastType('success');
            setShowToast(true);
        } catch (error) {
            setToastMessage(`Failed to ${currentArticle ? 'update' : 'add'} article`);
            setToastType('error');
            setShowToast(true);
        }
    };

    const handleEdit = (article) => {
        setCurrentArticle(article);
        setFormData({
            year: article.docId, title: article.title, authors: article.authors,
            journal: article.journal || "", link: article.link || "", impact_factor: article.impact_factor || "",
            cite_score: article.cite_score || "", is_first_author: article.is_first_author || false,
            is_corresponding_author: article.is_corresponding_author || false, status: article.status || ""
        });
        setIsModalOpen(true);
    };

    const handleDelete = (docId, articleIndex) => {
        setArticleToDelete({ docId, articleIndex });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!articleToDelete) return;
        try {
            const { docId, articleIndex } = articleToDelete;
            const yearDocRef = doc(db, "journal_articles", docId);
            const yearDoc = await getDoc(yearDocRef);
            if (yearDoc.exists()) {
                const articles = [...yearDoc.data().articles];
                articles.splice(articleIndex, 1);
                articles.length === 0 ? await deleteDoc(yearDocRef) : await updateDoc(yearDocRef, { articles });
                setLoading(true);
                const snapshot = await getDocs(collection(db, 'journal_articles'));
                const articlesData = {};
                snapshot.forEach(doc => {
                    if (doc.data().articles) {
                        articlesData[doc.id] = doc.data().articles.map((article, index) => ({
                            ...article, docId: doc.id, articleIndex: index
                        }));
                    }
                });
                setJournalArticles(articlesData);
                setLoading(false);
                setToastMessage('Article deleted successfully');
                setToastType('success');
                setShowToast(true);
            }
        } catch (error) {
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsDeleteModalOpen(false);
            setArticleToDelete(null);
        }
    };

    const openAddModal = () => {
        setCurrentArticle(null);
        setFormData({
            year: activeYear || new Date().getFullYear().toString(),
            title: "", authors: "", journal: "", link: "", impact_factor: "",
            cite_score: "", is_first_author: false, is_corresponding_author: false, status: ""
        });
        setIsModalOpen(true);
    };

    const years = Object.keys(journalArticles).sort((a, b) => b.localeCompare(a));

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <section id='journal-articles' className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100 text-base-content overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Modern Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            <FiLayers /> Research Publications
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black">
                            Journal <span className="text-primary italic">Articles</span>
                        </h2>
                        <p className="text-base-content/60 max-w-xl text-lg">
                            Showcasing peer-reviewed research and scholarly excellence across global academic journals.
                        </p>
                    </div>
                    {user && (
                        <button onClick={openAddModal} className="btn btn-primary shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                            <FaPlus /> Add New Article
                        </button>
                    )}
                </div>

                {/* Sticky Year Navigation */}
                {years.length > 0 && (
                    <div className="sticky top-4 z-20 backdrop-blur-lg bg-base-100/80 p-1.5 rounded-2xl border border-base-content/5 shadow-xl mb-12 flex gap-2 overflow-x-auto no-scrollbar">
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setActiveYear(year)}
                                className={`btn btn-sm md:btn-md flex-none rounded-xl transition-all ${
                                    activeYear === year 
                                    ? 'btn-primary shadow-lg' 
                                    : 'btn-ghost hover:bg-base-300'
                                }`}
                            >
                                {year}
                                <span className={`badge badge-sm ml-1 ${activeYear === year ? 'badge-ghost' : 'badge-base-300'}`}>
                                    {journalArticles[year]?.length}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Staggered Articles List */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {journalArticles[activeYear]?.map((article, index) => (
                        <div
                            key={index}
                            style={{ animationDelay: `${index * 150}ms` }}
                            className="group relative bg-base-200/40 hover:bg-base-200 rounded-3xl p-6 md:p-10 transition-all duration-500 border border-base-content/5 hover:border-primary/20 hover:shadow-2xl"
                        >
                            {user && (
                                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(article)} className="btn btn-circle btn-sm btn-info btn-outline"><FaEdit /></button>
                                    <button onClick={() => handleDelete(article.docId, article.articleIndex)} className="btn btn-circle btn-sm btn-error btn-outline"><FaTrash /></button>
                                </div>
                            )}

                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1 space-y-4">
                                    {/* Status & Metrics Bar */}
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {article.status && (
                                            <span className="badge badge-primary font-bold py-3">{article.status}</span>
                                        )}
                                        {article.impact_factor && (
                                            <div className="badge badge-outline badge-success gap-1 py-3 font-semibold">
                                                <FiBarChart2 /> IF: {article.impact_factor}
                                            </div>
                                        )}
                                        {article.cite_score && (
                                            <div className="badge badge-outline badge-secondary gap-1 py-3 font-semibold">
                                                <FaAward className="text-[10px]" /> CiteScore: {article.cite_score}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-extrabold leading-tight text-base-content group-hover:text-primary transition-colors">
                                        <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4 decoration-2">
                                            {article.title}
                                        </a>
                                    </h3>

                                    <div className="flex items-center gap-2 text-primary font-bold italic text-lg">
                                        <FaQuoteRight className="text-sm opacity-50" />
                                        {article.journal}
                                    </div>

                                    <p className="text-base-content/70 leading-relaxed font-medium">
                                        {article.authors.split(/(Anindya Nag)/).map((part, idx) =>
                                            part === "Anindya Nag" ? (
                                                <span key={idx} className="text-base-content font-black border-b-2 border-primary/40 pb-0.5">Anindya Nag</span>
                                            ) : part
                                        )}
                                    </p>

                                    {/* Author Roles */}
                                    <div className="flex gap-4 pt-2">
                                        {article.is_first_author && (
                                            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                                                <FaUserCheck /> First Author
                                            </div>
                                        )}
                                        {article.is_corresponding_author && (
                                            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-secondary bg-secondary/10 px-3 py-1.5 rounded-lg">
                                                <FaRegNewspaper /> Corresponding Author
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:w-48 flex items-center justify-center lg:border-l lg:border-base-content/10">
                                    <a
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-circle btn-lg btn-ghost group-hover:bg-primary group-hover:text-primary-content transition-all border border-base-content/10 shadow-lg"
                                    >
                                        <FiArrowUpRight size={28} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modern Modal Design */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-2">
                    <div className="mb-8">
                        <h3 className="text-3xl font-black">{currentArticle ? "Edit Article" : "Register New Publication"}</h3>
                        <p className="text-base-content/50">Update your scholarly record with the latest journal data.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Year *</label>
                                <input type="text" name="year" value={formData.year} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" required />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Full Title *</label>
                                <textarea name="title" value={formData.title} onChange={handleInputChange} className="textarea textarea-bordered focus:textarea-primary bg-base-200 border-none h-24" required />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Author List *</label>
                                <input type="text" name="authors" value={formData.authors} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" required placeholder="Author 1, Author 2..." />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Journal Name *</label>
                                <input type="text" name="journal" value={formData.journal} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">DOI/External Link</label>
                                <input type="url" name="link" value={formData.link} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Impact Factor</label>
                                <input type="text" name="impact_factor" value={formData.impact_factor} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" placeholder="e.g. 12.4" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">CiteScore</label>
                                <input type="text" name="cite_score" value={formData.cite_score} onChange={handleInputChange} className="input input-bordered focus:input-primary bg-base-200 border-none" placeholder="e.g. 15.1" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="select select-bordered focus:select-primary bg-base-200 border-none">
                                    <option value="">Choose Status</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Published">Published</option>
                                    <option value="In Press">In Press</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Submitted">Submitted</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 bg-base-300/30 p-4 rounded-2xl">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="is_first_author" checked={formData.is_first_author} onChange={handleInputChange} className="checkbox checkbox-primary" />
                                <span className="text-sm font-bold">First Author</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="is_corresponding_author" checked={formData.is_corresponding_author} onChange={handleInputChange} className="checkbox checkbox-secondary" />
                                <span className="text-sm font-bold">Corresponding Author</span>
                            </label>
                        </div>

                        <div className="modal-action gap-2">
                            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Discard</button>
                            <button type="submit" className="btn btn-primary px-8 shadow-xl shadow-primary/20">
                                {currentArticle ? "Update Record" : "Save Publication"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete} message="This article will be permanently removed from your academic portfolio."
                confirmText="Delete" confirmColor="error" title="Delete Publication"
            />
        </section>
    );
};

export default JournalArticles;