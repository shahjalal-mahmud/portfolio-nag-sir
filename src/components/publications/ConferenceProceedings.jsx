import React, { useState } from 'react';
import publicationsData from './PublicationsData.json';

const ConferenceProceedings = () => {
  const proceedings = publicationsData.publications.conference_proceedings;
  const years = Object.keys(proceedings).sort((a, b) => b.localeCompare(a)); // Descending order

  const [activeYear, setActiveYear] = useState(years[0]);

  return (
    <section className="bg-[#f9f9f9] text-gray-900 py-12 px-6 md:px-12" id="conference-proceedings">
      <h2 className="text-3xl font-bold mb-8 text-center">Conference Proceedings</h2>

      {/* Year Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 ${
              activeYear === year
                ? 'bg-black text-white shadow'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Conference Cards */}
      <div className="space-y-6">
        {proceedings[activeYear]?.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition duration-300"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg md:text-xl font-semibold text-blue-700 hover:underline mb-2"
            >
              {item.title}
            </a>

            <p className="text-sm text-gray-600 mb-1 italic">
              {item.conference} — {item.location}
            </p>

            <p className="text-sm text-gray-700">{item.authors}</p>

            {(item.is_first_author || item.is_corresponding_author) && (
              <div className="flex gap-2 mt-2">
                {item.is_first_author && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    First Author
                  </span>
                )}
                {item.is_corresponding_author && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Corresponding Author
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ConferenceProceedings;
