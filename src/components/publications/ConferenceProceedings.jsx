import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaMicrophone, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from "../common/Modal";

const ConferenceProceedings = () => {
    const { user } = useAuth();
    const [proceedings, setProceedings] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProceeding, setCurrentProceeding] = useState(null);
    const [formData, setFormData] = useState({
        year: "",
        title: "",
        authors: "",
        conference: "",
        location: "",
        link: "",
        is_first_author: false,
        is_corresponding_author: false,
        status: ""
    });

    useEffect(() => {
        const fetchProceedings = async () => {
            try {
                const proceedingsCollection = collection(db, 'conference_proceedings');
                const snapshot = await getDocs(proceedingsCollection);
                
                const proceedingsData = {};
                snapshot.forEach(doc => {
                    if (doc.data().proceedings) {
                        proceedingsData[doc.id] = doc.data().proceedings.map((proceeding, index) => ({
                            ...proceeding,
                            docId: doc.id,
                            proceedingIndex: index
                        }));
                    }
                });

                setProceedings(proceedingsData);
                
                // Set the most recent year as active by default
                const years = Object.keys(proceedingsData).sort((a, b) => b.localeCompare(a));
                if (years.length > 0) {
                    setActiveYear(years[0]);
                }
                
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
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const proceedingData = {
                title: formData.title,
                authors: formData.authors,
                conference: formData.conference,
                location: formData.location,
                link: formData.link,
                is_first_author: formData.is_first_author,
                is_corresponding_author: formData.is_corresponding_author,
                status: formData.status
            };

            if (currentProceeding) {
                // Editing an existing proceeding
                const yearDocRef = doc(db, "conference_proceedings", currentProceeding.docId);
                const yearDoc = await getDoc(yearDocRef);
                
                if (yearDoc.exists()) {
                    const proceedings = [...yearDoc.data().proceedings];
                    
                    // Check if year changed
                    if (currentProceeding.year !== formData.year) {
                        // Remove from old year
                        proceedings.splice(currentProceeding.proceedingIndex, 1);
                        await updateDoc(yearDocRef, { proceedings });
                        
                        // Add to new year
                        const newYearDocRef = doc(db, "conference_proceedings", formData.year);
                        const newYearDoc = await getDoc(newYearDocRef);
                        
                        if (newYearDoc.exists()) {
                            const newProceedings = [...newYearDoc.data().proceedings, proceedingData];
                            await updateDoc(newYearDocRef, { proceedings: newProceedings });
                        } else {
                            await setDoc(newYearDocRef, { proceedings: [proceedingData] });
                        }
                    } else {
                        // Update within same year
                        proceedings[currentProceeding.proceedingIndex] = proceedingData;
                        await updateDoc(yearDocRef, { proceedings });
                    }
                }
            } else {
                // Adding a new proceeding
                const yearDocRef = doc(db, "conference_proceedings", formData.year);
                const yearDoc = await getDoc(yearDocRef);

                if (yearDoc.exists()) {
                    const existingProceedings = yearDoc.data().proceedings || [];
                    await updateDoc(yearDocRef, {
                        proceedings: [...existingProceedings, proceedingData]
                    });
                } else {
                    await setDoc(yearDocRef, {
                        proceedings: [proceedingData]
                    });
                }
            }

            setIsModalOpen(false);
            setCurrentProceeding(null);
            setFormData({
                year: "",
                title: "",
                authors: "",
                conference: "",
                location: "",
                link: "",
                is_first_author: false,
                is_corresponding_author: false,
                status: ""
            });
            // Refresh data
            setLoading(true);
            const proceedingsCollection = collection(db, 'conference_proceedings');
            const snapshot = await getDocs(proceedingsCollection);
            
            const proceedingsData = {};
            snapshot.forEach(doc => {
                if (doc.data().proceedings) {
                    proceedingsData[doc.id] = doc.data().proceedings.map((proceeding, index) => ({
                        ...proceeding,
                        docId: doc.id,
                        proceedingIndex: index
                    }));
                }
            });

            setProceedings(proceedingsData);
            setLoading(false);
        } catch (error) {
            console.error("Error saving conference proceeding:", error);
        }
    };

    const handleEdit = (proceeding) => {
        setCurrentProceeding(proceeding);
        setFormData({
            year: proceeding.year,
            title: proceeding.title,
            authors: proceeding.authors,
            conference: proceeding.conference || "",
            location: proceeding.location || "",
            link: proceeding.link || "",
            is_first_author: proceeding.is_first_author || false,
            is_corresponding_author: proceeding.is_corresponding_author || false,
            status: proceeding.status || ""
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (docId, proceedingIndex) => {
        if (window.confirm("Are you sure you want to delete this proceeding?")) {
            try {
                const yearDocRef = doc(db, "conference_proceedings", docId);
                const yearDoc = await getDoc(yearDocRef);

                if (yearDoc.exists()) {
                    const proceedings = [...yearDoc.data().proceedings];
                    proceedings.splice(proceedingIndex, 1);

                    // If last proceeding in year, delete the entire year document
                    if (proceedings.length === 0) {
                        await deleteDoc(yearDocRef);
                    } else {
                        await updateDoc(yearDocRef, { proceedings });
                    }
                    
                    // Refresh data
                    setLoading(true);
                    const proceedingsCollection = collection(db, 'conference_proceedings');
                    const snapshot = await getDocs(proceedingsCollection);
                    
                    const proceedingsData = {};
                    snapshot.forEach(doc => {
                        if (doc.data().proceedings) {
                            proceedingsData[doc.id] = doc.data().proceedings.map((proceeding, index) => ({
                                ...proceeding,
                                docId: doc.id,
                                proceedingIndex: index
                            }));
                        }
                    });

                    setProceedings(proceedingsData);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error deleting proceeding:", error);
            }
        }
    };

    const openAddModal = () => {
        setCurrentProceeding(null);
        setFormData({
            year: activeYear || new Date().getFullYear().toString(),
            title: "",
            authors: "",
            conference: "",
            location: "",
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
                    <p>Loading conference proceedings...</p>
                </div>
            </section>
        );
    }

    const years = Object.keys(proceedings).sort((a, b) => b.localeCompare(a));

    if (years.length === 0) {
        return (
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <p>No conference proceedings found.</p>
                    {user && (
                        <button
                            onClick={openAddModal}
                            className="mt-4 btn btn-primary gap-2"
                        >
                            <FaPlus />
                            Add New Proceeding
                        </button>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section
            id="conference-proceedings"
            className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 text-indigo-600">
                        <FaMicrophone className="text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Conference Proceedings
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Scholarly contributions presented at academic conferences
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
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <HiOutlineCalendar className="mr-2" />
                                    {year}
                                    <span className="ml-2 text-xs bg-white/20 rounded-full px-2 py-0.5">
                                        {proceedings[year]?.length || 0}
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
                            Add New Proceeding
                        </button>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {proceedings[activeYear]?.map((item, idx) => (
                        <div
                            key={idx}
                            className="relative border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 bg-white hover:shadow-sm"
                        >
                            {user && (
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.docId, item.proceedingIndex)}
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
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-600 transition-colors"
                                        >
                                            {item.title}
                                        </a>
                                    </h3>

                                    <div className="flex items-start text-sm text-gray-600 mb-3">
                                        <FaMicrophone className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                                        <span className="italic">{item.conference}</span>
                                    </div>

                                    {item.location && (
                                        <div className="flex items-start text-sm text-gray-600 mb-4">
                                            <FaMapMarkerAlt className="mt-0.5 mr-2 text-indigo-500 flex-shrink-0" />
                                            <span>{item.location}</span>
                                        </div>
                                    )}

                                    <p className="text-sm text-gray-700 mb-4">
                                        {item.authors.split(/(Anindya Nag)/).map((part, idx) =>
                                            part === "Anindya Nag" ? (
                                                <strong key={idx} className="text-gray-900 font-semibold">Anindya Nag</strong>
                                            ) : (
                                                part
                                            )
                                        )}
                                    </p>

                                    {(item.is_first_author || item.is_corresponding_author) && (
                                        <div className="flex flex-wrap gap-2">
                                            {item.is_first_author && (
                                                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                                    First Author
                                                </span>
                                            )}
                                            {item.is_corresponding_author && (
                                                <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                                                    Corresponding Author
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                    >
                                        <span>View Proceedings</span>
                                        <FaExternalLinkAlt className="ml-2 text-xs" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for adding/editing proceedings */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        {currentProceeding ? "Edit Proceeding" : "Add New Proceeding"}
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
                                    placeholder="Proceeding Title"
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
                                <label className="block text-sm font-medium text-gray-700">Conference *</label>
                                <input
                                    type="text"
                                    name="conference"
                                    value={formData.conference}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="Conference Name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="City, Country"
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
                                    <option value="Presented">Presented</option>
                                    <option value="Accepted">Accepted</option>
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
                                {currentProceeding ? "Update Proceeding" : "Add Proceeding"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
};

export default ConferenceProceedings;