import React, { useState } from 'react';
import publicationsData from './PublicationsData.json';

const JournalArticles = () => {
    const journalArticles = publicationsData.publications.journal_articles;
    const years = Object.keys(journalArticles).sort((a, b) => b.localeCompare(a)); // descending

    const [activeYear, setActiveYear] = useState(years[0]);

    return (
        <section
            id='journal-articles'
            className="px-6 py-12 bg-white text-gray-900"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <h2 className="text-2xl font-bold mb-6">Journal Articles</h2>

            <div className="flex flex-wrap gap-3 mb-6">
                {years.map((year) => (
                    <button
                        key={year}
                        onClick={() => setActiveYear(year)}
                        className={`px-4 py-1 rounded-full border ${activeYear === year
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {year}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {journalArticles[activeYear].map((article, index) => (
                    <div
                        key={index}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    >
                        <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-blue-700 hover:underline"
                        >
                            {article.title}
                        </a>
                        <p className="text-sm text-gray-600 mt-1 italic">
                            {article.journal}
                            {article.impact_factor && ` • Impact Factor: ${article.impact_factor}`}
                            {article.cite_score && ` • CiteScore: ${article.cite_score}`}
                        </p>
                        <p className="mt-2 text-sm text-gray-700">{article.authors}</p>

                        {(article.is_first_author || article.is_corresponding_author) && (
                            <div className="flex gap-2 mt-2">
                                {article.is_first_author && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        First Author
                                    </span>
                                )}
                                {article.is_corresponding_author && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        Corresponding Author
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default JournalArticles;
