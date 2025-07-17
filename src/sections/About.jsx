import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaDownload,
  FaGraduationCap,
} from "react-icons/fa";
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  const shortBio = `Anindya Nag is a Lecturer in the Dept. of Computer Science & Engineering at NUBT Khulna, Bangladesh. He holds an M.Sc. in CSE from Khulna University and a B.Tech in CSE from Adamas University, India. His research includes health informatics, medical IoT, neuroscience, and machine learning.`;

  const fullBio = `He has authored/co-authored 67+ publications and co-edited 9 books. He is a reviewer for many international journals and conferences. His Master's CGPA is 3.96 and Bachelor's CGPA is 9.64. He’s fluent in English, Bangla, and has working proficiency in Hindi.`;

  const skills = [
    "Python", "C", "C++", "NumPy", "Pandas", "SciPy", "Matplotlib",
    "LaTex", "MySQL Workbench", "Google Colab", "PyCharm",
  ];

  return (
    <section
      id="about"
      className="py-24 px-6 bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white relative"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Profile Image */}
        <div
          className="w-full md:w-1/2 flex justify-center"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <img
            src="/images/aa.jpg"
            alt="Anindya Nag"
            className="w-64 h-64 sm:w-72 sm:h-72 object-cover rounded-2xl shadow-2xl border-4 border-primary"
          />
        </div>

        {/* About Text */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left" data-aos="fade-left">
          <h2 className="text-4xl font-extrabold">About Me</h2>

          <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {shortBio}
            {!isDesktop && isExpanded && (
              <>
                <br /><br />
                {fullBio}
              </>
            )}
          </p>

          <button
            onClick={toggleExpanded}
            className="text-primary underline text-sm font-medium transition hover:text-secondary"
          >
            {isExpanded ? "See Less" : "See More"}
          </button>

          {/* Contact & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
            <div className="flex items-center gap-3">
              <FaGraduationCap className="text-primary" />
              <span>Lecturer, NUBTK</span>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-primary" />
              <span>Khulna, Bangladesh</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-primary" />
              <span>anindyanag@ieee.org</span>
            </div>
            <div className="flex items-center gap-3">
              <FaDownload className="text-primary" />
              <a
                href="/cv/AnindyaNag_CV.pdf"
                download="AnindyaNag_CV.pdf"
                className="underline hover:text-primary transition"
              >
                Download CV
              </a>
            </div>
          </div>

          {/* Skills */}
          <div className="pt-6">
            <h3 className="text-xl font-semibold mb-3">Skills & Tools</h3>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {skills.map((skill, idx) => (
                <motion.span
                  key={idx}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-gray-200 dark:bg-gray-700 dark:text-white text-sm px-3 py-1 rounded-full shadow-sm cursor-pointer transition-colors duration-300 ease-in-out hover:bg-primary hover:text-white"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Full Bio Modal (only for desktop) */}
      <AnimatePresence>
        {isExpanded && isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layoutId="about-popup"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={toggleExpanded}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-base-100 rounded-2xl p-6 max-w-2xl w-full text-left space-y-6 shadow-xl overflow-auto max-h-[90vh] relative"
            >
              <button
                onClick={toggleExpanded}
                className="absolute top-3 right-3 text-xl text-gray-500 hover:text-red-500 transition"
              >
                <IoClose />
              </button>
              <h3 className="text-2xl font-bold">Full Biography</h3>
              <p className="text-base leading-relaxed dark:text-gray-300">
                {shortBio}<br /><br />{fullBio}
              </p>
              <div>
                <h4 className="text-xl font-semibold mb-3">Tech Stack & Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="bg-gray-200 dark:bg-gray-700 dark:text-white text-sm px-3 py-1 rounded-full shadow-sm cursor-pointer transition-colors duration-300 ease-in-out hover:bg-primary hover:text-white"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
