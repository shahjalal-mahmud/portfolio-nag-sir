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

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Profile Overview */}
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <FaUniversity className="text-blue-600 text-lg" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Anindya Nag</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start">
                                <FaMapMarkerAlt className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                                <p className="text-gray-600">
                                    Lecturer, Department of CSE<br />
                                    Northern University of Business and Technology<br />
                                    Khulna-9210, Bangladesh
                                </p>
                            </div>

                            <div className="flex items-center">
                                <FaEnvelope className="text-gray-500 mr-3" />
                                <a href="mailto:anindyanag@ieee.org" className="text-blue-600 hover:underline">
                                    anindyanag@ieee.org
                                </a>
                            </div>

                            <div className="flex items-center">
                                <FaPhone className="text-gray-500 mr-3" />
                                <span className="text-gray-600">+880 1795617168</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {['About', 'Education', 'Experience', 'Publications', 'Projects', 'Certifications'].map((item) => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Academic Profiles */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Academic Profiles</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <a
                                href="https://www.researchgate.net/profile/Anindya-Nag-3"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <SiResearchgate className="text-green-600 text-xl mr-3" />
                                <span className="text-gray-700">ResearchGate</span>
                            </a>
                            <a
                                href="https://orcid.org/0000-0001-6518-8233"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <SiOrcid className="text-green-700 text-xl mr-3" />
                                <span className="text-gray-700">ORCID</span>
                            </a>
                            <a
                                href="https://scholar.google.com/citations?hl=en&user=V4OLVPAAAAAJ&view_op=list_works"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <SiGooglescholar className="text-blue-500 text-xl mr-3" />
                                <span className="text-gray-700">Google Scholar</span>
                            </a>
                            <a
                                href="https://www.scopus.com/authid/detail.uri?authorId=58398246900"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <SiScopus className="text-red-500 text-xl mr-3" />
                                <span className="text-gray-700">Scopus</span>
                            </a>
                            <a
                                href="https://www.webofscience.com/wos/author/record/ITT-5228-2023"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <SiClarivate className="text-red-700 text-xl mr-3" />
                                <span className="text-gray-700">Web of Science</span>
                            </a>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Connect With Me</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Facebook */}
                            <a
                                href="https://www.facebook.com/anindya.nag.005"
                                target="_blank"
                                rel="noreferrer"
                                className="w-12 h-12 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                            >
                                <FaFacebook className="text-blue-600 text-lg" />
                            </a>

                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/anindya__nag"
                                target="_blank"
                                rel="noreferrer"
                                className="w-12 h-12 flex items-center justify-center bg-pink-50 hover:bg-pink-100 rounded-full transition-colors"
                            >
                                <FaInstagram className="text-pink-600 text-lg" />
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="https://www.linkedin.com/in/anindya-nag-892b19190/"
                                target="_blank"
                                rel="noreferrer"
                                className="w-12 h-12 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                            >
                                <FaLinkedin className="text-blue-600 text-lg" />
                            </a>

                            {/* Twitter/X */}
                            <a
                                href="https://x.com/AnindyaNag1"
                                target="_blank"
                                rel="noreferrer"
                                className="w-12 h-12 flex items-center justify-center bg-black hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <FaXTwitter className="text-white text-lg" />
                            </a>

                            {/* Tumblr */}
                            <a
                                href="https://anindyanag.tumblr.com"
                                target="_blank"
                                rel="noreferrer"
                                className="w-12 h-12 flex items-center justify-center bg-purple-50 hover:bg-purple-100 rounded-full transition-colors"
                            >
                                <FaTumblr className="text-purple-600 text-lg" />
                            </a>

                            {/* Snapchat */}
                            <a
                                href="https://www.snapchat.com/explore/anindyanag20"
                                target="_blank"
                                rel="noreferrer"
                                className="w-12 h-12 flex items-center justify-center bg-yellow-50 hover:bg-yellow-100 rounded-full transition-colors"
                            >
                                <FaSnapchatGhost className="text-yellow-500 text-lg" />
                            </a>

                            {/* GitHub */}
                            <a
                                href="https://github.com/AnindyaNag"
                                target="_blank"
                                rel="noreferrer"
                                className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <FaGithub className="text-gray-800 text-lg" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Anindya Nag. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;