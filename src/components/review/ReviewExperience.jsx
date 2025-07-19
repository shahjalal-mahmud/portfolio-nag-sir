import React from "react";
import JournalReviews from "./JournalReviews";
import ConferenceReviews from "./ConferenceReviews";
import TechnicalProgramCommittee from "./TechnicalProgramCommittee";

const ReviewExperience = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="review-experience">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
          Review Experience
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Peer review contributions to academic journals and conferences
        </p>
      </div>

      <JournalReviews />
      <ConferenceReviews />
      <TechnicalProgramCommittee />
    </section>
  );
};

export default ReviewExperience;