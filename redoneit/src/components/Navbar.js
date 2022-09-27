import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/Navbar.css';

export default function NavBar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const toggleNav = () => {
    setToggleMenu(!toggleMenu);
  };

  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', changeWidth);
  }, []);

  return (
    <nav>
      {(toggleMenu || screenWidth > 500) && (
        <ul className="nav-list">
          <li className="nav-item">Home</li>
          <li className="nav-item">Link 1</li>
          <li className="nav-item">Link 2</li>
        </ul>
      )}

      <button onClick={toggleNav} className="hamburger-btn">
        Button
      </button>
    </nav>
  );
}
