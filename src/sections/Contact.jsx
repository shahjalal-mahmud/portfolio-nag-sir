import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaInstagram,
  FaTumblr,
  FaSnapchatGhost,
  FaGlobe,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGooglescholar, SiOrcid, SiResearchgate, SiScopus } from "react-icons/si";

const Contact = () => {
  return (
    <section id="contact" className="bg-base-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Contact</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left - Personal Info */}
          <div className="space-y-4">
            <p className="text-lg font-medium">Anindya Nag</p>

            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-primary" />
              <a href="mailto:anindyanag@ieee.org" className="hover:underline">
                anindyanag@ieee.org
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <FaPhone className="text-primary" />
              <span>+880 1795617168</span>
            </div>

            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-primary" />
              <span>Damodar, Phultala, Damodar-9210, Khulna, Bangladesh</span>
            </div>

            <div className="flex items-center space-x-3">
              <FaGlobe className="text-primary" />
              <span>Portfolio: <span className="font-medium">anindyanag</span></span>
            </div>

            {/* Profile Link Badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="https://www.researchgate.net/profile/Anindya-Nag-3"
                target="_blank"
                className="btn btn-sm btn-outline btn-primary"
              >
                <SiResearchgate className="mr-2" /> ResearchGate
              </a>
              <a
                href="https://orcid.org/0000-0001-6518-8233"
                target="_blank"
                className="btn btn-sm btn-outline btn-accent"
              >
                <SiOrcid className="mr-2" /> ORCID
              </a>
              <a
                href="https://scholar.google.com/citations?user=AnindyaNag"
                target="_blank"
                className="btn btn-sm btn-outline btn-secondary"
              >
                <SiGooglescholar className="mr-2" /> Google Scholar
              </a>
              <a
                href="https://www.scopus.com/authid/detail.uri?authorId=58398246900"
                target="_blank"
                className="btn btn-sm btn-outline btn-info"
              >
                <SiScopus className="mr-2" /> Scopus ID
              </a>
            </div>
          </div>

          {/* Right - Social and Message */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect on Social Media</h3>

            <div className="flex flex-wrap gap-4 text-2xl">
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

            {/* Message or Call-to-Action */}
            <div className="mt-10">
              <p className="text-base leading-relaxed">
                For academic collaboration, publication inquiries, or supervision requests,
                feel free to reach out via email or connect on professional platforms.
              </p>
              <a
                href="mailto:anindyanag@ieee.org"
                className="mt-4 inline-block btn btn-primary btn-sm"
              >
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
