import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaMicrophone, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, FaGlobeAmericas, FaUserTie } from 'react-icons/fa';
import { HiOutlineCalendar, HiOutlinePresentationChartBar } from 'react-icons/hi';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from "../common/Modal";
import Toast from '../common/Toast';
import ConfirmationModal from '../common/ConfirmationModal';

const ConferenceProceedings = () => {
    const { user } = useAuth();
    const [proceedings, setProceedings] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProceeding, setCurrentProceeding] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [proceedingToDelete, setProceedingToDelete] = useState(null);
    const [formData, setFormData] = useState({
        year: "", title: "", authors: "", conference: "",
        location: "", link: "", is_first_author: false,
        is_corresponding_author: false, status: ""
    });

    // Logic remains identical to original source
    useEffect(() => {
        const fetchProceedings = async () => {
            try {
                const proceedingsCollection = collection(db, 'conference_proceedings');
                const snapshot = await getDocs(proceedingsCollection);
                const proceedingsData = {};
                snapshot.forEach(doc => {
                    if (doc.data().proceedings) {
                        proceedingsData[doc.id] = doc.data().proceedings.map((proceeding, index) => ({
                            ...proceeding, docId: doc.id, proceedingIndex: index
                        }));
                    }
                });
                setProceedings(proceedingsData);
                const years = Object.keys(proceedingsData).sort((a, b) => b.localeCompare(a));
                if (years.length > 0) setActiveYear(years[0]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching conference proceedings:', error);
                setLoading(false);
            }
        };
        fetchProceedings();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const proceedingData = {
                title: formData.title, authors: formData.authors, conference: formData.conference,
                location: formData.location, link: formData.link, is_first_author: formData.is_first_author,
                is_corresponding_author: formData.is_corresponding_author, status: formData.status
            };
            if (currentProceeding) {
                const yearDocRef = doc(db, "conference_proceedings", currentProceeding.docId);
                const yearDoc = await getDoc(yearDocRef);
                if (yearDoc.exists()) {
                    const proceedings = [...yearDoc.data().proceedings];
                    if (currentProceeding.year !== formData.year) {
                        proceedings.splice(currentProceeding.proceedingIndex, 1);
                        await updateDoc(yearDocRef, { proceedings });
                        const newYearDocRef = doc(db, "conference_proceedings", formData.year);
                        const newYearDoc = await getDoc(newYearDocRef);
                        if (newYearDoc.exists()) {
                            const newProceedings = [...newYearDoc.data().proceedings, proceedingData];
                            await updateDoc(newYearDocRef, { proceedings: newProceedings });
                        } else {
                            await setDoc(newYearDocRef, { proceedings: [proceedingData] });
                        }
                    } else {
                        proceedings[currentProceeding.proceedingIndex] = proceedingData;
                        await updateDoc(yearDocRef, { proceedings });
                    }
                }
            } else {
                const yearDocRef = doc(db, "conference_proceedings", formData.year);
                const yearDoc = await getDoc(yearDocRef);
                if (yearDoc.exists()) {
                    const existingProceedings = yearDoc.data().proceedings || [];
                    await updateDoc(yearDocRef, { proceedings: [proceedingData, ...existingProceedings] });
                } else {
                    await setDoc(yearDocRef, { proceedings: [proceedingData] });
                }
            }
            setIsModalOpen(false);
            setCurrentProceeding(null);
            setLoading(true);
            const snapshot = await getDocs(collection(db, 'conference_proceedings'));
            const proceedingsData = {};
            snapshot.forEach(doc => {
                if (doc.data().proceedings) {
                    proceedingsData[doc.id] = doc.data().proceedings.map((p, i) => ({ ...p, docId: doc.id, proceedingIndex: i }));
                }
            });
            setProceedings(proceedingsData);
            setLoading(false);
            setToastMessage(currentProceeding ? 'Proceeding updated successfully' : 'Proceeding added successfully');
            setToastType('success');
            setShowToast(true);
        } catch (error) {
            setToastMessage('Error saving proceeding');
            setToastType('error');
            setShowToast(true);
        }
    };

    const handleEdit = (proceeding) => {
        setCurrentProceeding(proceeding);
        setFormData({
            year: proceeding.docId, title: proceeding.title, authors: proceeding.authors,
            conference: proceeding.conference || "", location: proceeding.location || "",
            link: proceeding.link || "", is_first_author: proceeding.is_first_author || false,
            is_corresponding_author: proceeding.is_corresponding_author || false, status: proceeding.status || ""
        });
        setIsModalOpen(true);
    };

    const handleDelete = (docId, proceedingIndex) => {
        setProceedingToDelete({ docId, proceedingIndex });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!proceedingToDelete) return;
        try {
            const { docId, proceedingIndex } = proceedingToDelete;
            const yearDocRef = doc(db, "conference_proceedings", docId);
            const yearDoc = await getDoc(yearDocRef);
            if (yearDoc.exists()) {
                const prs = [...yearDoc.data().proceedings];
                prs.splice(proceedingIndex, 1);
                prs.length === 0 ? await deleteDoc(yearDocRef) : await updateDoc(yearDocRef, { proceedings: prs });
                setLoading(true);
                const snapshot = await getDocs(collection(db, 'conference_proceedings'));
                const proceedingsData = {};
                snapshot.forEach(doc => {
                    if (doc.data().proceedings) {
                        proceedingsData[doc.id] = doc.data().proceedings.map((p, i) => ({ ...p, docId: doc.id, proceedingIndex: i }));
                    }
                });
                setProceedings(proceedingsData);
                setLoading(false);
                setToastMessage('Proceeding deleted successfully');
                setToastType('success');
                setShowToast(true);
            }
        } catch (error) {
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsDeleteModalOpen(false);
            setProceedingToDelete(null);
        }
    };

    const openAddModal = () => {
        setCurrentProceeding(null);
        setFormData({
            year: activeYear || new Date().getFullYear().toString(),
            title: "", authors: "", conference: "", location: "",
            link: "", is_first_author: false, is_corresponding_author: false, status: ""
        });
        setIsModalOpen(true);
    };

    const years = Object.keys(proceedings).sort((a, b) => b.localeCompare(a));

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center bg-base-100">
                <span className="loading loading-bars loading-lg text-indigo-500"></span>
            </div>
        );
    }

    return (
        <section id="conference-proceedings" className="py-24 px-4 sm:px-6 lg:px-8 bg-base-100 text-base-content min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Modern Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="badge badge-secondary badge-outline px-4 py-3 gap-2 font-bold uppercase tracking-widest text-[10px]">
                            <FaGlobeAmericas /> Global Presentations
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                            Conference <span className="text-secondary italic">Proceedings</span>
                        </h2>
                        <div className="h-2 w-32 bg-secondary rounded-full"></div>
                    </div>
                    {user && (
                        <button onClick={openAddModal} className="btn btn-secondary shadow-lg shadow-secondary/20 hover:scale-105 transition-all">
                            <FaPlus /> Add Presentation
                        </button>
                    )}
                </div>

                {/* Sticky Navigation Bar */}
                {years.length > 0 && (
                    <div className="sticky top-6 z-30 mb-12 flex justify-center">
                        <div className="bg-base-200/60 backdrop-blur-xl border border-base-content/10 p-1.5 rounded-2xl shadow-2xl flex gap-1 overflow-x-auto no-scrollbar max-w-full">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setActiveYear(year)}
                                    className={`btn btn-sm md:btn-md rounded-xl border-none transition-all ${
                                        activeYear === year 
                                        ? 'btn-secondary text-secondary-content shadow-md' 
                                        : 'bg-transparent hover:bg-base-300'
                                    }`}
                                >
                                    {year}
                                    <div className={`badge badge-sm ml-1 ${activeYear === year ? 'badge-ghost' : 'badge-base-300'}`}>
                                        {proceedings[year]?.length || 0}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Staggered Content Grid */}
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    {proceedings[activeYear]?.map((item, idx) => (
                        <div
                            key={idx}
                            style={{ animationDelay: `${idx * 150}ms` }}
                            className="group relative flex flex-col bg-base-200/40 hover:bg-base-200 rounded-[2rem] p-8 border border-base-content/5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                        >
                            {user && (
                                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(item)} className="btn btn-circle btn-sm btn-ghost bg-base-100 shadow-sm text-info"><FaEdit /></button>
                                    <button onClick={() => handleDelete(item.docId, item.proceedingIndex)} className="btn btn-circle btn-sm btn-ghost bg-base-100 shadow-sm text-error"><FaTrash /></button>
                                </div>
                            )}

                            <div className="flex-1">
                                {/* Top Meta Info */}
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <div className="p-3 bg-secondary/10 text-secondary rounded-2xl group-hover:bg-secondary group-hover:text-secondary-content transition-colors">
                                        <FaMicrophone size={20} />
                                    </div>
                                    {item.status && (
                                        <span className="badge badge-accent font-bold py-3 px-4">{item.status}</span>
                                    )}
                                </div>

                                <h3 className="text-2xl font-black leading-tight mb-4 group-hover:text-secondary transition-colors">
                                    {item.title}
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <HiOutlinePresentationChartBar className="text-secondary mt-1 flex-shrink-0" />
                                        <span className="font-bold italic text-base-content/80 leading-snug">{item.conference}</span>
                                    </div>
                                    
                                    {item.location && (
                                        <div className="flex items-center gap-3 text-sm font-semibold opacity-60">
                                            <FaMapMarkerAlt className="text-secondary" />
                                            <span>{item.location}</span>
                                        </div>
                                    )}

                                    <p className="text-sm font-medium leading-relaxed border-l-4 border-secondary/20 pl-4 py-1">
                                        {item.authors.split(/(Anindya Nag)/).map((part, i) =>
                                            part === "Anindya Nag" ? (
                                                <span key={i} className="text-secondary font-black underline decoration-2 underline-offset-4">Anindya Nag</span>
                                            ) : part
                                        )}
                                    </p>
                                </div>

                                {/* Author Role Badges */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {item.is_first_author && (
                                        <span className="badge badge-outline badge-primary gap-1 py-3 text-[10px] font-black uppercase">
                                            <FaUserTie /> Lead Presenter
                                        </span>
                                    )}
                                    {item.is_corresponding_author && (
                                        <span className="badge badge-outline badge-info gap-1 py-3 text-[10px] font-black uppercase">
                                            Corresponding
                                        </span>
                                    )}
                                </div>
                            </div>

                            {item.link && (
                                <div className="pt-6 border-t border-base-content/5">
                                    <a
                                        href={item.link} target="_blank" rel="noopener noreferrer"
                                        className="btn btn-block btn-ghost hover:btn-secondary group/btn rounded-2xl"
                                    >
                                        Access Full Proceeding
                                        <FaExternalLinkAlt className="text-xs group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modern Specialized Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-2">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-16 h-16 bg-secondary text-secondary-content rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-secondary/30">
                            <FaMicrophone size={30} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black">{currentProceeding ? "Edit Presentation" : "Add Presentation"}</h3>
                            <p className="opacity-50 text-sm font-medium uppercase tracking-widest">Event Record Management</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Conference Year *</label>
                                <input type="text" name="year" value={formData.year} onChange={handleInputChange} className="input bg-base-200 focus:input-secondary border-none" required placeholder="e.g. 2025" />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Paper/Talk Title *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input bg-base-200 focus:input-secondary border-none font-bold" required />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Full Author List *</label>
                                <input type="text" name="authors" value={formData.authors} onChange={handleInputChange} className="input bg-base-200 focus:input-secondary border-none" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Conference Name *</label>
                                <input type="text" name="conference" value={formData.conference} onChange={handleInputChange} className="input bg-base-200 focus:input-secondary border-none" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">City/Country</label>
                                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input bg-base-200 focus:input-secondary border-none" placeholder="e.g. Tokyo, Japan" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Proceeding URL</label>
                                <input type="url" name="link" value={formData.link} onChange={handleInputChange} className="input bg-base-200 focus:input-secondary border-none" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase tracking-widest opacity-60">Event Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="select bg-base-200 focus:select-secondary border-none">
                                    <option value="">Select Status</option>
                                    <option value="Published">Published</option>
                                    <option value="Presented">Presented</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Submitted">Submitted</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 bg-base-300/30 p-4 rounded-3xl">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="is_first_author" checked={formData.is_first_author} onChange={handleInputChange} className="checkbox checkbox-secondary" />
                                <span className="text-sm font-black uppercase tracking-tighter">Lead Presenter</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="is_corresponding_author" checked={formData.is_corresponding_author} onChange={handleInputChange} className="checkbox checkbox-accent" />
                                <span className="text-sm font-black uppercase tracking-tighter">Corresponding Author</span>
                            </label>
                        </div>

                        <div className="modal-action">
                            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-secondary px-10 shadow-xl shadow-secondary/30 font-black uppercase">
                                {currentProceeding ? "Save Changes" : "Create Record"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete} title="Confirm Deletion"
                message="This will remove the conference record permanently from your profile."
                confirmText="Delete" confirmColor="error"
            />
        </section>
    );
};

export default ConferenceProceedings;