import React, { useState, useEffect } from 'react';
import { FaBookOpen, FaExternalLinkAlt, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaBookmark } from 'react-icons/fa';
import { HiOutlineCalendar, HiOutlineBookOpen } from 'react-icons/hi';
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
            <div className="flex h-96 items-center justify-center bg-base-100">
                <span className="loading loading-dots loading-lg text-amber-500"></span>
            </div>
        );
    }

    return (
        <section id='book-chapters' className="py-24 px-4 sm:px-6 lg:px-8 bg-base-100 text-base-content overflow-hidden min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Modern Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                            <FaBookmark /> Curated Collections
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            Book <span className="text-amber-500 italic underline decoration-amber-500/30 underline-offset-8">Chapters</span>
                        </h2>
                        <p className="text-base-content/60 max-w-xl text-lg font-medium leading-relaxed">
                            Deep dives into specialized topics within authoritative edited volumes and research handbooks.
                        </p>
                    </div>
                    {user && (
                        <button onClick={openAddModal} className="btn btn-primary btn-md md:btn-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all rounded-2xl">
                            <FaPlus /> New Chapter
                        </button>
                    )}
                </div>

                {/* Sticky Modern Year Nav */}
                {years.length > 0 && (
                    <div className="sticky top-6 z-30 mb-12 flex justify-center">
                        <div className="bg-base-200/40 backdrop-blur-xl border border-base-content/5 p-1.5 rounded-[2rem] shadow-2xl flex gap-1 overflow-x-auto no-scrollbar max-w-full">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setActiveYear(year)}
                                    className={`btn btn-sm md:btn-md rounded-full border-none transition-all px-6 ${
                                        activeYear === year 
                                        ? 'bg-amber-500 text-white shadow-lg' 
                                        : 'bg-transparent hover:bg-base-300'
                                    }`}
                                >
                                    {year}
                                    <div className={`badge badge-sm ml-1 ${activeYear === year ? 'badge-ghost opacity-80' : 'badge-base-300'}`}>
                                        {bookChapters[year]?.length}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Staggered Chapter List */}
                <div className="grid gap-8 grid-cols-1 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    {bookChapters[activeYear]?.map((chapter, index) => (
                        <div
                            key={index}
                            style={{ animationDelay: `${index * 150}ms` }}
                            className="group relative bg-gradient-to-br from-base-200/50 to-base-200/20 hover:from-base-200 hover:to-base-200 rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 border border-base-content/5 hover:border-amber-500/20 hover:shadow-2xl"
                        >
                            {user && (
                                <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                    <button onClick={() => handleEdit(chapter)} className="btn btn-circle btn-sm btn-ghost bg-base-100 shadow-md text-info hover:bg-info hover:text-white"><FaEdit /></button>
                                    <button onClick={() => handleDelete(chapter.docId, chapter.chapterIndex)} className="btn btn-circle btn-sm btn-ghost bg-base-100 shadow-md text-error hover:bg-error hover:text-white"><FaTrash /></button>
                                </div>
                            )}

                            <div className="flex flex-col lg:flex-row gap-10 items-start">
                                {/* Left Side Icon/Decoration */}
                                <div className="hidden lg:flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-3xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                                        <FaBookOpen size={28} />
                                    </div>
                                    <div className="w-0.5 h-20 bg-gradient-to-b from-amber-500/20 to-transparent"></div>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-wrap gap-2">
                                        {chapter.status && (
                                            <span className="badge badge-primary font-black py-3 px-4 uppercase tracking-tighter text-[10px]">{chapter.status}</span>
                                        )}
                                        {chapter.is_first_author && (
                                            <span className="badge badge-outline badge-amber-500 text-amber-600 border-amber-500/30 gap-1.5 py-3 font-bold text-[10px]">
                                                <FaCheckCircle className="text-[10px]" /> FIRST AUTHOR
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-base-content group-hover:text-amber-600 transition-colors duration-300">
                                        {chapter.title}
                                    </h3>

                                    <div className="flex items-center gap-3 text-lg font-bold text-base-content/80 italic">
                                        <HiOutlineBookOpen className="text-amber-500 flex-shrink-0" />
                                        {chapter.book}
                                    </div>

                                    <p className="text-base-content/60 font-medium leading-relaxed max-w-3xl">
                                        {chapter.authors.split(/(Anindya Nag)/).map((part, idx) =>
                                            part === "Anindya Nag" ? (
                                                <span key={idx} className="text-base-content font-black decoration-amber-500 decoration-2 underline underline-offset-4">Anindya Nag</span>
                                            ) : part
                                        )}
                                    </p>

                                    {chapter.link && (
                                        <div className="pt-4">
                                            <a
                                                href={chapter.link} target="_blank" rel="noopener noreferrer"
                                                className="btn btn-outline btn-amber-500 hover:btn-amber-500 rounded-2xl group/link px-8"
                                            >
                                                Read Chapter
                                                <FaExternalLinkAlt className="text-xs group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Specialized Modal Styling */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-2">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <FaPlus size={24} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black">{currentChapter ? "Edit Chapter" : "New Chapter Entry"}</h3>
                            <p className="opacity-50 text-xs font-bold uppercase tracking-widest">Library Records Management</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Year of Release *</label>
                                <input type="text" name="year" value={formData.year} onChange={handleInputChange} className="input bg-base-200 border-none focus:ring-2 focus:ring-amber-500/50" required />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Chapter Title *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input bg-base-200 border-none focus:ring-2 focus:ring-amber-500/50 font-bold" required />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Complete Author List *</label>
                                <input type="text" name="authors" value={formData.authors} onChange={handleInputChange} className="input bg-base-200 border-none focus:ring-2 focus:ring-amber-500/50" required />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Book Title / Edited Volume *</label>
                                <input type="text" name="book" value={formData.book} onChange={handleInputChange} className="input bg-base-200 border-none focus:ring-2 focus:ring-amber-500/50 italic" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Link (DOI/Publisher)</label>
                                <input type="url" name="link" value={formData.link} onChange={handleInputChange} className="input bg-base-200 border-none focus:ring-2 focus:ring-amber-500/50" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Chapter Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="select bg-base-200 border-none focus:ring-2 focus:ring-amber-500/50">
                                    <option value="">Choose Status</option>
                                    <option value="Published">Published</option>
                                    <option value="In Press">In Press</option>
                                    <option value="Submitted">Submitted</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-base-300/30 p-5 rounded-3xl flex flex-wrap gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="is_first_author" checked={formData.is_first_author} onChange={handleInputChange} className="checkbox checkbox-primary" />
                                <span className="text-sm font-bold opacity-80">Primary Contributor (First Author)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="is_corresponding_author" checked={formData.is_corresponding_author} onChange={handleInputChange} className="checkbox checkbox-secondary" />
                                <span className="text-sm font-bold opacity-80">Corresponding Author</span>
                            </label>
                        </div>

                        <div className="modal-action">
                            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn bg-amber-500 hover:bg-amber-600 text-white px-10 rounded-2xl border-none shadow-lg shadow-amber-500/20">
                                {currentChapter ? "Update Record" : "Save Chapter"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete} title="Delete Entry"
                message="This will remove the book chapter record permanently."
                confirmText="Delete" confirmColor="error"
            />
        </section>
    );
};

export default BookChapters;