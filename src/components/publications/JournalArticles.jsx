import React, { useState, useEffect } from 'react';
import { FaRegNewspaper, FaEdit, FaTrash, FaPlus, FaAward, FaUserCheck } from 'react-icons/fa';
import { FiBarChart2, FiArrowUpRight, FiLayers, FiBookOpen } from 'react-icons/fi';
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
            <div className="max-w-7xl mx-auto">
                {/* Modern Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            <FiLayers /> Research Publications
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black">
                            Journal <span className="text-primary italic">Articles</span>
                        </h2>
                        <p className="text-base-content/60 max-w-xl text-lg">
                            A curated collection of peer-reviewed research and scholarly excellence in global academic journals.
                        </p>
                    </div>
                    {user && (
                        <button onClick={openAddModal} className="btn btn-primary btn-md md:btn-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                            <FaPlus /> Add Publication
                        </button>
                    )}
                </div>

                {/* Sticky Year Navigation */}
                {years.length > 0 && (
                    <div className="sticky top-4 z-20 backdrop-blur-md bg-base-100/70 p-2 rounded-2xl border border-base-content/10 shadow-sm mb-12 flex gap-2 overflow-x-auto no-scrollbar">
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setActiveYear(year)}
                                className={`btn btn-sm md:btn-md rounded-xl transition-all border-none ${
                                    activeYear === year 
                                    ? 'btn-primary shadow-md' 
                                    : 'btn-ghost hover:bg-base-200'
                                }`}
                            >
                                {year}
                                <span className={`badge badge-sm ml-1 ${activeYear === year ? 'badge-ghost' : 'badge-neutral'}`}>
                                    {journalArticles[year]?.length}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Grid Articles List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {journalArticles[activeYear]?.map((article, index) => (
                        <div
                            key={index}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="group relative flex flex-col bg-base-200/50 hover:bg-base-200 rounded-3xl p-6 md:p-8 transition-all duration-300 border border-base-content/5 hover:border-primary/30 hover:shadow-xl"
                        >
                            {/* Admin Actions */}
                            {user && (
                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button onClick={() => handleEdit(article)} className="btn btn-square btn-sm btn-ghost bg-base-100/50 hover:bg-info hover:text-white transition-colors">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(article.docId, article.articleIndex)} className="btn btn-square btn-sm btn-ghost bg-base-100/50 hover:bg-error hover:text-white transition-colors">
                                        <FaTrash />
                                    </button>
                                </div>
                            )}

                            {/* Content Wrapper */}
                            <div className="flex flex-col h-full space-y-5">
                                {/* Metadata Row */}
                                <div className="flex flex-wrap gap-2 items-center">
                                    {article.status && (
                                        <span className="badge badge-primary badge-sm font-bold uppercase tracking-tighter px-3 py-3">
                                            {article.status}
                                        </span>
                                    )}
                                    {article.impact_factor && (
                                        <div className="badge badge-outline badge-success badge-sm gap-1 py-3 font-semibold">
                                            <FiBarChart2 className="text-xs" /> IF: {article.impact_factor}
                                        </div>
                                    )}
                                    {article.cite_score && (
                                        <div className="badge badge-outline badge-secondary badge-sm gap-1 py-3 font-semibold">
                                            <FaAward className="text-[10px]" /> CiteScore: {article.cite_score}
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-xl md:text-2xl font-bold leading-snug text-base-content grow">
                                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                        {article.title}
                                    </a>
                                </h3>

                                {/* Journal Name */}
                                <div className="flex items-start gap-3 text-primary/80 font-bold italic">
                                    <FiBookOpen className="mt-1 shrink-0" />
                                    <span className="text-md leading-tight">{article.journal}</span>
                                </div>

                                {/* Authors */}
                                <p className="text-sm text-base-content/70 leading-relaxed font-medium line-clamp-3">
                                    {article.authors.split(/(Anindya Nag)/).map((part, idx) =>
                                        part === "Anindya Nag" ? (
                                            <span key={idx} className="text-base-content font-extrabold underline decoration-primary/40 underline-offset-2">Anindya Nag</span>
                                        ) : part
                                    )}
                                </p>

                                {/* Footer: Roles & Link */}
                                <div className="flex items-center justify-between pt-4 mt-auto border-t border-base-content/10">
                                    <div className="flex flex-wrap gap-2">
                                        {article.is_first_author && (
                                            <div className="flex items-center gap-1 text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-1 rounded">
                                                <FaUserCheck /> 1st Author
                                            </div>
                                        )}
                                        {article.is_corresponding_author && (
                                            <div className="flex items-center gap-1 text-[10px] font-black uppercase text-secondary bg-secondary/10 px-2 py-1 rounded">
                                                <FaRegNewspaper /> Corresponding
                                            </div>
                                        )}
                                    </div>
                                    
                                    <a 
                                        href={article.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-circle btn-sm btn-primary btn-outline hover:btn-primary border-base-content/20 transition-all"
                                    >
                                        <FiArrowUpRight size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal remains mostly the same but updated for modern look */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-4">
                    <div className="mb-6">
                        <h3 className="text-2xl font-black">{currentArticle ? "Edit Publication" : "Add New Publication"}</h3>
                        <p className="text-sm opacity-60">Complete the details below to update your academic record.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase opacity-60">Year *</label>
                                <input type="text" name="year" value={formData.year} onChange={handleInputChange} className="input input-bordered bg-base-200" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase opacity-60">Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="select select-bordered bg-base-200">
                                    <option value="">Choose Status</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Published">Published</option>
                                    <option value="In Press">In Press</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Submitted">Submitted</option>
                                </select>
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label font-bold text-xs uppercase opacity-60">Full Title *</label>
                                <textarea name="title" value={formData.title} onChange={handleInputChange} className="textarea textarea-bordered bg-base-200 h-20" required />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label font-bold text-xs uppercase opacity-60">Authors *</label>
                                <input type="text" name="authors" value={formData.authors} onChange={handleInputChange} className="input input-bordered bg-base-200" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase opacity-60">Journal Name *</label>
                                <input type="text" name="journal" value={formData.journal} onChange={handleInputChange} className="input input-bordered bg-base-200" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase opacity-60">Link (DOI/URL)</label>
                                <input type="url" name="link" value={formData.link} onChange={handleInputChange} className="input input-bordered bg-base-200" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase opacity-60">Impact Factor</label>
                                <input type="text" name="impact_factor" value={formData.impact_factor} onChange={handleInputChange} className="input input-bordered bg-base-200" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase opacity-60">CiteScore</label>
                                <input type="text" name="cite_score" value={formData.cite_score} onChange={handleInputChange} className="input input-bordered bg-base-200" />
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 bg-base-200 rounded-xl">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="is_first_author" checked={formData.is_first_author} onChange={handleInputChange} className="checkbox checkbox-primary checkbox-sm" />
                                <span className="text-xs font-bold">1st Author</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="is_corresponding_author" checked={formData.is_corresponding_author} onChange={handleInputChange} className="checkbox checkbox-secondary checkbox-sm" />
                                <span className="text-xs font-bold">Corresponding</span>
                            </label>
                        </div>

                        <div className="modal-action">
                            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary px-10 shadow-lg shadow-primary/20">
                                {currentArticle ? "Update" : "Save Publication"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete} message="This article will be permanently removed from your list."
                confirmText="Delete" confirmColor="error" title="Confirm Removal"
            />
        </section>
    );
};

export default JournalArticles;