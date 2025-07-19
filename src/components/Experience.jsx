import React from "react";
import { FaUniversity } from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";

const Experience = () => {
  const experiences = [
    {
      title: "Lecturer",
      university: {
        name: "Northern University of Business & Technology Khulna, Khulna-9100, Bangladesh",
        url: "https://nubtkhulna.ac.bd/"
      },
      period: "March 2024 – Ongoing",
      department: "Department of Computer Science and Engineering",
      courses: [
        "Artificial Intelligence and Expert systems",
        "Pattern Recognition",
        "Numerical Methods",
        "Computer Graphics and Multimedia System",
        "Digital Logic Design and more",
      ],
    },
    {
      title: "Adjunct Lecturer",
      university: {
        name: "North Western University, Khulna-9100, Bangladesh",
        url: "https://nwu.ac.bd/"
      },
      period: "January 2023 – February 2024",
      department: "Department of Computer Science and Engineering",
      courses: [
        "Computer Programming",
        "Numerical Analysis",
        "Digital Logic Design",
        "Artificial Intelligence and more",
      ],
    },
  ];

  return (
    <section id="experience" className="py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            <MdWorkOutline className="inline-block text-blue-600 mr-3 align-middle" />
            Work Experience
          </h2>
        </div>
        <div className="relative">
          {/* Timeline bar */}
          <div className="hidden md:block absolute left-8 top-0 h-full w-1 bg-gray-200"></div>

          <div className="space-y-10">
            {experiences.map((exp, idx) => (
              <div key={idx} className="relative">
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-8 transform -translate-x-1/2 -translate-y-1/2 top-12 w-5 h-5 rounded-full bg-blue-600 border-4 border-white z-10"></div>

                <div className="bg-white md:ml-24 p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-blue-600 font-medium mb-2">
                        <FaUniversity className="inline-block mr-2" />
                        {exp.department}
                      </p>
                      <p className="text-gray-500 italic">
                        <a
                          href={exp.university.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 hover:underline"
                        >
                          {exp.university.name}
                        </a>
                      </p>
                    </div>
                    <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg font-medium">
                      {exp.period}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200">
                      Courses Conducted
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {exp.courses.map((course, i) => (
                        <div key={i} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <span className="text-gray-700">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;