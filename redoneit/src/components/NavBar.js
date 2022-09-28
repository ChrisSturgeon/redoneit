import '../styles/NavBar.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import LoginModal from './LoginModal';

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  const toggleLogin = () => {
    setLoginOpen(!loginOpen);
  };

  return (
    <div>
      <nav className={expanded ? 'no-shadow' : null}>
        <h1>
          <Link to="/">Reddit</Link>
        </h1>
        <div className="main-nav">
          <ul>
            <li>
              <Link>
                <button className="signup-btn">Sign Up</button>
              </Link>
            </li>
            <li>
              <Link>
                <button onClick={toggleLogin} className="login-btn">
                  Log In
                </button>
              </Link>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="subreddit">Subreddit</Link>
            </li>
            <li>Link 3</li>
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
            <Link to="subreddit" onClick={toggleMenu}>
              Subreddit
            </Link>
          </li>
          <li className={expanded ? 'open' : 'closed'}>Link 3</li>
          <li className={expanded ? 'open' : 'closed'}>Link 4</li>
          <li className={expanded ? 'open' : 'closed'}>Link 5</li>
          <li className={expanded ? 'open' : 'closed'}>Link 6</li>
        </ul>
      </div>
      <LoginModal loginOpen={loginOpen} toggleLogin={toggleLogin} />
    </div>
  );
}
