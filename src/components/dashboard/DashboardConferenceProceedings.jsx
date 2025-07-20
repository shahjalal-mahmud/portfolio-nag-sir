import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaMicrophone, FaMapMarkerAlt, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Modal from "../common/Modal";

const DashboardConferenceProceedings = () => {
    const [proceedings, setProceedings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProceeding, setCurrentProceeding] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
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
        fetchProceedings();
    }, []);

    const fetchProceedings = async () => {
        try {
            const proceedingsCollection = collection(db, "conference_proceedings");
            const snapshot = await getDocs(proceedingsCollection);

            const proceedingsData = [];
            snapshot.forEach(yearDoc => {
                const proceedings = yearDoc.data().proceedings || [];
                proceedings.forEach((proceeding, index) => {
                    proceedingsData.push({
                        ...proceeding,
                        year: yearDoc.id,
                        docId: yearDoc.id,
                        proceedingIndex: index
                    });
                });
            });

            setProceedings(proceedingsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching conference proceedings:", error);
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
            const proceedingData = {
                title: formData.title,
                authors: formData.authors,
                conference: formData.conference,
                location: formData.location,
                link: formData.link,
                is_first_author: formData.is_first_author,
                is_corresponding_author: formData.is_corresponding_author,
                status: formData.status,
                year: formData.year
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
            fetchProceedings();
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
                    
                    fetchProceedings();
                }
            } catch (error) {
                console.error("Error deleting proceeding:", error);
            }
        }
    };

    const openAddModal = () => {
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
        setIsModalOpen(true);
    };

    const filteredProceedings = proceedings.filter(proceeding => {
        const title = proceeding.title ? proceeding.title.toLowerCase() : '';
        const authors = proceeding.authors ? proceeding.authors.toLowerCase() : '';
        const conference = proceeding.conference ? proceeding.conference.toLowerCase() : '';
        const year = proceeding.year ? proceeding.year.toString() : '';
        const searchTermLower = searchTerm.toLowerCase();

        return (
            title.includes(searchTermLower) ||
            authors.includes(searchTermLower) ||
            conference.includes(searchTermLower) ||
            year.includes(searchTerm)
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center text-gray-800">
                        <FaMicrophone className="mr-3 text-indigo-600" />
                        Conference Proceedings Management
                    </h2>
                    <p className="text-gray-500 mt-1">Manage all conference proceedings in your portfolio</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-grow max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search proceedings..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={openAddModal}
                        className="btn btn-primary gap-2"
                    >
                        <FaPlus />
                        Add New Proceeding
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
                                Conference
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
                        {filteredProceedings
                            .sort((a, b) => b.year.localeCompare(a.year))
                            .map((proceeding) => (
                                <tr key={`${proceeding.docId}-${proceeding.proceedingIndex}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-400" />
                                            <span className="font-medium">{proceeding.year}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-[200px]">
                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                            {proceeding.title}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-[150px]">
                                        <div className="text-sm text-gray-500 whitespace-normal">
                                            {proceeding.conference}
                                        </div>
                                        {proceeding.location && (
                                            <div className="flex items-start text-xs text-gray-500 mt-1">
                                                <FaMapMarkerAlt className="mt-0.5 mr-1 text-indigo-400 flex-shrink-0" />
                                                <span>{proceeding.location}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-500 space-y-1">
                                            {proceeding.authors.split(',').map((author, i) => (
                                                <div key={i} className="whitespace-normal">
                                                    {author.trim()}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEdit(proceeding)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(proceeding.docId, proceeding.proceedingIndex)}
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
                        {filteredProceedings.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                    {searchTerm ? "No matching proceedings found" : "No conference proceedings found. Add one to get started."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
        </div>
    );
};

export default DashboardConferenceProceedings;