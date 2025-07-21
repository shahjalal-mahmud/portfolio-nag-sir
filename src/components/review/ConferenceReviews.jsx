import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import Modal from '../hero/Modal';
import LoadingAnimation from '.././LoadingAnimation';

const ConferenceReviews = () => {
  const { user } = useAuth();
  const [conferenceReviews, setConferenceReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newConferenceReview, setNewConferenceReview] = useState({
    name: '',
    date: '',
    title: '',
    location: '',
    publisher: ''
  });

  useEffect(() => {
    const fetchConferenceReviewsData = async () => {
      try {
        const docRef = doc(db, "portfolio", "conferenceReviews");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setConferenceReviews(docSnap.data().items || []);
        } else {
          // Fallback data if document doesn't exist
          const fallbackData = [
            {
              name: "WcCST-2026",
              date: "March 2026",
              title: "World Conference on Computational Science & Technology",
              location: "Punjab, India",
              publisher: "IEEE",
            },
            {
              name: "INCSTIC-2025",
              date: "October 2025",
              title: "1st Int. Conf. on Smart Technologies & Intelligent Computing",
              location: "Haryana, India",
              publisher: "CRC Press",
            },
            {
              name: "ICRTCIS-2025",
              date: "June 2025",
              title: "6th Int. Conf. on Recent Trends in Communication & Intelligent System",
              location: "Jaipur, Rajasthan, India",
              publisher: "Springer, IET",
            },
            {
              name: "InCACCT-2025",
              date: "April 2025",
              title: "3rd Int. Conf. on Advancement in Computation & Computer Technologies",
              location: "Jaipur, Rajasthan, India",
              publisher: "IEEE",
            },
            {
              name: "IISU-ASSET-2025",
              date: "March 2025",
              title: "Int. Conf. on AI Systems and Sustainable Technologies",
              location: "Jaipur, India",
              publisher: "Springer",
            },
            {
              name: "STI-2024",
              date: "December 2024",
              title: "6th Int. Conf. on Sustainable Technologies for Industry 5.0",
              location: "Dhaka, Bangladesh",
              publisher: "Springer",
            },
            {
              name: "ICRTAC-2024",
              date: "November 2024",
              title: "7th Int. Conf. on Recent Trends in Advanced Computing",
              location: "Chennai, India",
              publisher: "Springer",
            },
            {
              name: "ICETAI-2024",
              date: "September 2024",
              title: "2nd Int. Conf. on Emerging Trends and Applications in AI",
              location: "Baghdad, Iraq",
              publisher: "IEEE",
            },
            {
              name: "AIBThings-2024",
              date: "September 2024",
              title: "2nd Int. Conf. on AI, Blockchain, and IoT",
              location: "Michigan, USA",
              publisher: "IEEE",
            },
            {
              name: "ICSCPS-2024",
              date: "September 2024",
              title: "Int. Conf. on Smart Cyber-Physical Systems",
              location: "Delhi NCR, India",
              publisher: "IEEE",
            },
            {
              name: "ICCTAC-2024",
              date: "May 2024",
              title: "Int. Conf. on Current Trends in Advanced Computing",
              location: "Bengaluru, India",
              publisher: "Springer",
            },
            {
              name: "ICCCIS-2023",
              date: "November 2023",
              title: "4th Int. Conf. on Computing Communication, and Intelligent Systems",
              location: "Uttar Pradesh, India",
              publisher: "IEEE",
            },
          ];
          setConferenceReviews(fallbackData);
        }
      } catch (error) {
        console.error("Error fetching conference reviews data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConferenceReviewsData();
  }, []);

  const handleAddConferenceReview = async () => {
    if (!newConferenceReview.name || !newConferenceReview.date ||
      !newConferenceReview.title || !newConferenceReview.location ||
      !newConferenceReview.publisher) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const docRef = doc(db, "portfolio", "conferenceReviews");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data().items : [];

      let updatedData;
      if (editingIndex !== null) {
        updatedData = [...currentData];
        updatedData[editingIndex] = newConferenceReview;
      } else {
        updatedData = [newConferenceReview, ...currentData]; // Add to Top
      }

      await updateDoc(docRef, { items: updatedData });
      setConferenceReviews(updatedData);
      setShowAddModal(false);
      setEditingIndex(null);
      setNewConferenceReview({
        name: '',
        date: '',
        title: '',
        location: '',
        publisher: ''
      });
    } catch (error) {
      console.error("Error updating conference reviews:", error);
    }
  };

  const handleDeleteConferenceReview = async (index) => {
    try {
      const docRef = doc(db, "portfolio", "conferenceReviews");
      await updateDoc(docRef, {
        items: arrayRemove(conferenceReviews[index])
      });

      setConferenceReviews(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting conference review:", error);
    }
  };

  const handleEditConferenceReview = (index) => {
    setNewConferenceReview(conferenceReviews[index]);
    setEditingIndex(index);
    setShowAddModal(true);
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="mb-20">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <h3 className="text-2xl font-bold text-gray-900">Conference Review Experiences</h3>
          <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {conferenceReviews.length} Conferences
          </div>
        </div>

        {user && (
          <button
            onClick={() => {
              setShowAddModal(true);
              setEditingIndex(null);
              setNewConferenceReview({
                name: '',
                date: '',
                title: '',
                location: '',
                publisher: ''
              });
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus /> Add New
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {conferenceReviews.map((conf, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md relative"
          >
            {user && (
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleEditConferenceReview(index)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label="Edit conference review"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={() => handleDeleteConferenceReview(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Delete conference review"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-start mb-2">
              <h4 className="text-xl font-bold text-blue-700">{conf.name}</h4>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                {conf.date}
              </span>
            </div>

            <p className="text-gray-800 mb-3">{conf.title}</p>

            <div className="flex items-center text-sm text-gray-600 mb-2">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {conf.location}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span>Published by <span className="font-medium">{conf.publisher}</span></span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Conference Review Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setEditingIndex(null);
        setNewConferenceReview({
          name: '',
          date: '',
          title: '',
          location: '',
          publisher: ''
        });
      }}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl mx-2 my-4 md:my-8">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {editingIndex !== null ? 'Edit Conference Review' : 'Add New Conference Review'}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Conference Name*</label>
                <input
                  type="text"
                  value={newConferenceReview.name}
                  onChange={(e) => setNewConferenceReview({ ...newConferenceReview, name: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., WcCST-2026"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Date*</label>
                <input
                  type="text"
                  value={newConferenceReview.date}
                  onChange={(e) => setNewConferenceReview({ ...newConferenceReview, date: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., March 2026"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  value={newConferenceReview.title}
                  onChange={(e) => setNewConferenceReview({ ...newConferenceReview, title: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., World Conference on Computational Science & Technology"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Location*</label>
                <input
                  type="text"
                  value={newConferenceReview.location}
                  onChange={(e) => setNewConferenceReview({ ...newConferenceReview, location: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Punjab, India"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Publisher*</label>
                <input
                  type="text"
                  value={newConferenceReview.publisher}
                  onChange={(e) => setNewConferenceReview({ ...newConferenceReview, publisher: e.target.value })}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., IEEE, Springer"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  setNewConferenceReview({
                    name: '',
                    date: '',
                    title: '',
                    location: '',
                    publisher: ''
                  });
                }}
                className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddConferenceReview}
                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
              >
                {editingIndex !== null ? 'Update Review' : 'Add Review'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConferenceReviews;