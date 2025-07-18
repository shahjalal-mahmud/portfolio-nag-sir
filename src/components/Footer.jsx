import React from "react";
import {
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaInstagram,
  FaTumblr,
  FaSnapchatGhost
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGooglescholar, SiOrcid, SiResearchgate } from "react-icons/si";

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content mt-10">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8">

                    {/* Profile Overview */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Anindya Nag</h2>
                        <p className="text-sm">
                            Lecturer, Department of CSE <br />
                            Northern University of Business and Technology, Khulna
                        </p>
                        <p className="text-sm mt-1">Damodar, Phultala, Khulna-9210, Bangladesh</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-md font-semibold mb-2">Quick Links</h3>
                        <ul className="text-sm space-y-1">
                            <li><a href="#about" className="hover:underline">About</a></li>
                            <li><a href="#education" className="hover:underline">Education</a></li>
                            <li><a href="#experience" className="hover:underline">Experience</a></li>
                            <li><a href="#publications" className="hover:underline">Publications</a></li>
                            <li><a href="#projects" className="hover:underline">Projects</a></li>
                            <li><a href="#certifications" className="hover:underline">Certifications</a></li>
                        </ul>
                    </div>

                    {/* External Profiles */}
                    <div>
                        <h3 className="text-md font-semibold mb-2">Academic Profiles</h3>
                        <div className="flex flex-wrap gap-2">
                            <a href="https://www.researchgate.net/profile/Anindya-Nag-3" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
                                <SiResearchgate className="mr-1" /> ResearchGate
                            </a>
                            <a href="https://orcid.org/0000-0001-6518-8233" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
                                <SiOrcid className="mr-1" /> ORCID
                            </a>
                            <a href="https://scholar.google.com/citations?user=AnindyaNag" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
                                <SiGooglescholar className="mr-1" /> Scholar
                            </a>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div>
                        <h3 className="text-md font-semibold mb-2">Connect</h3>
                        <div className="flex flex-wrap gap-3 text-xl">
                            <a href="https://www.facebook.com/anindya.nag.005" target="_blank">
                                <FaFacebook className="hover:text-primary" />
                            </a>
                            <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fanindya__nag%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExMlFvQ3VPWkhYRVQyaXNtcQEeUKadgZAHN0LRD2zWTlKrffYugf84qvaJZWP_mAe_-NTcdDgk1zc4LfWtwvI_aem_frMuqxRDv4EzSzoHx8wBbA&h=AT0FZBIlJLiL-3XiykFaMrACLZCvceotlUqfXexYQs01pgDZklcwkvchx8nhQ9dSavYzhmUMqpYigoO7w-KsDrPCE0WGn7q63YjKSBodnIkruTH9ahW62vuJcyQr4ULacX5P" target="_blank">
                                <FaInstagram className="hover:text-pink-500" />
                            </a>
                            <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Flinkedin.com%2Fin%2Fanindya-nag-892b19190%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExMlFvQ3VPWkhYRVQyaXNtcQEewX4D1URdMSWerVDq7YimdueG9yCKlye8gaUSfvxClpcEy5rGtihZk98U8P8_aem_Ml_3acXMIY8R7CtkL9G-uw&h=AT2-rrHTVkeZuhXmj8wN7levuLrtSI_A8AKY9rkIIjxUPe0pmkTaQX1ygkuz4dEtmo_oOFd1sA_V6YT6hLARVo_DRraqpXwp5l_-qe_lt09VXfEXQb8cJaV1U6Q1IoWwC2LM" target="_blank">
                                <FaLinkedin className="hover:text-blue-600" />
                            </a>
                            <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fx.com%2FAnindyaNag1%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExMlFvQ3VPWkhYRVQyaXNtcQEeU91WiPEBpbWwDNiDGgH6y0_eZaCRkPpTMZikEC3uvNXJSLrAiXXZsY77V4o_aem_Ktj8o-IqcRv7ySCDutcIuQ&h=AT1UCG-JwHWAnKjx032tDs23fVxS7sP7X4b0V13dETlwwy0BINUmpLwvn8jtmrWNcZwiX8rWoZfQumNdc_tJHse55nrLtAYAMdzBCogxGuzp4qDiQWEP9hGoDHGwGPDYHrY8" target="_blank">
                                <FaXTwitter className="hover:text-sky-500" />
                            </a>
                            <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fanindyanag.tumblr.com%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExMlFvQ3VPWkhYRVQyaXNtcQEePwCnckMJ0fIIA_dV7NRBGs-iv1tIT10UkdPFCXh04VIyU-nMOS50CWVwu70_aem_OsDHUYgbACfXHtFCxoRq_Q&h=AT1krS9Pl8eOtwnUbSdhgve2ieu_NiGVfYBvxf8J0G_ciffVvawWKOJfr6qTDBaJ_vBnIRVeQEgI2T1uIWZegvr5F5L-CFaccOSHEYZMODF6qtpfpXHf66Jbuy3Ik48fsRpI" target="_blank">
                                <FaTumblr className="hover:text-purple-500" />
                            </a>
                            <a href="https://www.snapchat.com/explore/anindyanag20" target="_blank">
                                <FaSnapchatGhost className="hover:text-yellow-400" />
                            </a>
                            <a href="https://github.com/AnindyaNag" target="_blank">
                                <FaGithub className="hover:text-gray-600" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="divider mt-8" />

                {/* Footer Bottom */}
                <div className="text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Anindya Nag. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
