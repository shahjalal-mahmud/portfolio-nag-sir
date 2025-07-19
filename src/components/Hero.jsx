import {
  FaLinkedin,
  FaResearchgate,
  FaGoogle,
  FaOrcid,
  FaDatabase,
  FaBook,
  FaGithub,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Hero = () => {
  // Google Maps link to the university location
  const locationMapUrl =
    "https://maps.app.goo.gl/sr7kWTtaCYLGGRM87";

  return (
    <section
      className="text-black py-12 px-6 md:px-12 shadow-sm"
      id="hero"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Text Content */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-wide">
            ANINDYA NAG
          </h1>

          <p className="text-lg mb-3 leading-relaxed max-w-lg">
            Lecturer, Dept. of Computer Science & Engineering
            <br />
            Northern University of Business and Technology Khulna
          </p>

          <p className="text-sm mb-6 text-gray-700 max-w-lg">
            Health Informatics • Medical IoT • Neuroscience • Machine Learning
          </p>

          {/* Location & Contact */}
          <div className="text-sm text-gray-800 space-y-1 mb-6 max-w-xs">
            {/* Interactive Location */}
            <p
              className="flex items-center gap-2 cursor-pointer hover:text-blue-700 transition-colors min-w-0"
              onClick={() => window.open(locationMapUrl, "_blank")}
            >
              <FaMapMarkerAlt className="text-gray-600 flex-shrink-0" />
              Northern University of Business and Technology Khulna
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:anindyanag@ieee.org"
                className="text-blue-700 underline"
              >
                anindyanag@ieee.org
              </a>
            </p>
            <p>Mobile: +880 1795617168</p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-3 mt-4 max-w-md">
            {[{
              href: "https://www.linkedin.com/in/anindya-nag-892b19190/",
              icon: <FaLinkedin className="text-blue-700" />,
              label: "LinkedIn",
            },
            {
              href: "https://www.researchgate.net/profile/Anindya-Nag-3",
              icon: <FaResearchgate className="text-green-700" />,
              label: "ResearchGate",
            },
            {
              href: "https://scholar.google.com/citations?hl=en&user=V4OLVPAAAAAJ&view_op=list_works",
              icon: <FaGoogle className="text-red-600" />,
              label: "Google Scholar",
            },
            {
              href: "https://orcid.org/0000-0001-6518-8233",
              icon: <FaOrcid className="text-green-800" />,
              label: "ORCID",
            },
            {
              href: "https://www.scopus.com/authid/detail.uri?authorId=58398246900",
              icon: <FaDatabase className="text-gray-700" />,
              label: "Scopus",
            },
            {
              href: "https://www.webofscience.com/wos/author/record/ITT-5228-2023",
              icon: <FaBook className="text-gray-700" />,
              label: "Web of Science",
            },
            {
              href: "https://github.com/AnindyaNag",
              icon: <FaGithub className="text-black" />,
              label: "GitHub",
            }].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-gray-400 rounded-md px-4 py-2 text-sm font-medium text-black
                           hover:border-blue-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                aria-label={`Visit ${label}`}
              >
                {icon}
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Profile Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="/images/A.jpg"
            alt="Anindya Nag"
            className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-primary shadow-2xl group-hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
