import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

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
    <section id="projects" className="py-16 px-4 md:px-10 bg-white dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-neutral-900 dark:text-white">
          Projects
        </h2>
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border border-neutral-300 dark:border-neutral-700 p-6 rounded-2xl hover:shadow-lg transition duration-300 bg-neutral-50 dark:bg-neutral-800"
            >
              <div className="flex justify-between items-start flex-wrap gap-y-2">
                <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                  {project.title}
                </h3>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">{project.date}</span>
              </div>
              <p className="mt-2 text-neutral-700 dark:text-neutral-300 text-sm">
                {project.description}
              </p>
              <div className="flex gap-4 mt-4 text-sm">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <FaGithub className="text-base" />
                    GitHub
                  </a>
                )}
                {project.external && (
                  <a
                    href={project.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <FaExternalLinkAlt className="text-xs" />
                    Live Demo / Article
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
