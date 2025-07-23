// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl"
      >
        <motion.h1
          className="text-[120px] md:text-[160px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 drop-shadow mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          404
        </motion.h1>

        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Page Not Found
        </motion.h2>

        <p className="text-gray-600 mb-8 text-base md:text-lg px-4">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block mt-2 px-6 py-3 bg-primary text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:bg-primary-focus transition duration-300"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
