import React from "react";
import { FaUniversity } from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";

const Experience = () => {
  const experiences = [
    {
      title: "Lecturer",
      university:
        "Northern University of Business & Technology Khulna, Khulna-9100, Bangladesh",
      period: "March 2024 – Ongoing",
      department: "Department of Computer Science and Engineering",
      courses: [
        "Object Oriented Programming I",
        "Pattern Recognition",
        "Digital Logic Design",
        "and more",
      ],
    },
    {
      title: "Adjunct Lecturer",
      university: "North Western University, Khulna-9100, Bangladesh",
      period: "January 2023 – February 2024",
      department: "Department of Computer Science and Engineering",
      courses: [
        "Computer Programming",
        "Numerical Analysis",
        "Digital Logic Design",
        "Artificial Intelligence",
        "and more",
      ],
    },
  ];

  return (
    <section id="experience" className="py-12 px-4 lg:px-16 bg-base-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">
          <MdWorkOutline className="inline-block text-primary mr-2" />
          Work Experience
        </h2>

        <div className="space-y-8">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="bg-base-200 shadow-md rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-2 flex items-center justify-between flex-wrap gap-y-2">
                <h3 className="text-xl font-semibold text-primary">
                  {exp.title}
                </h3>
                <span className="text-sm font-medium text-gray-100">
                  {exp.period}
                </span>
              </div>

              <p className="text-gray-50 mb-1">
                <FaUniversity className="inline-block mr-2 text-secondary" />
                <span className="font-medium">{exp.department}</span>
              </p>

              <p className="text-gray-200 italic">{exp.university}</p>

              <div className="mt-3">
                <p className="font-medium text-gray-300 mb-1">
                  Courses Conducted:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  {exp.courses.map((course, i) => (
                    <li key={i}>{course}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
