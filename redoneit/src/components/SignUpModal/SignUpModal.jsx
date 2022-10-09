import Backdrop from '../Backdrop/Backdrop';
import { motion } from 'framer-motion';
import SignUpForm from '../SignUpForm/SignUpForm';

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: '0',
  },
  visible: {
    y: '0',
    opacity: '1',
    transition: {
      duration: '0.1',
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: '100vh',
  },
};

export default function SignUpModal({ modalOpen, handleClose }) {
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <SignUpForm handleClose={handleClose} modalOpen={modalOpen} />
      </motion.div>
    </Backdrop>
  );
}
