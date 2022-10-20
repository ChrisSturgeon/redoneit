import './MobileBackdrop.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: '0',
  },
  visible: {
    y: '0',
    opacity: '1',
    transition: {
      duration: '0.4',
      // type: 'spring',
      // damping: 25,
      // stiffness: 500,
    },
  },
  exit: {
    y: '-100vh',
    transition: {
      duration: '0.4',
    },
  },
};

export default function MobileBackdrop({ children, onClick }) {
  return (
    <motion.div
      className="mobile-backdrop"
      // Remove this to disable click close
      onClick={onClick}
      //
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="test-div">
        <Link onClick={onClick} to="/">
          Home
        </Link>
      </div>

      {/* {children} */}
    </motion.div>
  );
}
