import React, { useState } from 'react';
import { FaBookOpen, FaExternalLinkAlt } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi';
import PublicationsData from './PublicationsData.json';

const BookChapters = () => {
    const { book_chapters } = PublicationsData.publications;
    const years = Object.keys(book_chapters).sort((a, b) => b.localeCompare(a));
    const [activeYear, setActiveYear] = useState(years[0]);

    return (
        <section
            id='book-chapters'
            className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-amber-50 text-amber-600">
                        <FaBookOpen className="text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Book Chapters
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Scholarly contributions to edited volumes and collections
                    </p>
                </div>

                <div className="flex overflow-x-auto pb-4 mb-10 scrollbar-hide">
                    <div className="flex space-x-2 mx-auto">
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setActiveYear(year)}
                                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center ${activeYear === year
                                    ? 'bg-amber-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <HiOutlineCalendar className="mr-2" />
                                {year}
                                <span className="ml-2 text-xs bg-white/20 rounded-full px-2 py-0.5">
                                    {book_chapters[year]?.length || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {book_chapters[activeYear]?.map((chapter, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 bg-white hover:shadow-sm"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 leading-snug mb-3">
                                        <a
                                            href={chapter.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-amber-600 transition-colors"
                                        >
                                            {chapter.title}
                                        </a>
                                    </h3>

                                    <div className="flex items-start text-sm text-gray-600 mb-3">
                                        <FaBookOpen className="mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
                                        <span className="italic">{chapter.book}</span>
                                    </div>

                                    <p className="text-sm text-gray-700 mb-4">
                                        {chapter.authors.split(/(Anindya Nag)/).map((part, idx) =>
                                            part === "Anindya Nag" ? (
                                                <strong key={idx} className="text-gray-900 font-semibold">Anindya Nag</strong>
                                            ) : (
                                                part
                                            )
                                        )}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {chapter.is_first_author && (
                                            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                                First Author
                                            </span>
                                        )}
                                        {chapter.is_corresponding_author && (
                                            <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                                                Corresponding Author
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <a
                                        href={chapter.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors"
                                    >
                                        <span>View Chapter</span>
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

export default BookChapters;