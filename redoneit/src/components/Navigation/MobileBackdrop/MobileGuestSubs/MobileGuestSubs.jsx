import './MobileGuestSubs.css';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function MobileGuestSubs({
  subsArr,
  guestSubs,
  toggleMobileNav,
}) {
  const navigate = useNavigate();
  return (
    <AnimatePresence mode="wait">
      {subsArr && guestSubs ? (
        <motion.div
          className="mobile-subs-guest"
          initial={{
            height: 0,
            opacity: 0,
          }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              height: {
                duration: 0.2,
              },
              opacity: {
                duration: 0.7,
                delay: 0,
              },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: {
                duration: 0.2,
              },
              opacity: {
                duration: 0.2,
              },
            },
          }}
        >
          {subsArr.map((sub) => {
            const linkString = `r/${sub}`;
            return (
              <div
                className="mobile-guest-link"
                onClick={() => {
                  navigate(linkString);
                  toggleMobileNav();
                }}
                key={sub}
              >
                {sub}
              </div>
            );
          })}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
