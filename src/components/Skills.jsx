import React from "react";

const skillsData = [
  {
    title: "Languages",
    content: "English (Full Professional Proficiency), Bangla (Native), Hindi (Limited Working Proficiency)",
  },
  {
    title: "Programming",
    content: "Python (NumPy, SciPy, Matplotlib, Pandas), C, C++",
  },
  {
    title: "Platforms",
    content: "Visual Studio, Google Collab, Anaconda, PyCharm, Web, Windows, Arduino",
  },
  {
    title: "Tools",
    content: "MySQL Workbench",
  },
  {
    title: "Document Creation",
    content: "Microsoft Office Suite, LaTeX",
  },
  {
    title: "Soft Skills",
    content: "Teamwork, Leadership, Communication, Project Management, Writing, Time Management",
  },
];

const Skills = () => {
  return (
    <section
      id="skills"
      className="py-20 px-6 md:px-12 bg-gradient-to-b from-white to-gray-100 dark:from-[#0d1117] dark:to-[#0c0f14]"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillsData.map((skill, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#161b22] p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold text-primary mb-2 dark:text-white">
                {skill.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{skill.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
