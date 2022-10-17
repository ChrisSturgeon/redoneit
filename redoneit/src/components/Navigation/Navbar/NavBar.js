import './NavBar.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import navLogo from '../../../imgs/navLogo.png';

// User authentication and datta
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';

// Components
import UserNavBox from '../NavBarUserDetails/UserNavBox';
import SubsNav from '../SubNavDropdown/SubsNav';
import LoginModal from '../../Modals/LoginModal/LoginModal';
import SignUpModal from '../../Modals/SignUpModal/SignUpModal';

export default function NavBar(props) {
  const [expanded, setExpanded] = useState(false);
  const [subsOpen, setSubsOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const userId = props.userId;

  // Scrolls to top of page and locks body scroll
  //  register or login modals are open
  useEffect(() => {
    if (props.loginModalOpen || registerModalOpen) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [props.loginModalOpen, registerModalOpen]);

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
          <img className="nav-logo" src={navLogo} alt="reddit-logo" />
          <div className="reddit-text">reddit</div>
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
              <button onClick={props.toggleLoginModal}>Test Modal</button>
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
                    <button
                      onClick={props.toggleLoginModal}
                      className="login-btn"
                    >
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
        {props.loginModalOpen && (
          <LoginModal
            modalOpen={props.loginModalOpen}
            handleClose={props.toggleLoginModal}
            toggleRegisterModal={toggleRegisterModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
