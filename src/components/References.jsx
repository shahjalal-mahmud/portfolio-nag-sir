import { FaUserTie, FaEnvelope, FaExternalLinkAlt } from "react-icons/fa";

const references = [
  {
    name: "Dr. Anupam Kumar Bairagi",
    title: "Professor",
    institution: "Computer Science and Engineering Discipline, Khulna University",
    location: "Khulna-9208, Bangladesh",
    email: "anupam@cse.ku.ac.bd",
    link: "https://ku.ac.bd/discipline/cse/faculty/anupam",
  },
  {
    name: "Dr. C Kishor Kumar Reddy",
    title: "Associate Professor and Head of the Department",
    institution:
      "Department of Computer Science and Engineering, Stanley College of Engineering & Technology for Women",
    location: "Hyderabad, Telangana, India",
    email: "drckkreddy@gmail.com",
  },
];

const References = () => {
  return (
    <section id="references" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaUserTie className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Professional References
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Esteemed academic and professional contacts
          </p>
        </div>

        {/* References Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {references.map((ref, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaUserTie className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {ref.link ? (
                      <a
                        href={ref.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors duration-200 flex items-center"
                      >
                        {ref.name}
                        <FaExternalLinkAlt className="ml-2 text-sm" />
                      </a>
                    ) : (
                      ref.name
                    )}
                  </h3>
                  <p className="text-blue-600 font-medium">{ref.title}</p>
                </div>
              </div>

              <div className="space-y-3 pl-16">
                <p className="text-gray-700">{ref.institution}</p>
                <p className="text-gray-600">{ref.location}</p>
                <div className="flex items-start mt-4">
                  <FaEnvelope className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                  <a
                    href={`mailto:${ref.email}`}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {ref.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default References;