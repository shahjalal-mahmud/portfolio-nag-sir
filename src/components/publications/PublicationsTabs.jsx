import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
            {/* Header Section */}
            <div className="text-center mb-16 space-y-4">
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-5xl font-black text-base-content tracking-tight"
                >
                    Academic <span className="text-primary">Publications</span>
                </motion.h2>
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "80px" }}
                    className="h-1.5 bg-primary mx-auto rounded-full"
                />
                <p className="max-w-2xl mx-auto text-lg text-base-content/70 font-medium">
                    A curated collection of scholarly contributions across various academic disciplines.
                </p>
            </div>

            {/* Modern Animated Tabs Container */}
            <div className="flex justify-center w-full">
                <div className="inline-flex flex-wrap justify-center items-center p-2 bg-base-300/50 backdrop-blur-md rounded-2xl border border-base-content/5 shadow-inner">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-6 py-2.5 text-sm sm:text-base font-bold transition-all duration-500 rounded-xl outline-none ${
                                activeTab === tab 
                                ? "text-primary-content" 
                                : "text-base-content/60 hover:text-base-content"
                            }`}
                        >
                            {/* Animated Background Pill */}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTabPill"
                                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                                    transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content with Entry Animation */}
            <div className="mt-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {(activeTab === "All" || activeTab === "Edited Books") && (
                            <div className="mb-10">
                                <EditedBooks />
                            </div>
                        )}
                        {(activeTab === "All" || activeTab === "Journal Articles") && (
                            <div className="mb-10">
                                <JournalArticles />
                            </div>
                        )}
                        {(activeTab === "All" || activeTab === "Conference Proceedings") && (
                            <div className="mb-10">
                                <ConferenceProceedings />
                            </div>
                        )}
                        {(activeTab === "All" || activeTab === "Book Chapters") && (
                            <div className="mb-10">
                                <BookChapters />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default PublicationsTabs;