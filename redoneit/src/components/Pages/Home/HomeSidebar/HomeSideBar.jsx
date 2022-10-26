import './HomeSidebar.css';
import homeBanner from '../../../../imgs/homeBanner.png';
import snooHome from '../../../../imgs/snooHome.png';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeSidebar({ userId }) {
  return (
    <AnimatePresence mode="wait">
      <div className="home-sidebar">
        <div
          className="home-sidebar-banner"
          style={{
            backgroundImage: `url(${homeBanner})`,
            backgroundSize: 'cover',
          }}
        ></div>
        <div className="home-sidebar-content">
          <div className="home-sidebar-title">
            <img
              className="snoo-home"
              src={snooHome}
              alt="reddit-snoo-character"
            />
            <div className="sidebar-title-text">Home</div>
          </div>
          <div className="home-sidebar-blurb">
            {userId
              ? 'Your personal Reddit frontpage. Come here to check in with your favourite communities.'
              : 'The home page of the internet. Create an account or login to personalise!'}
          </div>
          <hr></hr>
          <div className="create-buttons">
            <Link to="r/home/submit?type=text">
              <motion.button
                className="home-sidebar-post"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.8 }}
              >
                Create Post
              </motion.button>
            </Link>
            <Link to="/createsub">
              <motion.button
                className="home-sidebar-community"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.8 }}
              >
                Create Community
              </motion.button>
            </Link>
            <Link to="/r">
              <motion.button
                className="home-sidebar-community"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.8 }}
              >
                All communities
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
