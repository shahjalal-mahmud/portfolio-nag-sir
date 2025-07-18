import React from 'react';
import PublicationsData from './PublicationsData.json';

const BookChapters = () => {
    const { book_chapters } = PublicationsData.publications;
    const years = Object.keys(book_chapters).sort((a, b) => b - a);

    return (
        <section
            id='book-chapters'
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    Book Chapters
                </h2>
                <div className="mt-4 h-1 w-20 bg-primary mx-auto"></div>
            </div>

            <div className="space-y-10">
                {years.map((year) => (
                    <div key={year} className="space-y-6">
                        <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                            {year}
                        </h3>
                        <div className="space-y-6">
                            {book_chapters[year].map((chapter, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                                >
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                {chapter.title}
                                            </h4>
                                            <p className="text-gray-600 mb-3">
                                                <span className="font-medium">Book:</span> {chapter.book}
                                            </p>
                                            <p className="text-gray-600 mb-4">
                                                <span className="font-medium">Authors:</span> {chapter.authors}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {chapter.is_first_author && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    First Author
                                                </span>
                                            )}
                                            {chapter.is_corresponding_author && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Corresponding Author
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <a
                                        href={chapter.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                                    >
                                        View Chapter
                                        <svg
                                            className="w-4 h-4 ml-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BookChapters;