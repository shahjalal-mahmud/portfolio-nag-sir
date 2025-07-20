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
  {
    name: "Discover Artificial Intelligence, Springer Nature",
    url: "https://link.springer.com/journal/44163",
  },
];

const JournalReviews = () => {
  return (
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
  );
};

export default JournalReviews;