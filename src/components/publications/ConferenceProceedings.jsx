import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaMicrophone, FaMapMarkerAlt } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const ConferenceProceedings = () => {
    const [proceedings, setProceedings] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState(null);

    useEffect(() => {
        const fetchProceedings = async () => {
            try {
                const proceedingsCollection = collection(db, 'conference_proceedings');
                const snapshot = await getDocs(proceedingsCollection);
                
                const proceedingsData = {};
                snapshot.forEach(doc => {
                    if (doc.data().proceedings) {
                        proceedingsData[doc.id] = doc.data().proceedings;
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

                <div className="flex overflow-x-auto pb-4 mb-10 scrollbar-hide">
                    <div className="flex space-x-2 mx-auto">
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setActiveYear(year)}
                                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center ${activeYear === year
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

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {proceedings[activeYear]?.map((item, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 bg-white hover:shadow-sm"
                        >
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
        </section>
    );
};

export default ConferenceProceedings;