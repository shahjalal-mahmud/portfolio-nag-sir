import React from "react";
import {
    FaLinkedin,
    FaGithub,
    FaFacebook,
    FaInstagram,
    FaTumblr,
    FaSnapchatGhost,
    FaUniversity,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiClarivate, SiGooglescholar, SiOrcid, SiResearchgate, SiScopus } from "react-icons/si";
import useHeroData from '../../hooks/useHeroData';
import LoadingAnimation from './LoadingAnimation';

const Footer = () => {
    const { heroData, loading, error } = useHeroData();

    if (loading) return <LoadingAnimation />;

    if (error) {
        return <div className="text-center py-12 text-red-500 font-medium">Error loading footer data</div>;
    }

    if (!heroData) {
        return <div className="text-center py-12 text-gray-500">No footer data available</div>;
    }

    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

                    {/* Profile Overview */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-600 p-2.5 rounded-lg shadow-md mr-3">
                                    <FaUniversity className="text-white text-xl" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                    {heroData.name}
                                </h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed max-w-sm">
                                Dedicated to advancing research and education through innovation and collaboration.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Location */}
                            <div className="flex items-start group">
                                <FaMapMarkerAlt className="text-blue-600 mt-1 mr-4 transition-transform group-hover:scale-110" />
                                <a
                                    href={heroData.location.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-700 transition-colors"
                                >
                                    {heroData.location.text}
                                </a>
                            </div>

                            {/* Dynamic Email Section */}
                            <div className="flex items-start group">
                                <FaEnvelope className="text-blue-600 mt-1 mr-4 transition-transform group-hover:scale-110" />
                                <div className="flex flex-col space-y-2">
                                    {Array.isArray(heroData.email) ? (
                                        heroData.email.map((email, idx) => (
                                            <a
                                                key={idx}
                                                href={`mailto:${email}`}
                                                className="text-gray-600 hover:text-blue-700 transition-colors break-all"
                                            >
                                                {email}
                                            </a>
                                        ))
                                    ) : (
                                        <a
                                            href={`mailto:${heroData.email}`}
                                            className="text-gray-600 hover:text-blue-700 transition-colors break-all"
                                        >
                                            {heroData.email}
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center group">
                                <FaPhone className="text-blue-600 mr-4 transition-transform group-hover:scale-110" />
                                <span className="text-gray-600">{heroData.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Academic Profiles */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Academic Portals</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            {[
                                { icon: SiResearchgate, label: "ResearchGate", color: "text-green-600", url: "https://www.researchgate.net/profile/Anindya-Nag-3" },
                                { icon: SiOrcid, label: "ORCID", color: "text-green-700", url: "https://orcid.org/0000-0001-6518-8233" },
                                { icon: SiGooglescholar, label: "Google Scholar", color: "text-blue-500", url: "https://scholar.google.com/citations?hl=en&user=V4OLVPAAAAAJ&view_op=list_works" },
                                { icon: SiScopus, label: "Scopus", color: "text-red-500", url: "https://www.scopus.com/authid/detail.uri?authorId=58398246900" },
                                { icon: SiClarivate, label: "Web of Science", color: "text-red-700", url: "https://www.webofscience.com/wos/author/record/ITT-5228-2023" }
                            ].map((profile, index) => (
                                <a
                                    key={index}
                                    href={profile.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center px-4 py-2.5 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm rounded-xl transition-all group"
                                >
                                    <profile.icon className={`${profile.color} text-xl mr-3 group-hover:scale-110 transition-transform`} />
                                    <span className="text-gray-700 font-medium group-hover:text-blue-700">{profile.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Social Media & Connect */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Social Connectivity</h3>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { icon: FaLinkedin, color: "bg-[#0077b5]", url: "https://www.linkedin.com/in/anindya-nag-892b19190/" },
                                { icon: FaGithub, color: "bg-[#24292e]", url: "https://github.com/AnindyaNag" },
                                { icon: FaXTwitter, color: "bg-black", url: "https://x.com/AnindyaNag1" },
                                { icon: FaFacebook, color: "bg-[#1877f2]", url: "https://www.facebook.com/anindya.nag.005" },
                                { icon: FaInstagram, color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]", url: "https://www.instagram.com/anindya__nag" },
                                { icon: FaTumblr, color: "bg-[#35465c]", url: "https://anindyanag.tumblr.com" },
                                { icon: FaSnapchatGhost, color: "bg-[#fffc00] text-black", url: "https://www.snapchat.com/explore/anindyanag20" },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`w-11 h-11 flex items-center justify-center rounded-full text-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all ${social.color}`}
                                >
                                    <social.icon className="text-xl" />
                                </a>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <p className="text-sm text-blue-800 font-medium">
                                Interested in collaborating? Feel free to reach out via any of these platforms.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                        <p className="font-medium">
                            © {new Date().getFullYear()} {heroData.name}. All rights reserved.
                        </p>
                        <p>
                            Designed & Developed by{" "}
                            <a
                                href="https://shahajalalmahmud.netlify.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Shahajalal Mahmud
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;