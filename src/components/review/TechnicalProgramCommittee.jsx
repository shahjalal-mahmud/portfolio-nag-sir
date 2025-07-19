import React from "react";

const technicalprogram = [
  {
    name: "ICRTCIS-2025",
    date: "June 2025",
    title: "6th Int. Conf. on Recent Trends in Communication & Intelligent System",
    location: "Jaipur, Rajasthan, India",
    publisher: "Springer, IET",
  }
];

const TechnicalProgramCommittee = () => {
  return (
    <div className="mb-20">
      <div className="flex items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Technical Program Committee Member</h3>
        <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {technicalprogram.length} Conference{technicalprogram.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {technicalprogram.map((conf, index) => (
          <div 
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-xl font-bold text-blue-700">{conf.name}</h4>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                {conf.date}
              </span>
            </div>
            
            <p className="text-gray-800 mb-3">{conf.title}</p>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {conf.location}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span>Published by <span className="font-medium">{conf.publisher}</span></span>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Technical Program Committee Member
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalProgramCommittee;