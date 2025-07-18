import publicationsData from "./PublicationsData.json";
import { FaExternalLinkAlt } from "react-icons/fa";

const EditedBooks = () => {
    const editedBooks = publicationsData.publications.edited_books;
    const years = Object.keys(editedBooks).sort((a, b) => b - a); // Descending year

    return (
        <section
            id="edited-books"
            className="py-20 px-6 md:px-12 bg-white text-gray-900"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    Edited Books
                </h2>

                {years.map((year) => (
                    <div key={year} className="mb-12">
                        <h3 className="text-xl font-semibold text-blue-700 mb-6 border-b pb-1">
                            {year}
                        </h3>
                        <div className="space-y-6">
                            {editedBooks[year].map((book, index) => (
                                <div
                                    key={index}
                                    className="border rounded-xl p-5 shadow-sm bg-base-100 hover:shadow-md transition duration-300"
                                >
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                        <h4 className="text-lg font-semibold text-gray-800">
                                            {book.title}
                                        </h4>
                                        {book.is_first_author && (
                                            <span className="mt-2 md:mt-0 text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                First/Corresponding Author
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm mt-2 text-gray-700">
                                        <strong>Authors:</strong> {book.authors}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <strong>Publisher:</strong> {book.publisher}
                                    </p>

                                    {book.isbn && (
                                        <p className="text-sm text-gray-700">
                                            <strong>ISBN:</strong> {book.isbn}
                                        </p>
                                    )}

                                    {book.status && !book.isbn && (
                                        <p className="text-sm text-yellow-700 font-medium">
                                            <strong>Status:</strong> {book.status}
                                        </p>
                                    )}

                                    {book.link && (
                                        <a
                                            href={book.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline hover:text-blue-800"
                                        >
                                            View Book <FaExternalLinkAlt className="text-xs" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EditedBooks;
