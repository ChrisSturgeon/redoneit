import './SubsNav.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onSnapshot, query, collection } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import SubNavLink from '../SubNavigationLink/SubNavLink';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubsNav(props) {
  const navigate = useNavigate();

  return (
    <AnimatePresence mode="wait">
      {props.subsArr && props.subsOpen ? (
        <motion.div
          initial={{
            height: 0,
            opacity: 0,
          }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              height: {
                duration: 0.4,
              },
              opacity: {
                duration: 0.3,
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
                duration: 0.3,
              },
            },
          }}
          className="subs-nav"
        >
          <div className="subs-nav-upper">
            <Link onClick={props.toggleSubsNav} className="all-subs-btn" to="r">
              View all subreddits
            </Link>
            <Link
              onClick={props.toggleSubsNav}
              className="all-subs-btn"
              to="/r/home/submit?type=text"
            >
              Create Post
            </Link>
            <Link
              onClick={props.toggleSubsNav}
              className="all-subs-btn"
              to="createsub"
            >
              Create Subreddit
            </Link>
          </div>

          {props.userId ? (
            <>
              <h2>FAVOURITES</h2>
              {props.hasFavourites ? (
                <div>
                  {props.subsArr.map((sub) => {
                    const linkString = `r/${sub.subName}`;
                    if (sub.favourite) {
                      return (
                        <SubNavLink
                          key={sub.subName}
                          subName={sub.subName}
                          linkString={linkString}
                          favourite={sub.favourite}
                          toggleSubsNav={props.toggleSubsNav}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              ) : (
                <div className="no-favourites">No favourites yet</div>
              )}
              <h2>YOUR COMMUNITIES</h2>
              {props.subsArr ? (
                <div>
                  {props.subsArr.map((sub) => {
                    const linkString = `r/${sub.subName}`;
                    return (
                      <SubNavLink
                        key={sub.subName}
                        subName={sub.subName}
                        toggleSubsNav={props.toggleSubsNav}
                        linkString={linkString}
                        favourite={sub.favourite}
                      />
                    );
                  })}
                </div>
              ) : null}
            </>
          ) : (
            <div className="guest-subs">
              <h2>Default subs</h2>
              {props.subsArr.map((sub) => {
                const linkString = `r/${sub}`;
                return (
                  <div
                    onClick={() => {
                      navigate(linkString);
                      props.toggleSubsNav();
                    }}
                    key={sub}
                  >
                    {sub}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
