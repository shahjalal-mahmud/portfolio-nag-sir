import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JournalReviews from "./JournalReviews";
import ConferenceReviews from "./ConferenceReviews";
import TechnicalProgramCommittee from "./TechnicalProgramCommittee";
import JournalEditorialBoard from "./JournalEditorialBoard";

const tabs = [
  { id: "All", label: "All" },
  { id: "Program Committee", label: "Program Committee" },
  { id: "Journal Reviews", label: "Journal Reviews" },
  { id: "Conference Reviews", label: "Conference Reviews" },
  { id: "Editorial Board", label: "Editorial Board" }
];

const ReviewExperience = () => {
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
          Review <span className="text-primary">Experience</span>
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "80px" }}
          className="h-1.5 bg-primary mx-auto rounded-full"
        />
        <p className="max-w-2xl mx-auto text-lg text-base-content/70 font-medium">
          Peer review contributions to academic journals and conferences
        </p>
      </div>

      {/* Modern Animated Tabs Container */}
      <div className="flex justify-center w-full">
        <div className="inline-flex flex-wrap justify-center items-center p-2 bg-base-300/50 backdrop-blur-md rounded-2xl border border-base-content/5 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-2.5 text-sm sm:text-base font-bold transition-all duration-500 rounded-xl outline-none ${
                activeTab === tab.id
                  ? "text-primary-content"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              {/* Animated Background Pill */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabPillReview"
                  className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
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
            {(activeTab === "All" || activeTab === "Program Committee") && (
              <div className="mb-10">
                <TechnicalProgramCommittee />
              </div>
            )}
            {(activeTab === "All" || activeTab === "Journal Reviews") && (
              <div className="mb-10">
                <JournalReviews />
              </div>
            )}
            {(activeTab === "All" || activeTab === "Conference Reviews") && (
              <div className="mb-10">
                <ConferenceReviews />
              </div>
            )}
            {(activeTab === "All" || activeTab === "Editorial Board") && (
              <div className="mb-10">
                <JournalEditorialBoard />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ReviewExperience;