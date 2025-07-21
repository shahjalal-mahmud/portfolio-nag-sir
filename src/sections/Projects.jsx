import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaRegCalendarAlt, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';

const Projects = () => {
  const { user } = useAuth();
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    date: '',
    description: '',
    links: []
  });

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const docRef = doc(db, "portfolio", "projects");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProjectsData(docSnap.data().items || []);
        } else {
          // Fallback data if document doesn't exist
          const fallbackData = [
            {
              title: "Cloud-Based Vehicle Tracking System",
              date: "March 2022 - June 2022",
              description: "Developed an RFID-based parking management system that records vehicle in-time and out-time, provides instant access to car and owner details, supports multiple gate monitoring, and allows easy vehicle tracking through a centralized website.",
              links: [
                { name: "GitHub", url: "https://github.com/AnindyaNag/Project_2_Vehicle-Tracking-Management-System" }
              ]
            },
            {
              title: "Foodazon: Canteen Management System",
              date: "August 2021 - November 2021",
              description: "Developed a canteen management system using Laravel and MySQL to efficiently manage and store records, meeting all operational objectives and expectations."
            },
            {
              title: "Analyze Crop Production of India",
              date: "July 2021 - September 2021",
              description: "As an Intern at Spotle.ai through the NASSCOM Community AI Internship, I analyzed crop production in India, developed a model to predict rice yields, and published an article on 'AI in Agriculture: An Emerging Era in Technology' in the NASSCOM Community.",
              links: [
                { name: "GitHub", url: "https://github.com/AnindyaNag/Project---Analyze-Crop-Production-of-India" },
                { name: "Article", url: "https://community.nasscom.in/communities/agritech/ai-agriculture-emerging-era-technology" }
              ]
            },
            {
              title: "Basic Banking System",
              date: "March 2021 - June 2021",
              description: "As a Web Development & Designing Intern at The Sparks Foundation (GRIP), I developed and hosted a Basic Banking System website using HTML, CSS, and JavaScript, showcasing account-to-account money transfers.",
              links: [
                { name: "GitHub", url: "https://github.com/AnindyaNag/Basic-Banking-System" },
                { name: "Live Demo", url: "https://anindyanag.github.io/Basic-Banking-System/" }
              ]
            },
            {
              title: "Data Science and Business Analytics",
              date: "January 2021 - March 2021",
              description: "As a Data Science & Business Analytics Intern at The Sparks Foundation (GRIP), I developed supervised and unsupervised ML models and conducted exploratory data analysis to optimize retail business strategies.",
              links: [
                { name: "GitHub", url: "https://github.com/AnindyaNag/The-Sparks-Foundation-Data-Science-and-Business-Analytics-Internship-Tasks" }
              ]
            }
          ];
          setProjectsData(fallbackData);
        }
      } catch (error) {
        console.error("Error fetching projects data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.date || !newProject.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "projects");
      // Get current data first
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        // If editing, replace the item at editingIndex
        updatedData = [...currentData];
        updatedData[editingIndex] = newProject;
      } else {
        // If adding new, prepend the new item
        updatedData = [newProject, ...currentData];
      }

      // Update the document with the new array
      await updateDoc(docRef, {
        items: updatedData
      });

      // Update local state
      setProjectsData(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewProject({
        title: '',
        date: '',
        description: '',
        links: []
      });
    } catch (error) {
      console.error("Error adding/updating project:", error);
    }
  };

  const handleDeleteProject = async (index) => {
    try {
      const docRef = doc(db, "portfolio", "projects");
      await updateDoc(docRef, {
        items: arrayRemove(projectsData[index])
      });

      setProjectsData(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleEditProject = (index) => {
    setNewProject(projectsData[index]);
    setEditingIndex(index);
    setShowAddModal(true);
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...newProject.links];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };
    setNewProject({ ...newProject, links: updatedLinks });
  };

  const addLinkField = () => {
    setNewProject({ ...newProject, links: [...newProject.links, { name: '', url: '' }] });
  };

  const removeLinkField = (index) => {
    const updatedLinks = newProject.links.filter((_, i) => i !== index);
    setNewProject({ ...newProject, links: updatedLinks });
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600">
              A selection of my technical implementations and solutions
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus /> Add New
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8">
          {projectsData.map((project, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
            >
              {user && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleEditProject(index)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Edit project"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete project"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              )}
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
                {project.links?.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-4 py-2 rounded-md ${
                      link.name.toLowerCase() === 'github' 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                    } transition-colors duration-200`}
                  >
                    {link.name.toLowerCase() === 'github' ? (
                      <FaGithub className="mr-2" />
                    ) : (
                      <FaExternalLinkAlt className="mr-2" />
                    )}
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setEditingIndex(null);
        setNewProject({
          title: '',
          date: '',
          description: '',
          links: []
        });
      }}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {editingIndex !== null ? 'Edit Project' : 'Add New Project'}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Cloud-Based Vehicle Tracking System"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Date*</label>
                <input
                  type="text"
                  value={newProject.date}
                  onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., March 2022 - June 2022"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows={4}
                  placeholder="Describe the project in detail..."
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Links (Optional)</label>
                <div className="space-y-3">
                  {newProject.links?.map((link, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Link Name</label>
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="e.g., GitHub, Live Demo"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => removeLinkField(index)}
                          className="w-full p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLinkField}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm sm:text-base mt-2"
                  >
                    <FaPlus size={12} /> Add Link
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  setNewProject({
                    title: '',
                    date: '',
                    description: '',
                    links: []
                  });
                }}
                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
              >
                {editingIndex !== null ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Projects;