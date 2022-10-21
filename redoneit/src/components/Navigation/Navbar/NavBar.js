import './NavBar.css';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import MobileBackdrop from '../MobileBackdrop/MobileBackdrop';
import Hamburger from '../Hamburger/Hamburger';

export default function NavBar(props) {
  const [expanded, setExpanded] = useState(false);
  const [subsOpen, setSubsOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const userId = props.userId;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [windowPosition, setWindowPosition] = useState(0);

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

  // Signs out current user
  const signOutUser = () => {
    signOut(auth);
  };

  // Opens and closes the subreddit navigation div
  const toggleSubsNav = () => {
    setSubsOpen(!subsOpen);
  };

  // Opens/close the mobile navigation bar
  const toggleMobileNav = async () => {
    if (mobileNavOpen) {
      await setMobileNavOpen(false);
      window.scrollTo(0, windowPosition);
    } else {
      setWindowPosition(window.scrollY);
      setMobileNavOpen(true);
    }
  };

  // Prevents scroll underneath modal when open, storing
  // scrolled-to position in state and returning to it when
  // modal is closed
  useEffect(() => {
    if (mobileNavOpen) {
      setTimeout(() => {
        document.body.style.position = 'fixed';
      }, 400);
    } else {
      document.body.style.position = '';
    }
  }, [windowPosition, mobileNavOpen]);

  return (
    <div>
      <nav>
        <div className="home-subs-nav">
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
            <button
              onClick={toggleSubsNav}
              className={subsOpen ? 'subs-btn open' : 'subs-btn'}
            >
              <div className="subs-btn-text">
                <i className="fa-solid fa-house"></i>
                <div>My subreddits</div>
                <i className="fa-solid fa-angle-down"></i>
              </div>
            </button>
            {userId ? (
              <SubsNav subsOpen={subsOpen} toggleSubsNav={toggleSubsNav} />
            ) : null}
          </div>
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
        <Hamburger onClick={toggleMobileNav} />
        {/* <button className="hamburger-btn" onClick={toggleMobileNav}>
          <i className="fa-solid fa-bars"></i>
        </button> */}
      </nav>

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

      <AnimatePresence initial={false} wait={true}>
        {mobileNavOpen && <MobileBackdrop onClick={toggleMobileNav} />}
      </AnimatePresence>
    </div>
  );
}
