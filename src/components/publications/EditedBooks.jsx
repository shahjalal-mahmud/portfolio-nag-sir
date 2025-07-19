import publicationsData from "./PublicationsData.json";
import { FaExternalLinkAlt, FaBook } from "react-icons/fa";

const EditedBooks = () => {
    const editedBooks = publicationsData.publications.edited_books;
    const years = Object.keys(editedBooks).sort((a, b) => b - a); // Descending year

    return (
        <section
            id="edited-books"
            className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-50 text-blue-600">
                        <FaBook className="text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Edited Books
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Scholarly collections and editorial contributions
                    </p>
                </div>

                <div className="space-y-12">
                    {years.map((year) => (
                        <div key={year} className="group">
                            <div className="flex items-center mb-6">
                                <h3 className="text-2xl font-semibold text-gray-900 mr-4">
                                    {year}
                                </h3>
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="ml-4 text-sm font-medium text-gray-500">
                                    {editedBooks[year].length} {editedBooks[year].length === 1 ? 'publication' : 'publications'}
                                </span>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                {editedBooks[year].map((book, index) => (
                                    <div
                                        key={index}
                                        className="relative border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 bg-white hover:shadow-sm"
                                    >
                                        <div className="flex flex-col h-full">
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-900 leading-snug">
                                                    {book.title}
                                                </h4>

                                                {book.is_first_author && (
                                                    <span className="inline-block mt-2 text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                                        First/Corresponding Author
                                                    </span>
                                                )}

                                                <div className="mt-4 space-y-2 text-sm text-gray-600">
                                                    <p className="flex">
                                                        <span className="font-medium text-gray-700 min-w-[70px]">Authors:</span>
                                                        <span className="ml-2">{book.authors}</span>
                                                    </p>
                                                    <p className="flex">
                                                        <span className="font-medium text-gray-700 min-w-[70px]">Publisher:</span>
                                                        <span className="ml-2">{book.publisher}</span>
                                                    </p>

                                                    {book.isbn && (
                                                        <p className="flex">
                                                            <span className="font-medium text-gray-700 min-w-[70px]">ISBN:</span>
                                                            <span className="ml-2 font-mono">{book.isbn}</span>
                                                        </p>
                                                    )}

                                                    {book.status && !book.isbn && (
                                                        <p className="flex items-center">
                                                            <span className="font-medium text-gray-700 min-w-[70px]">Status:</span>
                                                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                                                                {book.status}
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {book.link && (
                                                <div className="mt-6 pt-4 border-t border-gray-100">
                                                    <a
                                                        href={book.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                        <span>View Publication</span>
                                                        <FaExternalLinkAlt className="ml-2 text-xs" />
                                                    </a>
                                                </div>
                                            )}
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

export default EditedBooks;