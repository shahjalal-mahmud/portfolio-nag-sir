import React, { useState, useEffect } from 'react';
import { FaBookOpen, FaExternalLinkAlt, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaBookmark, FaQuoteLeft } from 'react-icons/fa';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Modal from '../common/Modal';
import { useAuth } from '../../context/useAuth';
import Toast from '../common/Toast';
import ConfirmationModal from '../common/ConfirmationModal';

const BookChapters = () => {
    const [bookChapters, setBookChapters] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [chapterToDelete, setChapterToDelete] = useState(null);
    const [formData, setFormData] = useState({
        year: "", title: "", authors: "", book: "", link: "",
        is_first_author: false, is_corresponding_author: false, status: ""
    });
    const { user } = useAuth();

    // Logic remains unchanged
    useEffect(() => {
        const fetchBookChapters = async () => {
            try {
                const chaptersCollection = collection(db, 'book_chapters');
                const snapshot = await getDocs(chaptersCollection);
                const chaptersData = {};
                snapshot.forEach(doc => {
                    if (doc.data().chapters) {
                        chaptersData[doc.id] = doc.data().chapters.map((chapter, index) => ({
                            ...chapter, docId: doc.id, chapterIndex: index
                        }));
                    }
                });
                setBookChapters(chaptersData);
                const years = Object.keys(chaptersData).sort((a, b) => b.localeCompare(a));
                if (years.length > 0) setActiveYear(years[0]);
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
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const chapterData = {
                title: formData.title, authors: formData.authors, book: formData.book,
                link: formData.link, is_first_author: formData.is_first_author,
                is_corresponding_author: formData.is_corresponding_author, status: formData.status
            };
            if (currentChapter) {
                const yearDocRef = doc(db, "book_chapters", currentChapter.docId);
                const yearDoc = await getDoc(yearDocRef);
                if (yearDoc.exists()) {
                    const chapters = [...yearDoc.data().chapters];
                    if (currentChapter.year !== formData.year) {
                        chapters.splice(currentChapter.chapterIndex, 1);
                        await updateDoc(yearDocRef, { chapters });
                        const newYearDocRef = doc(db, "book_chapters", formData.year);
                        const newYearDoc = await getDoc(newYearDocRef);
                        if (newYearDoc.exists()) {
                            const newChapters = [...newYearDoc.data().chapters, chapterData];
                            await updateDoc(newYearDocRef, { chapters: newChapters });
                        } else {
                            await setDoc(newYearDocRef, { chapters: [chapterData] });
                        }
                    } else {
                        chapters[currentChapter.chapterIndex] = chapterData;
                        await updateDoc(yearDocRef, { chapters });
                    }
                }
            } else {
                const yearDocRef = doc(db, "book_chapters", formData.year);
                const yearDoc = await getDoc(yearDocRef);
                if (yearDoc.exists()) {
                    const existingChapters = yearDoc.data().chapters || [];
                    await updateDoc(yearDocRef, { chapters: [chapterData, ...existingChapters] });
                } else {
                    await setDoc(yearDocRef, { chapters: [chapterData] });
                }
            }
            setIsModalOpen(false);
            setCurrentChapter(null);
            setLoading(true);
            const snapshot = await getDocs(collection(db, 'book_chapters'));
            const chaptersData = {};
            snapshot.forEach(doc => {
                if (doc.data().chapters) {
                    chaptersData[doc.id] = doc.data().chapters.map((ch, i) => ({ ...ch, docId: doc.id, chapterIndex: i }));
                }
            });
            setBookChapters(chaptersData);
            setLoading(false);
            setToastMessage(currentChapter ? 'Chapter updated successfully' : 'Chapter added successfully');
            setToastType('success');
            setShowToast(true);
        } catch (error) {
            setToastMessage('Error saving chapter');
            setToastType('error');
            setShowToast(true);
        }
    };

    const handleEdit = (chapter) => {
        setCurrentChapter(chapter);
        setFormData({
            year: chapter.docId, title: chapter.title, authors: chapter.authors,
            book: chapter.book || "", link: chapter.link || "", is_first_author: chapter.is_first_author || false,
            is_corresponding_author: chapter.is_corresponding_author || false, status: chapter.status || ""
        });
        setIsModalOpen(true);
    };

    const handleDelete = (docId, chapterIndex) => {
        setChapterToDelete({ docId, chapterIndex });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!chapterToDelete) return;
        try {
            const { docId, chapterIndex } = chapterToDelete;
            const yearDocRef = doc(db, "book_chapters", docId);
            const yearDoc = await getDoc(yearDocRef);
            if (yearDoc.exists()) {
                const chapters = [...yearDoc.data().chapters];
                chapters.splice(chapterIndex, 1);
                chapters.length === 0 ? await deleteDoc(yearDocRef) : await updateDoc(yearDocRef, { chapters });
                setLoading(true);
                const snapshot = await getDocs(collection(db, 'book_chapters'));
                const chaptersData = {};
                snapshot.forEach(doc => {
                    if (doc.data().chapters) {
                        chaptersData[doc.id] = doc.data().chapters.map((ch, i) => ({ ...ch, docId: doc.id, chapterIndex: i }));
                    }
                });
                setBookChapters(chaptersData);
                setLoading(false);
                setToastMessage('Chapter deleted successfully');
                setToastType('success');
                setShowToast(true);
            }
        } catch (error) {
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsDeleteModalOpen(false);
            setChapterToDelete(null);
        }
    };

    const openAddModal = () => {
        setCurrentChapter(null);
        setFormData({
            year: activeYear || new Date().getFullYear().toString(),
            title: "", authors: "", book: "", link: "", is_first_author: false, is_corresponding_author: false, status: ""
        });
        setIsModalOpen(true);
    };

    const years = Object.keys(bookChapters).sort((a, b) => b.localeCompare(a));

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <section id='book-chapters' className="py-20 px-4 md:px-8 bg-base-100 text-base-content min-h-screen">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                            <FaBookmark className="text-[10px]" /> Academic Publications
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                            Book <span className="text-primary italic">Chapters</span>
                        </h2>
                        <p className="text-base-content/70 max-w-2xl text-lg font-medium">
                            Scholarly contributions to international volumes and technical handbooks, exploring specialized dimensions of emerging technologies.
                        </p>
                    </div>
                    {user && (
                        <button onClick={openAddModal} className="btn btn-primary btn-lg rounded-2xl shadow-lg shadow-primary/20 group">
                            <FaPlus className="group-hover:rotate-90 transition-transform" /> 
                            <span>Add Chapter</span>
                        </button>
                    )}
                </div>

                {/* Sticky Navigation */}
                {years.length > 0 && (
                    <div className="sticky top-4 z-40 mb-12 flex justify-center">
                        <div className="bg-base-200/60 backdrop-blur-md border border-base-content/10 p-1.5 rounded-2xl shadow-xl flex gap-1 overflow-x-auto max-w-full no-scrollbar">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setActiveYear(year)}
                                    className={`btn btn-md md:px-8 rounded-xl border-none transition-all ${
                                        activeYear === year 
                                        ? 'bg-primary text-primary-content shadow-md' 
                                        : 'bg-transparent hover:bg-base-300'
                                    }`}
                                >
                                    {year}
                                    <span className={`badge badge-sm ml-2 ${activeYear === year ? 'bg-primary-content/20 border-none text-primary-content' : 'badge-ghost opacity-60'}`}>
                                        {bookChapters[year]?.length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {bookChapters[activeYear]?.map((chapter, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col bg-base-200/40 hover:bg-base-200 border border-base-content/5 hover:border-primary/20 rounded-xl p-4 md:p-6 transition-all duration-300 hover:shadow-2xl overflow-hidden"
                        >
                            {/* Background decoration */}
                            <FaQuoteLeft className="absolute -top-4 -left-4 text-9xl text-base-content/3 pointer-events-none group-hover:text-primary/5 transition-colors" />

                            <div className="relative flex-1">
                                {/* Admin Actions */}
                                {user && (
                                    <div className="absolute top-0 right-0 flex gap-2">
                                        <button onClick={() => handleEdit(chapter)} className="btn btn-square btn-sm btn-ghost bg-base-100/50 hover:text-info">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(chapter.docId, chapter.chapterIndex)} className="btn btn-square btn-sm btn-ghost bg-base-100/50 hover:text-error">
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}

                                {/* Status & Tags */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {chapter.status && (
                                        <div className="badge badge-primary badge-outline text-[10px] font-black uppercase tracking-widest px-3 py-2.5">
                                            {chapter.status}
                                        </div>
                                    )}
                                    {chapter.is_first_author && (
                                        <div className="badge badge-secondary text-[10px] font-black uppercase tracking-widest px-3 py-2.5 gap-1">
                                            <FaCheckCircle /> Lead Author
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg md:text-xl font-black leading-tight mb-4 group-hover:text-primary transition-colors">
                                    {chapter.title}
                                </h3>

                                {/* Book Info */}
                                <div className="flex items-start gap-3 mb-6 p-4 rounded-2xl bg-base-300/50 border border-base-content/5">
                                    <HiOutlineBookOpen className="text-primary text-xl mt-1 shrink-0" />
                                    <span className="font-bold text-sm text-base-content/80 italic leading-snug">
                                        {chapter.book}
                                    </span>
                                </div>

                                {/* Authors */}
                                <p className="text-base-content/60 text-sm font-medium mb-4 line-clamp-3">
                                    {chapter.authors.split(/(Anindya Nag)/).map((part, idx) =>
                                        part === "Anindya Nag" ? (
                                            <span key={idx} className="text-base-content font-bold border-b-2 border-primary/40">Anindya Nag</span>
                                        ) : part
                                    )}
                                </p>
                            </div>

                            {/* Footer Action */}
                            {chapter.link && (
                                <div className="mt-auto pt-3 border-t border-base-content/5">
                                    <a
                                        href={chapter.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-block btn-ghost hover:bg-primary hover:text-primary-content rounded-xl group/btn"
                                    >
                                        View Full Chapter
                                        <FaExternalLinkAlt className="text-xs group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {(!bookChapters[activeYear] || bookChapters[activeYear].length === 0) && (
                    <div className="flex flex-col items-center justify-center py-32 opacity-20">
                        <FaBookOpen className="text-8xl mb-4" />
                        <p className="text-2xl font-black uppercase tracking-widest">No Records Found</p>
                    </div>
                )}
            </div>

            {/* Modal - Modernized Inputs */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-2">
                    <h3 className="text-3xl font-black mb-2">{currentChapter ? "Edit Chapter" : "Add Chapter"}</h3>
                    <p className="text-sm text-base-content/50 mb-8 font-bold uppercase tracking-widest">Update publication records</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control md:col-span-1">
                                <label className="label text-xs font-black uppercase opacity-60">Publication Year</label>
                                <input type="text" name="year" value={formData.year} onChange={handleInputChange} className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/50" required />
                            </div>
                            <div className="form-control md:col-span-1">
                                <label className="label text-xs font-black uppercase opacity-60">Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="select bg-base-200 border-none focus:ring-2 focus:ring-primary/50">
                                    <option value="">Status</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Published">Published</option>
                                    <option value="In Press">In Press</option>
                                    <option value="Submitted">Submitted</option>
                                </select>
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label text-xs font-black uppercase opacity-60">Chapter Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/50 font-bold" required />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label text-xs font-black uppercase opacity-60">Book / Volume Title</label>
                                <input type="text" name="book" value={formData.book} onChange={handleInputChange} className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/50 italic" required />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label text-xs font-black uppercase opacity-60">Authors (Comma separated)</label>
                                <textarea name="authors" value={formData.authors} onChange={handleInputChange} className="textarea bg-base-200 border-none focus:ring-2 focus:ring-primary/50 h-24" required />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label text-xs font-black uppercase opacity-60">External Link (DOI)</label>
                                <input type="url" name="link" value={formData.link} onChange={handleInputChange} className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/50" />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 py-4">
                            <label className="flex items-center gap-3 cursor-pointer bg-base-200 px-4 py-3 rounded-xl border border-transparent hover:border-primary/30 transition-all">
                                <input type="checkbox" name="is_first_author" checked={formData.is_first_author} onChange={handleInputChange} className="checkbox checkbox-primary" />
                                <span className="text-sm font-bold opacity-80">First Author</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer bg-base-200 px-4 py-3 rounded-xl border border-transparent hover:border-secondary/30 transition-all">
                                <input type="checkbox" name="is_corresponding_author" checked={formData.is_corresponding_author} onChange={handleInputChange} className="checkbox checkbox-secondary" />
                                <span className="text-sm font-bold opacity-80">Corresponding</span>
                            </label>
                        </div>

                        <div className="modal-action">
                            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary px-8 rounded-xl shadow-lg shadow-primary/20">
                                {currentChapter ? "Update Record" : "Create Entry"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete} title="Confirm Deletion"
                message="Are you sure you want to permanently delete this chapter from the records?"
                confirmText="Delete" confirmColor="error"
            />
        </section>
    );
};

export default BookChapters;