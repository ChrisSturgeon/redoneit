import './MobileSubs.css';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SubNavLink from '../../SubNavigationLink/SubNavLink';

export default function MobileSubs({
  favourite,
  subsArr,
  favouritesOpen,
  subsOpen,
  toggleMobileNav,
  hasFavourites,
}) {
  if (favourite) {
    return (
      <AnimatePresence mode="wait">
        {subsArr && favouritesOpen ? (
          <motion.div
            className="mobile-subs"
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
            {hasFavourites ? (
              subsArr.map((sub) => {
                const linkString = `r/${sub.subName}`;
                if (sub.favourite) {
                  return (
                    <SubNavLink
                      key={sub.subName}
                      subName={sub.subName}
                      toggleSubsNav={toggleMobileNav}
                      linkString={linkString}
                      favourite={sub.favourite}
                      mobile={true}
                    />
                  );
                }
              })
            ) : (
              <div className="no-favourites">No favourites yet!</div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  } else {
    return (
      <AnimatePresence mode="wait">
        {subsArr && subsOpen ? (
          <motion.div
            className="mobile-subs"
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
              const linkString = `r/${sub.subName}`;
              return (
                <SubNavLink
                  key={sub.subName}
                  subName={sub.subName}
                  toggleSubsNav={toggleMobileNav}
                  linkString={linkString}
                  favourite={sub.favourite}
                  mobile={true}
                />
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }
}
