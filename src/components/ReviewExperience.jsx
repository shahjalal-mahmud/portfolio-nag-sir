import React from "react";

const journalReviews = [
  {
    name: "Pattern Recognition, Elsevier",
    url: "https://www.sciencedirect.com/journal/pattern-recognition",
  },
  {
    name: "IEEE Access, IEEE",
    url: "https://ieeeaccess.ieee.org",
  },
  {
    name: "Transactions on Emerging Telecommunications Technologies, Wiley",
    url: "https://onlinelibrary.wiley.com/journal/21613915",
  },
  {
    name: "Human-Centric Intelligent Systems, Springer",
    url: "https://link.springer.com/journal/44230",
  },
  {
    name: "PLOS Digital Health, PLOS",
    url: "https://journals.plos.org/digitalhealth/",
  },
  {
    name: "Frontiers in Nutrition, Frontiers",
    url: "https://www.frontiersin.org/journals/nutrition",
  },
  {
    name: "Frontiers in Oncology, Frontiers",
    url: "https://www.frontiersin.org/journals/oncology",
  },
  {
    name: "Computer Methods in Biomechanics and Biomedical Engineering, Taylor & Francis",
    url: "https://www.tandfonline.com/journals/gcmb20",
  },
  {
    name: "Artificial Intelligence and Applications, Bon View Publishing",
    url: "https://ojs.bonviewpress.com/index.php/AIA/index", 
  },
  {
    name: "International Journal of Computing and Digital Systems, University of Bahrain, Bahrain",
    url: "https://ijcds.uob.edu.bh/",
  },
];
const  technicalprogram = [
  {
    name: "ICRTCIS-2025",
    date: "June 2025",
    title: "6th Int. Conf. on Recent Trends in Communication & Intelligent System",
    location: "Jaipur, Rajasthan, India",
    publisher: "Springer, IET",
  }
];
const conferenceReviews = [
  {
    name: "WcCST-2026",
    date: "March 2026",
    title: "World Conference on Computational Science & Technology",
    location: "Punjab, India",
    publisher: "IEEE",
  },
  {
    name: "INCSTIC-2025",
    date: "October 2025",
    title: "1st Int. Conf. on Smart Technologies & Intelligent Computing",
    location: "Haryana, India",
    publisher: "CRC Press",
  },
  {
    name: "ICRTCIS-2025",
    date: "June 2025",
    title: "6th Int. Conf. on Recent Trends in Communication & Intelligent System",
    location: "Jaipur, Rajasthan, India",
    publisher: "Springer, IET",
  },
  {
    name: "InCACCT-2025",
    date: "April 2025",
    title: "3rd Int. Conf. on Advancement in Computation & Computer Technologies",
    location: "Jaipur, Rajasthan, India",
    publisher: "IEEE",
  },
  {
    name: "IISU-ASSET-2025",
    date: "March 2025",
    title: "Int. Conf. on AI Systems and Sustainable Technologies",
    location: "Jaipur, India",
    publisher: "Springer",
  },
  {
    name: "STI-2024",
    date: "December 2024",
    title: "6th Int. Conf. on Sustainable Technologies for Industry 5.0",
    location: "Dhaka, Bangladesh",
    publisher: "Springer",
  },
  {
    name: "ICRTAC-2024",
    date: "November 2024",
    title: "7th Int. Conf. on Recent Trends in Advanced Computing",
    location: "Chennai, India",
    publisher: "Springer",
  },
  {
    name: "ICETAI-2024",
    date: "September 2024",
    title: "2nd Int. Conf. on Emerging Trends and Applications in AI",
    location: "Baghdad, Iraq",
    publisher: "IEEE",
  },
  {
    name: "AIBThings-2024",
    date: "September 2024",
    title: "2nd Int. Conf. on AI, Blockchain, and IoT",
    location: "Michigan, USA",
    publisher: "IEEE",
  },
  {
    name: "ICSCPS-2024",
    date: "September 2024",
    title: "Int. Conf. on Smart Cyber-Physical Systems",
    location: "Delhi NCR, India",
    publisher: "IEEE",
  },
  {
    name: "ICCTAC-2024",
    date: "May 2024",
    title: "Int. Conf. on Current Trends in Advanced Computing",
    location: "Bengaluru, India",
    publisher: "Springer",
  },
  {
    name: "ICCCIS-2023",
    date: "November 2023",
    title: "4th Int. Conf. on Computing Communication, and Intelligent Systems",
    location: "Uttar Pradesh, India",
    publisher: "IEEE",
  },
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

      {/* Journal Reviews */}
      <div className="mb-20">
        <div className="flex items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Journal Article Reviews</h3>
          <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {journalReviews.length} Journals
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journalReviews.map((journal, index) => (
            <a 
              key={index}
              href={journal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-4">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{journal.name.split(',')[0]}</p>
                  <p className="text-gray-600 text-sm">{journal.name.split(',')[1]}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Conference Reviews */}
      <div>
        <div className="flex items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Conference Review Experiences</h3>
          <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {conferenceReviews.length} Conferences
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {conferenceReviews.map((conf, index) => (
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
            </div>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <TechnicalProgramCommittee />
      </div>
    </section>
  );
};

export default ReviewExperience;