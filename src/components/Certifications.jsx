import { FaExternalLinkAlt } from "react-icons/fa";

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
    <section id="certifications" className="py-16 px-4 md:px-10 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Certifications</h2>
          <a
            href="https://drive.google.com/drive/folders/1uQgdJbvhIzTYHG4_f9ULuEc6CaPcC7dH"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline flex items-center gap-2"
          >
            View Certificates
            <FaExternalLinkAlt className="text-sm" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="card bg-base-200 shadow-md hover:shadow-xl transition duration-300 border border-base-300"
            >
              <div className="card-body">
                <h3 className="text-lg font-semibold">{cert.title}</h3>
                <p className="text-sm text-gray-500">{cert.provider}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
