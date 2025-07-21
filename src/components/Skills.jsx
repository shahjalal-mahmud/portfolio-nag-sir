import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import Modal from '../components/hero/Modal';
import LoadingAnimation from '../components/LoadingAnimation';

const Skills = () => {
  const { user } = useAuth();
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newSkill, setNewSkill] = useState({
    title: '',
    content: '',
    icon: ''
  });

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const docRef = doc(db, "portfolio", "skills");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSkillsData(docSnap.data().items || []);
        } else {
          // Fallback data if document doesn't exist
          const fallbackData = [
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
          setSkillsData(fallbackData);
        }
      } catch (error) {
        console.error("Error fetching skills data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsData();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill.title || !newSkill.content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "skills");
      // Get current data first
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        // If editing, replace the item at editingIndex
        updatedData = [...currentData];
        updatedData[editingIndex] = newSkill;
      } else {
        // If adding new, prepend the new item
        updatedData = [newSkill, ...currentData];
      }

      // Update the document with the new array
      await updateDoc(docRef, {
        items: updatedData
      });

      // Update local state
      setSkillsData(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewSkill({
        title: '',
        content: '',
        icon: ''
      });
    } catch (error) {
      console.error("Error adding/updating skill:", error);
    }
  };

  const handleDeleteSkill = async (index) => {
    try {
      const docRef = doc(db, "portfolio", "skills");
      await updateDoc(docRef, {
        items: arrayRemove(skillsData[index])
      });

      setSkillsData(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const handleEditSkill = (index) => {
    setNewSkill(skillsData[index]);
    setEditingIndex(index);
    setShowAddModal(true);
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
              Professional Skills
            </h2>
            <p className="text-lg text-gray-600">
              A comprehensive set of technical and interpersonal competencies
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((skill, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
            >
              {user && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEditSkill(index)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Edit skill"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete skill"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              )}
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Skill Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setEditingIndex(null);
        setNewSkill({
          title: '',
          content: '',
          icon: ''
        });
      }}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {editingIndex !== null ? 'Edit Skill' : 'Add New Skill'}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  value={newSkill.title}
                  onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Programming Languages"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Content*</label>
                <textarea
                  value={newSkill.content}
                  onChange={(e) => setNewSkill({ ...newSkill, content: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows={4}
                  placeholder="List the skills separated by commas"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Icon (Optional)</label>
                <input
                  type="text"
                  value={newSkill.icon}
                  onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Paste an emoji or leave blank"
                />
                <p className="text-xs text-gray-500 mt-1">Tip: Use emojis like 🌐, 💻, 🛠️, etc.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  setNewSkill({
                    title: '',
                    content: '',
                    icon: ''
                  });
                }}
                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
              >
                {editingIndex !== null ? 'Update Skill' : 'Add Skill'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Skills;