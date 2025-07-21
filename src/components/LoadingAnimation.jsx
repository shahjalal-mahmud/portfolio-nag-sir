// components/LoadingAnimation.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <motion.div
        className="flex space-x-2"
        initial="hidden"
        animate="visible"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-blue-600 rounded-full"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.6,
                  delay: i * 0.2
                }
              }
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;