import './Hamburger.css';
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const path01Variants = {
  open: { d: 'M3.06061 2.99999L21.0606 21' },
  closed: { d: 'M0 9.5L24 9.5' },
};

const path02Variants = {
  open: { d: 'M3.00006 21.0607L21 3.06064' },
  moving: { d: 'M0 14.5L24 14.5' },
  closed: { d: 'M0 14.5L15 14.5' },
};

export default function Hamburger({ mobileNavOpen, toggleMobileNav }) {
  const path01Controls = useAnimation();
  const path02Controls = useAnimation();

  useEffect(() => {
    const clicked = async () => {
      if (mobileNavOpen) {
        await path02Controls.start(path02Variants.moving);
        path01Controls.start(path01Variants.open);
        path02Controls.start(path02Variants.open);
      } else {
        path01Controls.start(path01Variants.closed);
        await path02Controls.start(path02Variants.moving);
        path02Controls.start(path02Variants.closed);
      }
    };
    clicked();
  }, [path01Controls, path02Controls, mobileNavOpen]);

  return (
    <button className="hamburger-button" onClick={toggleMobileNav}>
      <svg width="30" height="30" viewBox="0 0 24 24">
        <motion.path
          {...path01Variants.closed}
          animate={path01Controls}
          transition={{ duration: 0.2 }}
          stroke="#FFFFFF"
          strokeWidth="2.5px"
        />
        <motion.path
          {...path02Variants.closed}
          animate={path02Controls}
          transition={{ duration: 0.2 }}
          stroke="#FFFFFF"
          strokeWidth="2.5px"
        />
      </svg>
    </button>
  );
}
