import '../styles/NavBar.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// User authentication and datta
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

// Components
import UserNavBox from './UserNavBox';
import SubsNav from './SubsNav';
import LoginModal from './LoginModal/LoginModal';
import SignUpModal from './SignUpModal/SignUpModal';

export default function NavBar(props) {
  const [expanded, setExpanded] = useState(false);
  const [subsOpen, setSubsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const userId = props.userId;

  // Locks body scroll when register or login modals are open
  useEffect(() => {
    if (loginModalOpen || registerModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [loginModalOpen, registerModalOpen]);

  // Toggles login modal open/closed
  const toggleLoginModal = () => {
    setLoginModalOpen(!loginModalOpen);
  };

  // Toggles register modal open/closed
  const toggleRegisterModal = () => {
    setRegisterModalOpen(!registerModalOpen);
  };

  // Toggles mobile menu display
  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  // Signs out current user
  const signOutUser = () => {
    signOut(auth);
  };

  // Opens and closes the subreddit navigation div
  const toggleSubsNav = () => {
    setSubsOpen(!subsOpen);
  };

  return (
    <div>
      <nav className={expanded ? 'no-shadow' : null}>
        <Link
          onClick={() => {
            if (subsOpen) {
              toggleSubsNav();
            }
          }}
          className="home-nav-link"
          to="/"
        >
          Reddit
        </Link>
        <div className="desktop-subs-nav">
          <button onClick={toggleSubsNav} className="subs-btn">
            Show subs
          </button>
          {subsOpen && userId ? (
            <SubsNav toggleSubsNav={toggleSubsNav} />
          ) : null}
        </div>
        <div className="main-nav">
          <ul>
            <li>
              <button onClick={toggleLoginModal}>Test Modal</button>
            </li>
            <li>
              <Link to="r">
                <button>Test</button>
              </Link>
            </li>
            {!props.userName ? (
              <>
                <li>
                  <Link>
                    <button
                      onClick={toggleRegisterModal}
                      className="signup-btn"
                    >
                      Sign Up
                    </button>
                  </Link>
                </li>
                <li>
                  <Link>
                    <button onClick={toggleLoginModal} className="login-btn">
                      Log In
                    </button>
                  </Link>
                </li>
              </>
            ) : null}

            {props.userName ? (
              <>
                <UserNavBox userId={props.userId} />
                <li>
                  <button onClick={signOutUser} className="signup-btn">
                    Log out{' '}
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </div>
        <button className="hamburger-btn" onClick={toggleMenu}>
          {expanded ? (
            <i className="fa-solid fa-xmark"></i>
          ) : (
            <i className="fa-solid fa-bars"></i>
          )}
        </button>
      </nav>
      <div className={expanded ? 'overlay-open' : 'overlay-closed'}>
        <ul className={expanded ? 'overlay-menu-open' : 'overlay-menu-closed'}>
          <li className={expanded ? 'open' : 'closed'}>
            <Link to="/" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li className={expanded ? 'open' : 'closed'}>
            <Link to="r" onClick={toggleMenu}>
              All Subreddits
            </Link>
          </li>
          <li className={expanded ? 'open' : 'closed'}>Link 3</li>
          <li className={expanded ? 'open' : 'closed'}>Link 4</li>
          <li className={expanded ? 'open' : 'closed'}>Link 5</li>
          <li className={expanded ? 'open' : 'closed'}>Link 6</li>
        </ul>
      </div>

      <AnimatePresence initial={false} wait={true}>
        {registerModalOpen && (
          <SignUpModal
            modalOpen={registerModalOpen}
            handleClose={toggleRegisterModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} wait={true}>
        {loginModalOpen && (
          <LoginModal
            modalOpen={loginModalOpen}
            handleClose={toggleLoginModal}
            toggleRegisterModal={toggleRegisterModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
