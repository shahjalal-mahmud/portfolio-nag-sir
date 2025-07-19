// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const educationData = [
  {
    title: "Master of Science in Computer Science & Engineering",
    institution: "Khulna University, Khulna - 9208, Bangladesh",
    url: "https://ku.ac.bd/",
    year: "Jan 2023 – Nov 2024",
    result: "CGPA: 3.96 (Out of 4.00)",
    courses:
      "Research Methodology & Ethics, Network Optimization, Human-Computer Interaction, Advanced Probability & Statistics, Advanced Software Engineering, Software Evaluation & Maintenance",
  },
  {
    title: "Bachelor of Technology in Computer Science & Engineering",
    institution: "Adamas University, Kolkata - 700126, India",
    url: "https://adamasuniversity.ac.in/",
    year: "Jul 2018 – Jun 2022",
    result: "CGPA: 9.64 (Out of 10)",
    courses:
      "Programming & Data Structures, Operating Systems, Computer Networks, Database Management, AI, ML, IoT, Computer Vision, Information Retrieval, and more.",
  },
  {
    title: "Higher Secondary Certificate (Science)",
    institution: "Government Brajalal College, Khulna - 9202, Bangladesh",
    url: "https://www.blcollege.edu.bd/",
    year: "May 2014 – Jul 2016",
    result: "GPA: 5.00 (Out of 5.00)",
  },
  {
    title: "Secondary School Certificate (Science)",
    institution: "Damodar M. M. Secondary School, Khulna - 9210, Bangladesh",
    url: "https://www.sohopathi.com/damodar-m-m-high-school/",
    year: "Jan 2012 – Mar 2014",
    result: "GPA: 5.00 (Out of 5.00)",
  },
];

const Education = () => {
  return (
    <section
      id="education"
      className="text-gray-900 px-6 pt-16 pb-28"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto" data-aos="fade-up" data-aos-delay="100">
        <h3 className="text-3xl lg:text-4xl font-bold text-center mb-14">Education</h3>

        <div className="relative">
          {/* Center Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 w-1 h-full bg-primary transform -translate-x-1/2"></div>

          <div className="space-y-20">
            {educationData.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col lg:flex-row items-start gap-6 lg:gap-0 ${isLeft ? "lg:justify-start" : "lg:justify-end"
                    }`}
                  data-aos={isLeft ? "fade-right" : "fade-left"}
                  data-aos-delay={idx * 100}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-2 lg:top-1/2 lg:-translate-y-1/2 z-20">
                    <div className="w-4 h-4 rounded-full bg-primary border-4 border-white"></div>
                  </div>

                  {/* Timeline Card */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`bg-white shadow-md rounded-xl p-6 w-full lg:w-[45%] z-10 ${isLeft ? "lg:mr-auto" : "lg:ml-auto"
                      }`}
                  >
                    <div className="text-sm text-primary font-semibold mb-1">
                      {item.year}
                    </div>
                    <h4 className="text-xl font-bold">{item.title}</h4>
                    <p className="text-sm mt-1 font-medium italic">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 hover:underline"
                      >
                        {item.institution}
                      </a>
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-semibold">{item.result}</span>
                    </p>
                    {item.courses && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Courses:</span>{" "}
                        {item.courses}
                      </p>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
