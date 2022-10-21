import './MobileBackdrop.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const dropIn = {
  hidden: {
    y: '50px',
    x: '-100vw',
    opacity: '0',
  },
  visible: {
    y: '50px',
    x: '0',
    opacity: '1',
    transition: {
      duration: '0.3',
      // type: 'spring',
      // damping: 25,
      // stiffness: 500,
    },
  },
  exit: {
    y: '50px',
    x: '-100vw',
    transition: {
      duration: '0.3',
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
