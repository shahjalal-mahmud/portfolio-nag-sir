import React from "react";

const skillsData = [
  {
    title: "Languages",
    content: "English (Full Professional Proficiency), Bangla (Native), Hindi (Limited Working Proficiency)",
    icon: "🌐",
  },
  {
    title: "Programming",
    content: "Python (NumPy, SciPy, Matplotlib, Pandas), C, C++",
    icon: "💻",
  },
  {
    title: "Platforms",
    content: "Visual Studio, Google Collab, Anaconda, PyCharm, Web, Windows, Arduino",
    icon: "🖥️",
  },
  {
    title: "Tools",
    content: "MySQL Workbench",
    icon: "🛠️",
  },
  {
    title: "Document Creation",
    content: "Microsoft Office Suite, LaTeX",
    icon: "📄",
  },
  {
    title: "Soft Skills",
    content: "Teamwork, Leadership, Communication, Project Management, Writing, Time Management",
    icon: "🤝",
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Professional Skills
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A comprehensive set of technical and interpersonal competencies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((skill, index) => (
            <div
              key={index}
              className="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
              
              <div className="flex items-start space-x-4">
                <span className="text-3xl mt-1">{skill.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{skill.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{skill.content}</p>
                </div>
              </div>
              
              <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-16 h-16 text-blue-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;