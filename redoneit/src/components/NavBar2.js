import '../styles/NavBar2.css';
import React, { useState } from 'react';

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const toggleMenu = () => {
    setExpanded(!expanded);
  };
  return (
    <div>
      <nav>
        <h1>Reddit</h1>
        <div className="main-nav">
          <ul>
            <li>Link 1</li>
            <li>Link 2</li>
            <li>Link 3</li>
          </ul>
        </div>
        <button className="hamburger-btn" onClick={toggleMenu}>
          Button
        </button>
      </nav>
      <div className={expanded ? 'overlay-open' : 'overlay-closed'}>
        <ul className="overlay-menu">
          <li className={expanded ? 'open' : 'closed'}>Link 1</li>
          <li className={expanded ? 'open' : 'closed'}>Link 2</li>
          <li className={expanded ? 'open' : 'closed'}>Link 3</li>
          <li className={expanded ? 'open' : 'closed'}>Link 3</li>
        </ul>
      </div>
    </div>
  );
}
