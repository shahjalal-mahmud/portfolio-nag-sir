import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaRegCalendarAlt, FaPlus, FaTrash, FaEdit, FaLink, FaProjectDiagram } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';
import Toast from '../components/common/Toast';
import ConfirmationModal from '../components/common/ConfirmationModal';

const Projects = () => {
  const { user } = useAuth();
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
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
          // Fallback data provided in your original code
          const fallbackData = [
            { title: "Cloud-Based Vehicle Tracking System", date: "March 2022 - June 2022", description: "Developed an RFID-based parking management system that records vehicle in-time and out-time...", links: [{ name: "GitHub", url: "https://github.com/AnindyaNag/Project_2_Vehicle-Tracking-Management-System" }] },
            { title: "Analyze Crop Production of India", date: "July 2021 - September 2021", description: "As an Intern at Spotle.ai...", links: [{ name: "GitHub", url: "https://github.com/AnindyaNag/Project---Analyze-Crop-Production-of-India" }, { name: "Article", url: "https://community.nasscom.in/communities/agritech/ai-agriculture-emerging-era-technology" }] }
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
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "projects");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        updatedData = [...currentData];
        updatedData[editingIndex] = newProject;
      } else {
        updatedData = [newProject, ...currentData];
      }

      await updateDoc(docRef, { items: updatedData });
      setProjectsData(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewProject({ title: '', date: '', description: '', links: [] });
      setToastMessage(editingIndex !== null ? 'Project updated successfully' : 'Project added successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error adding/updating project:", error);
      setToastMessage(`Failed to save project`);
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete === null) return;
    try {
      const docRef = doc(db, "portfolio", "projects");
      await updateDoc(docRef, { items: arrayRemove(projectsData[projectToDelete]) });
      setProjectsData(prev => prev.filter((_, i) => i !== projectToDelete));
      setToastMessage('Project deleted successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting project:", error);
      setToastMessage('Failed to delete project');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...newProject.links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setNewProject({ ...newProject, links: updatedLinks });
  };

  if (loading) return <LoadingAnimation />;

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-base-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest">
              <FaProjectDiagram /> Portfoio
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight">
              Featured <span className="text-primary">Projects</span>
            </h2>
            <p className="text-lg text-base-content/60 max-w-2xl">
              Showcasing technical architecture, problem-solving, and implementation excellence across various domains.
            </p>
          </div>
          {user && (
            <button
              onClick={() => { setShowAddModal(true); setEditingIndex(null); setNewProject({ title: '', date: '', description: '', links: [] }); }}
              className="btn btn-primary shadow-lg gap-2"
            >
              <FaPlus /> Create Project
            </button>
          )}
        </div>

        {/* Projects Stack */}
        <div className="grid grid-cols-1 gap-10">
          <AnimatePresence>
            {projectsData.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group relative"
              >
                <div className="bg-base-100 border border-base-300 group-hover:border-primary/40 rounded-[2rem] overflow-hidden transition-all duration-300 shadow-sm group-hover:shadow-2xl">
                  {/* Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-base-300 group-hover:bg-primary transition-colors" />
                  
                  <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
                          <FaRegCalendarAlt />
                          {project.date}
                        </div>
                        {user && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setNewProject(project); setEditingIndex(index); setShowAddModal(true); }} className="btn btn-circle btn-sm btn-ghost text-info hover:bg-info/10"><FaEdit /></button>
                            <button onClick={() => { setProjectToDelete(index); setIsDeleteModalOpen(true); }} className="btn btn-circle btn-sm btn-ghost text-error hover:bg-error/10"><FaTrash /></button>
                          </div>
                        )}
                      </div>

                      <h3 className="text-3xl md:text-4xl font-black text-base-content leading-tight">
                        {project.title}
                      </h3>

                      <p className="text-lg text-base-content/70 leading-relaxed font-medium border-l-4 border-base-300 pl-6 py-2 group-hover:border-primary transition-colors">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-4 pt-4">
                        {project.links?.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn btn-md rounded-2xl gap-2 font-bold transition-all ${
                              link.name.toLowerCase().includes('github') 
                              ? 'btn-neutral' 
                              : 'btn-primary btn-outline'
                            }`}
                          >
                            {link.name.toLowerCase().includes('github') ? <FaGithub size={18} /> : <FaExternalLinkAlt size={16} />}
                            {link.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modern Modal Design */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-base-100 rounded-[2.5rem] shadow-2xl w-full max-w-3xl border border-base-300 overflow-hidden">
          <div className="p-10">
            <h3 className="text-3xl font-black text-base-content mb-8">
              {editingIndex !== null ? 'Modify Project' : 'New Project Story'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="form-control col-span-2 md:col-span-1">
                <label className="label"><span className="label-text font-black uppercase text-xs opacity-60">Project Title</span></label>
                <input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="input input-bordered focus:input-primary bg-base-200/50" placeholder="e.g. Cloud System" />
              </div>

              <div className="form-control col-span-2 md:col-span-1">
                <label className="label"><span className="label-text font-black uppercase text-xs opacity-60">Timeline</span></label>
                <input type="text" value={newProject.date} onChange={(e) => setNewProject({ ...newProject, date: e.target.value })} className="input input-bordered focus:input-primary bg-base-200/50" placeholder="March 2022 - June 2022" />
              </div>

              <div className="form-control col-span-2">
                <label className="label"><span className="label-text font-black uppercase text-xs opacity-60">Deep Dive / Description</span></label>
                <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="textarea textarea-bordered focus:textarea-primary bg-base-200/50 min-h-[140px]" placeholder="Explain the technical challenges and outcomes..." />
              </div>

              <div className="form-control col-span-2">
                <label className="label flex justify-between">
                  <span className="label-text font-black uppercase text-xs opacity-60">Asset Links</span>
                  <button type="button" onClick={() => setNewProject({ ...newProject, links: [...newProject.links, { name: '', url: '' }] })} className="btn btn-xs btn-primary btn-ghost gap-1"><FaPlus /> Add Link</button>
                </label>
                
                <div className="space-y-4">
                  {newProject.links?.map((link, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 items-end bg-base-200/50 p-4 rounded-2xl">
                      <div className="flex-1 w-full">
                        <input type="text" value={link.name} onChange={(e) => handleLinkChange(index, 'name', e.target.value)} className="input input-sm input-bordered w-full" placeholder="Label (e.g. GitHub)" />
                      </div>
                      <div className="flex-[2] w-full">
                        <input type="url" value={link.url} onChange={(e) => handleLinkChange(index, 'url', e.target.value)} className="input input-sm input-bordered w-full" placeholder="https://" />
                      </div>
                      <button onClick={() => setNewProject({ ...newProject, links: newProject.links.filter((_, i) => i !== index) })} className="btn btn-sm btn-square btn-error btn-ghost"><FaTrash /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-action mt-12 gap-3">
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost font-bold">Cancel</button>
              <button onClick={handleAddProject} className="btn btn-primary px-10 font-black tracking-widest uppercase">
                Publish Project
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Notifications */}
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="This will permanently remove the project and its associated links. Continue?"
        confirmText="Confirm Deletion"
        cancelText="Discard"
        confirmColor="red"
        title="Remove Project Record"
      />
    </section>
  );
};

export default Projects;