import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaFacebook,
  FaInstagram,
  FaTumblr,
  FaSnapchatGhost
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGooglescholar, SiOrcid, SiResearchgate, SiScopus, SiClarivate } from "react-icons/si";
import useHeroData from '../../hooks/useHeroData';
import LoadingAnimation from '../components/LoadingAnimation';

const Contact = () => {
  const { heroData, loading } = useHeroData();

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!heroData) {
    return <div className="text-center py-12 text-gray-500">No contact information available</div>;
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            For academic collaborations, research inquiries, or professional connections
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>

            <div className="space-y-5">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaEnvelope className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                  <a href={`mailto:${heroData.email}`} className="text-blue-600 hover:underline">
                    {heroData.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaPhone className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                  <p>{heroData.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <FaMapMarkerAlt className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                  <a
                    href={heroData.location.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 hover:underline"
                  >
                    {heroData.location.text}
                  </a>
                </div>
              </div>
              {/* Find the portfolio link from socialLinks if it exists */}
              {heroData.socialLinks?.find(link => link.label === "Personal Portfolio") && (
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                    <FaGlobe className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Portfolio</h4>
                    <a
                      href={heroData.socialLinks.find(link => link.label === "Personal Portfolio").href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium"
                    >
                      {heroData.socialLinks.find(link => link.label === "Personal Portfolio").href.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Academic Profiles */}
            <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Academic Profiles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://www.researchgate.net/profile/Anindya-Nag-3"
                target="_blank"
                className="flex items-center px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <SiResearchgate className="text-green-600 text-xl mr-3" />
                <span className="truncate">ResearchGate</span>
              </a>
              <a
                href="https://orcid.org/0000-0001-6518-8233"
                target="_blank"
                className="flex items-center px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <SiOrcid className="text-green-700 text-xl mr-3" />
                <span className="truncate">ORCID</span>
              </a>
              <a
                href="https://scholar.google.com/citations?hl=en&user=V4OLVPAAAAAJ&view_op=list_works"
                target="_blank"
                className="flex items-center px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <SiGooglescholar className="text-blue-500 text-xl mr-3" />
                <span className="truncate">Google Scholar</span>
              </a>
              <a
                href="https://www.scopus.com/authid/detail.uri?authorId=58398246900"
                target="_blank"
                className="flex items-center px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <SiScopus className="text-red-500 text-xl mr-3" />
                <span className="truncate">Scopus</span>
              </a>
              <a
                href="https://www.webofscience.com/wos/author/record/ITT-5228-2023"
                target="_blank"
                className="flex items-center px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <SiClarivate className="text-red-700 text-xl mr-3" />
                <span className="truncate">Web of Science</span>
              </a>
              <a
                href="https://nubtkhulna.ac.bd/sd/273/Anindya%20Nag"
                target="_blank"
                className="flex items-center px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <FaGlobe className="text-indigo-600 text-xl mr-3" />
                <span className="truncate">Official Website</span>
              </a>
            </div>
          </div>

          {/* Social Media & Message */}
          <div>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Social Media</h3>
              <div className="flex flex-wrap gap-4">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/anindya.nag.005"
                  target="_blank"
                  className="w-12 h-12 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <FaFacebook className="text-blue-600 text-xl" />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/anindya__nag"
                  target="_blank"
                  className="w-12 h-12 flex items-center justify-center bg-pink-50 hover:bg-pink-100 rounded-full transition-colors"
                >
                  <FaInstagram className="text-pink-600 text-xl" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/anindya-nag-892b19190/"
                  target="_blank"
                  className="w-12 h-12 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <FaLinkedin className="text-blue-600 text-xl" />
                </a>

                {/* Twitter/X */}
                <a
                  href="https://x.com/AnindyaNag1"
                  target="_blank"
                  className="w-12 h-12 flex items-center justify-center bg-black hover:bg-gray-800 rounded-full transition-colors"
                >
                  <FaXTwitter className="text-white text-xl" />
                </a>

                {/* Tumblr */}
                <a
                  href="https://anindyanag.tumblr.com"
                  target="_blank"
                  className="w-12 h-12 flex items-center justify-center bg-purple-50 hover:bg-purple-100 rounded-full transition-colors"
                >
                  <FaTumblr className="text-purple-600 text-xl" />
                </a>

                {/* Snapchat */}
                <a
                  href="https://www.snapchat.com/explore/anindyanag20"
                  target="_blank"
                  className="w-12 h-12 flex items-center justify-center bg-yellow-50 hover:bg-yellow-100 rounded-full transition-colors"
                >
                  <FaSnapchatGhost className="text-yellow-500 text-xl" />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/AnindyaNag"
                  target="_blank"
                  className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <FaGithub className="text-gray-800 text-xl" />
                </a>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Collaboration Inquiry</h3>
              <p className="text-gray-700 mb-6">
                For academic collaboration, publication inquiries, or supervision requests,
                please don't hesitate to reach out.
              </p>
              <a
                href="mailto:anindyanag@ieee.org"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <FaEnvelope className="mr-2" />
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;