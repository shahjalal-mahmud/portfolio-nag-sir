import { FaGithub, FaExternalLinkAlt, FaRegCalendarAlt } from "react-icons/fa";

const projects = [
  {
    title: "Cloud-Based Vehicle Tracking System",
    date: "March 2022 - June 2022",
    description: `Developed an RFID-based parking management system that records vehicle in-time and out-time, provides instant access to car and owner details, supports multiple gate monitoring, and allows easy vehicle tracking through a centralized website.`,
    github: "https://github.com/AnindyaNag/Project_2_Vehicle-Tracking-Management-System",
  },
  {
    title: "Foodazon: Canteen Management System",
    date: "August 2021 - November 2021",
    description: `Developed a canteen management system using Laravel and MySQL to efficiently manage and store records, meeting all operational objectives and expectations.`,
  },
  {
    title: "Analyze Crop Production of India",
    date: "July 2021 - September 2021",
    description: `As an Intern at Spotle.ai through the NASSCOM Community AI Internship, I analyzed crop production in India, developed a model to predict rice yields, and published an article on “AI in Agriculture: An Emerging Era in Technology” in the NASSCOM Community.`,
    github: "https://github.com/AnindyaNag/Project---Analyze-Crop-Production-of-India",
    external: "https://community.nasscom.in/communities/agritech/ai-agriculture-emerging-era-technology",
  },
  {
    title: "Basic Banking System",
    date: "March 2021 - June 2021",
    description: `As a Web Development & Designing Intern at The Sparks Foundation (GRIP), I developed and hosted a Basic Banking System website using HTML, CSS, and JavaScript, showcasing account-to-account money transfers.`,
    github: "https://github.com/AnindyaNag/Basic-Banking-System",
    external: "https://anindyanag.github.io/Basic-Banking-System/",
  },
  {
    title: "Data Science and Business Analytics",
    date: "January 2021 - March 2021",
    description: `As a Data Science & Business Analytics Intern at The Sparks Foundation (GRIP), I developed supervised and unsupervised ML models and conducted exploratory data analysis to optimize retail business strategies.`,
    github: "https://github.com/AnindyaNag/The-Sparks-Foundation-Data-Science-and-Business-Analytics-Internship-Tasks",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A selection of my technical implementations and solutions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <FaRegCalendarAlt className="mr-2 text-blue-500" />
                    <span className="text-sm">{project.date}</span>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors duration-200"
                  >
                    <FaGithub className="mr-2" />
                    View Code
                  </a>
                )}
                {project.external && (
                  <a
                    href={project.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors duration-200"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    {project.external.includes('github.io') ? 'Live Demo' : 'View Article'}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;