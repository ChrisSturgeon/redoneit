import Backdrop from '../Backdrop/Backdrop';
import { motion } from 'framer-motion';
import LoginForm from '../LoginForm/LoginForm';

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

export default function LoginModal({
  modalOpen,
  handleClose,
  toggleRegisterModal,
}) {
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <LoginForm
          handleClose={handleClose}
          modalOpen={modalOpen}
          toggleRegisterModal={toggleRegisterModal}
        />
      </motion.div>
    </Backdrop>
  );
}
