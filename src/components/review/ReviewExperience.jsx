import React, { useState } from "react";
import JournalReviews from "./JournalReviews";
import ConferenceReviews from "./ConferenceReviews";
import TechnicalProgramCommittee from "./TechnicalProgramCommittee";

const ReviewExperience = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All" },
    { id: "technical", label: "Program Committee" },
    { id: "journal", label: "Journal Reviews" },
    { id: "conference", label: "Conference Reviews" },
  ];

  return (
    <section
      id="review-experience"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-inter"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Review Experience</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Peer review contributions to academic journals and conferences
        </p>
      </div>

      {/* Modern Tabs */}
      <div className="mb-10">
        <div className="relative">
          {/* Tab Indicators (Bottom Border) */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-gray-200 w-full"></div>
          
          {/* Tabs Container */}
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 text-sm sm:text-base font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-blue-700 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {/* Active Indicator */}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {(activeTab === "all" || activeTab === "technical") && <TechnicalProgramCommittee />}
        {(activeTab === "all" || activeTab === "journal") && <JournalReviews />}
        {(activeTab === "all" || activeTab === "conference") && <ConferenceReviews />}
      </div>
    </section>
  );
};

export default ReviewExperience;