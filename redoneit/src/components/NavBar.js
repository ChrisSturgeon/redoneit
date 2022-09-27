import '../styles/NavBar.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const toggleMenu = () => {
    setExpanded(!expanded);
  };
  return (
    <div>
      <nav className={expanded ? 'no-shadow' : null}>
        <h1>Reddit</h1>
        <div className="main-nav">
          <ul>
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
    </div>
  );
}
