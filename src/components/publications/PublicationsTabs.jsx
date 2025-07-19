import { useState } from "react";
import BookChapters from "./BookChapters";
import ConferenceProceedings from "./ConferenceProceedings";
import EditedBooks from "./EditedBooks";
import JournalArticles from "./JournalArticles";

const tabs = [
    "All",
    "Edited Books",
    "Journal Articles",
    "Conference Proceedings",
    "Book Chapters",
];

const PublicationsTabs = () => {
    const [activeTab, setActiveTab] = useState("All");

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Academic Publications
                </h2>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
                    A comprehensive collection of scholarly works
                </p>
            </div>

            {/* Tabs */}
            <div className="w-full">
                <div className="flex justify-center">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 p-2 bg-gray-100 rounded-xl shadow-sm border border-gray-200 w-full max-w-4xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-sm sm:text-base font-medium px-4 py-2 rounded-md transition-all duration-300 ${activeTab === tab
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="mt-10">
                {(activeTab === "All" || activeTab === "Edited Books") && <EditedBooks />}
                {(activeTab === "All" || activeTab === "Journal Articles") && <JournalArticles />}
                {(activeTab === "All" || activeTab === "Conference Proceedings") && <ConferenceProceedings />}
                {(activeTab === "All" || activeTab === "Book Chapters") && <BookChapters />}
            </div>
        </section>
    );
};

export default PublicationsTabs;
