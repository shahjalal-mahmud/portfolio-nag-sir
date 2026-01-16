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
    return (
      <div className="flex justify-center items-center py-20">
        <div className="alert alert-warning max-w-md">
          <span>No contact information available</span>
        </div>
      </div>
    );
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100 text-base-content transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 relative inline-block text-primary">
            Get In Touch
          </h2>
          <p className="text-lg opacity-70 max-w-3xl mx-auto">
            For academic collaborations, research inquiries, or professional connections
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information Card */}
          <div className="card bg-base-200 border border-base-300 shadow-sm">
            <div className="card-body p-8">
              <h3 className="card-title text-2xl font-bold mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <FaEnvelope size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1">Email</h4>
                    <a href={`mailto:${heroData.email}`} className="link link-primary font-medium text-lg">
                      {heroData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <FaPhone size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1">Phone</h4>
                    <p className="text-lg">{heroData.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1">Location</h4>
                    <a
                      href={heroData.location.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-hover font-medium text-lg"
                    >
                      {heroData.location.text}
                    </a>
                  </div>
                </div>

                {heroData.socialLinks?.find(link => link.label === "Personal Portfolio") && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <FaGlobe size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1">Portfolio</h4>
                      <a
                        href={heroData.socialLinks.find(link => link.label === "Personal Portfolio").href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-hover font-medium text-lg"
                      >
                        {heroData.socialLinks.find(link => link.label === "Personal Portfolio").href.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Academic Profiles Grid */}
              <h3 className="text-xl font-bold mt-10 mb-4 border-t border-base-300 pt-8">Academic Profiles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href="https://www.researchgate.net/profile/Anindya-Nag-3" target="_blank" className="btn btn-outline btn-sm h-12 justify-start gap-3 normal-case border-base-300">
                  <SiResearchgate className="text-green-600 text-xl" /> ResearchGate
                </a>
                <a href="https://orcid.org/0000-0001-6518-8233" target="_blank" className="btn btn-outline btn-sm h-12 justify-start gap-3 normal-case border-base-300">
                  <SiOrcid className="text-green-700 text-xl" /> ORCID
                </a>
                <a href="https://scholar.google.com/citations?hl=en&user=V4OLVPAAAAAJ&view_op=list_works" target="_blank" className="btn btn-outline btn-sm h-12 justify-start gap-3 normal-case border-base-300">
                  <SiGooglescholar className="text-blue-500 text-xl" /> Google Scholar
                </a>
                <a href="https://www.scopus.com/authid/detail.uri?authorId=58398246900" target="_blank" className="btn btn-outline btn-sm h-12 justify-start gap-3 normal-case border-base-300">
                  <SiScopus className="text-red-500 text-xl" /> Scopus
                </a>
                <a href="https://www.webofscience.com/wos/author/record/ITT-5228-2023" target="_blank" className="btn btn-outline btn-sm h-12 justify-start gap-3 normal-case border-base-300">
                  <SiClarivate className="text-red-700 text-xl" /> Web of Science
                </a>
                <a href="https://nubtkhulna.ac.bd/sd/273/Anindya%20Nag" target="_blank" className="btn btn-outline btn-sm h-12 justify-start gap-3 normal-case border-base-300">
                  <FaGlobe className="text-indigo-600 text-xl" /> NUBTK Profile
                </a>
              </div>
            </div>
          </div>

          {/* Social Media & Message Column */}
          <div className="flex flex-col gap-8">
            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-2xl font-bold mb-6">Social Media</h3>
                <div className="flex flex-wrap gap-4">
                  <a href="https://www.facebook.com/anindya.nag.005" target="_blank" className="btn btn-circle btn-ghost bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20">
                    <FaFacebook className="text-blue-600 text-2xl" />
                  </a>
                  <a href="https://www.instagram.com/anindya__nag" target="_blank" className="btn btn-circle btn-ghost bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20">
                    <FaInstagram className="text-pink-600 text-2xl" />
                  </a>
                  <a href="https://www.linkedin.com/in/anindya-nag-892b19190/" target="_blank" className="btn btn-circle btn-ghost bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20">
                    <FaLinkedin className="text-blue-600 text-2xl" />
                  </a>
                  <a href="https://x.com/AnindyaNag1" target="_blank" className="btn btn-circle bg-neutral text-neutral-content hover:bg-neutral-focus">
                    <FaXTwitter className="text-xl" />
                  </a>
                  <a href="https://anindyanag.tumblr.com" target="_blank" className="btn btn-circle btn-ghost bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20">
                    <FaTumblr className="text-purple-600 text-xl" />
                  </a>
                  <a href="https://www.snapchat.com/explore/anindyanag20" target="_blank" className="btn btn-circle btn-ghost bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20">
                    <FaSnapchatGhost className="text-yellow-600 text-xl" />
                  </a>
                  <a href="https://github.com/AnindyaNag" target="_blank" className="btn btn-circle btn-ghost bg-base-300">
                    <FaGithub className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-2xl font-bold mb-2">Collaboration Inquiry</h3>
                <p className="opacity-90 mb-6">
                  For academic collaboration, publication inquiries, or supervision requests,
                  please don't hesitate to reach out.
                </p>
                <div className="card-actions justify-start">
                  <a
                    href="mailto:anindyanag@ieee.org"
                    className="btn bg-primary no-animation"
                  >
                    <FaEnvelope className="mr-2" />
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;