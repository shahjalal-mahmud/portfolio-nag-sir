import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaRegNewspaper, FaQuoteRight } from 'react-icons/fa';
import { FiBarChart2 } from 'react-icons/fi';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const JournalArticles = () => {
    const [journalArticles, setJournalArticles] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState(null);

    useEffect(() => {
        const fetchJournalArticles = async () => {
            try {
                const articlesCollection = collection(db, 'journal_articles');
                const snapshot = await getDocs(articlesCollection);
                
                const articlesData = {};
                snapshot.forEach(doc => {
                    if (doc.data().articles) {
                        articlesData[doc.id] = doc.data().articles;
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

                <div className="mb-8">
                    <div className="flex flex-wrap justify-center gap-2">
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

                <div className="space-y-6">
                    {journalArticles[activeYear]?.map((article, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 bg-white hover:shadow-sm"
                        >
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
        </section>
    );
};

export default JournalArticles;