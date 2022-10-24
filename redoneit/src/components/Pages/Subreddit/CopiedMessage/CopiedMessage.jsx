import './CopiedMessage.css';
import { motion, AnimatePresence } from 'framer-motion';

const fade = {
  hidden: {
    opacity: 0.5,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};
export default function CopiedMessage({ isVisible, backgroundColour }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="copied-msg"
          variants={fade}
          initial="hidden"
          animate="visible"
          exit="exit"
          key="text"
        >
          <div style={{ backgroundColor: backgroundColour }}>
            Link copied to clipboard!
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
