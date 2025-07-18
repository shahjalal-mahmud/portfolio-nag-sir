import { FaExternalLinkAlt, FaCertificate } from "react-icons/fa";

const certifications = [
  {
    title: "Introduction to IoT & Cybersecurity",
    provider: "CISCO",
  },
  {
    title: "Advance Your Skills in Deep Learning and Neural Networks",
    provider: "LinkedIn Learning",
  },
  {
    title: "Python for Beginners & Intro to Data Structures & Algorithms",
    provider: "Udemy",
  },
  {
    title: "Excel Skills for Business, Intro to ML, Computer Vision Basics, Python Data Structures",
    provider: "Coursera",
  },
];

const Certifications = () => {
  return (
    <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaCertificate className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Professional Certifications
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Validated skills and knowledge through accredited programs
          </p>
        </div>

        {/* Certifications grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{cert.title}</h3>
              <p className="text-gray-700 mb-4">{cert.provider}</p>
              
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-8 h-8 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <a
            href="https://drive.google.com/drive/folders/1uQgdJbvhIzTYHG4_f9ULuEc6CaPcC7dH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            View All Certificates
            <FaExternalLinkAlt className="ml-2 text-sm" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Certifications;