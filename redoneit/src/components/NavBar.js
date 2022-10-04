import { signOut } from 'firebase/auth';

import '../styles/NavBar.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, getUserSubs } from '../firebase';

import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import UserNavBox from './UserNavBox';
import SubsNav from './SubsNav';

export default function NavBar(props) {
  const [expanded, setExpanded] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [subsOpen, setSubsOpen] = useState(false);
  const userId = props.userId;

  // Toggles mobile menu display
  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  // Toggles login modal display
  const toggleLogin = () => {
    if (registerOpen) {
      toggleRegister();
    }
    setLoginOpen(!loginOpen);
  };

  // Toggles register modal display
  const toggleRegister = () => {
    if (loginOpen) {
      toggleLogin();
    }
    setRegisterOpen(!registerOpen);
  };

  // Signs out current user
  const signOutUser = () => {
    signOut(auth);
  };

  const toggleSubsNav = () => {
    setSubsOpen(!subsOpen);
  };

  return (
    <div>
      <nav className={expanded ? 'no-shadow' : null}>
        <h1>
          <Link to="/">Reddit</Link>
        </h1>
        <div className="subs-nav">
          <button onClick={toggleSubsNav} className="subs-btn">
            Show subs
          </button>
          <div className={subsOpen ? 'subs-modal-open' : 'subs-modal-closed'}>
            {userId ? <SubsNav toggleSubsNav={toggleSubsNav} /> : null}
          </div>
        </div>
        <div className="main-nav">
          <ul>
            <li>
              <button>Test func</button>
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
                    <button onClick={toggleRegister} className="signup-btn">
                      Sign Up
                    </button>
                  </Link>
                </li>
                <li>
                  <Link>
                    <button onClick={toggleLogin} className="login-btn">
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
        <ul className="overlay-menu">
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
      <RegisterModal
        registerOpen={registerOpen}
        toggleRegister={toggleRegister}
      />
      <LoginModal loginOpen={loginOpen} toggleLogin={toggleLogin} />
    </div>
  );
}
