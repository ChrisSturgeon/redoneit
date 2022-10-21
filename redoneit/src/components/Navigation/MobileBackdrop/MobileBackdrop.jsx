import './MobileBackdrop.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MobileSubs from './MobileSubs/MobileSubs';
import { useState } from 'react';
import { async } from '@firebase/util';

const slideRight = {
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

export default function MobileBackdrop({
  userId,
  toggleMobileNav,
  subsArr,
  hasFavourites,
  userName,
  signOut,
  userData,
  toggleLoginModal,
}) {
  const [favouritesOpen, setfavouritesOpen] = useState(false);
  const [subsOpen, setSubsOpen] = useState(false);

  // Toggles favourites tray
  const toggleFavouritesOpen = () => {
    setfavouritesOpen(!favouritesOpen);
  };

  // Toggles subsopen tray
  const toggleSubsOpen = () => {
    setSubsOpen(!subsOpen);
  };

  const triggerLoginModal = () => {
    toggleMobileNav();
    toggleLoginModal();
  };

  return (
    <motion.div
      className="mobile-backdrop"
      variants={slideRight}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="mobile-menu">
        <div className="mobile-menu-upper">
          {userName ? (
            <div className="user-details">
              {userName} - {userData.karma} Karma
            </div>
          ) : null}

          <Link className="mobile-link" onClick={toggleMobileNav} to="/">
            <i className="fa-solid fa-house"></i>
            <div>Home</div>
          </Link>
          <Link
            className="mobile-link"
            onClick={toggleMobileNav}
            to="/r/home/submit?type=text"
          >
            <i className="fa-solid fa-plus"></i>
            <div>Create Post</div>
          </Link>
          <Link
            className="mobile-link"
            onClick={toggleMobileNav}
            to="createsub"
          >
            <i className="fa-solid fa-users-viewfinder"></i>
            <div>Create Community</div>
          </Link>
          <Link className="mobile-link" onClick={toggleMobileNav} to="/r">
            <i className="fa-solid fa-list"></i>
            <div>All Communities</div>
          </Link>
          <button className="mobile-subs-btn" onClick={toggleFavouritesOpen}>
            <div className="mobile-subs-btn-left">
              <i className="fa-solid fa-star"></i>
              <div>Favourite Communities</div>
            </div>
            <i
              className={
                favouritesOpen
                  ? 'fa-solid fa-angle-down open'
                  : 'fa-solid fa-angle-down'
              }
            ></i>
          </button>

          <MobileSubs
            favourite={true}
            subsArr={subsArr}
            favouritesOpen={favouritesOpen}
            subsOpen={subsOpen}
            toggleMobileNav={toggleMobileNav}
            hasFavourites={hasFavourites}
          ></MobileSubs>
          <button className="mobile-subs-btn" onClick={toggleSubsOpen}>
            <div className="mobile-subs-btn-left">
              <i className="fa-solid fa-people-group"></i>
              <div>Your Communities</div>
            </div>
            <i
              className={
                subsOpen
                  ? 'fa-solid fa-angle-down open'
                  : 'fa-solid fa-angle-down'
              }
            ></i>
          </button>
          <MobileSubs
            favourite={false}
            subsArr={subsArr}
            favouritesOpen={favouritesOpen}
            subsOpen={subsOpen}
            toggleMobileNav={toggleMobileNav}
          ></MobileSubs>
        </div>
        <div className="mobile-menu-lower">
          {userName ? (
            <button
              onClick={async () => {
                await signOut();
                toggleMobileNav();
              }}
            >
              Log out
            </button>
          ) : (
            <button onClick={triggerLoginModal}>Log In</button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
