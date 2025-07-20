import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaBook } from "react-icons/fa";
import { HiOutlineCalendar } from 'react-icons/hi';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const EditedBooks = () => {
    const [editedBooks, setEditedBooks] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState(null);

    useEffect(() => {
        const fetchEditedBooks = async () => {
            try {
                const booksCollection = collection(db, "edited_books");
                const snapshot = await getDocs(booksCollection);
                
                const booksData = {};
                snapshot.forEach(doc => {
                    booksData[doc.id] = doc.data().books;
                });
                
                setEditedBooks(booksData);
                
                // Set the most recent year as active by default
                const years = Object.keys(booksData).sort((a, b) => b.localeCompare(a));
                if (years.length > 0) {
                    setActiveYear(years[0]);
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching edited books:", error);
                setLoading(false);
            }
        };

        fetchEditedBooks();
    }, []);

    if (loading) {
        return (
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <p>Loading edited books...</p>
                </div>
            </section>
        );
    }

    const years = Object.keys(editedBooks).sort((a, b) => b.localeCompare(a));

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

                {years.length > 0 && (
                    <>
                        <div className="flex overflow-x-auto pb-4 mb-10 scrollbar-hide">
                            <div className="flex space-x-2 mx-auto">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => setActiveYear(year)}
                                        className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center ${activeYear === year
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <HiOutlineCalendar className="mr-2" />
                                        {year}
                                        <span className="ml-2 text-xs bg-white/20 rounded-full px-2 py-0.5">
                                            {editedBooks[year]?.length || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {editedBooks[activeYear]?.map((book, index) => (
                                <div
                                    key={index}
                                    className="relative border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 bg-white hover:shadow-sm"
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                                                <a
                                                    href={book.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-blue-600 transition-colors"
                                                >
                                                    {book.title}
                                                </a>
                                            </h3>

                                            {book.is_first_author && (
                                                <span className="inline-block mt-2 text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                                    Lead Editor
                                                </span>
                                            )}

                                            <div className="mt-4 space-y-2 text-sm text-gray-600">
                                                <p className="flex">
                                                    <span className="font-medium text-gray-700 min-w-[70px]">Editors:</span>
                                                    <span className="ml-2">
                                                        {book.authors.split(/(Anindya Nag)/).map((part, idx) =>
                                                            part === "Anindya Nag" ? (
                                                                <span
                                                                    key={idx}
                                                                    className="font-semibold text-gray-900"
                                                                >
                                                                    Anindya Nag
                                                                </span>
                                                            ) : (
                                                                part
                                                            )
                                                        )}
                                                    </span>
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
                    </>
                )}

                {!loading && years.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No edited books found</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default EditedBooks;