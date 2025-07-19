import React from 'react';
import { FaBookOpen, FaExternalLinkAlt } from 'react-icons/fa';
import PublicationsData from './PublicationsData.json';

const BookChapters = () => {
    const { book_chapters } = PublicationsData.publications;
    const years = Object.keys(book_chapters).sort((a, b) => b - a);

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

                <div className="space-y-12">
                    {years.map((year) => (
                        <div key={year} className="group">
                            <div className="flex items-center mb-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mr-4">
                                    {year}
                                </h3>
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span className="ml-4 text-sm font-medium text-gray-500">
                                    {book_chapters[year].length} {book_chapters[year].length === 1 ? 'contribution' : 'contributions'}
                                </span>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                {book_chapters[year].map((chapter, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 bg-white hover:shadow-sm"
                                    >
                                        <div className="flex flex-col h-full">
                                            <div className="flex-1">
                                                <h4 className="text-xl font-semibold text-gray-900 leading-snug mb-3">
                                                    {chapter.title}
                                                </h4>
                                                
                                                <div className="flex items-start text-sm text-gray-600 mb-4">
                                                    <FaBookOpen className="mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
                                                    <span className="italic">{chapter.book}</span>
                                                </div>

                                                <p className="text-sm text-gray-700 mb-4">
                                                    <span className="font-medium">Authors:</span> {chapter.authors}
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BookChapters;