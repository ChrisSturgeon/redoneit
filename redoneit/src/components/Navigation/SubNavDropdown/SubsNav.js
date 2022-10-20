import './SubsNav.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onSnapshot, query, collection } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import SubNavLink from '../SubNavigationLink/SubNavLink';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubsNav(props) {
  const [subsArr, setSubsArr] = useState(null);

  // On mount establishes listener for users
  // subreddit subscriptions and sets to these state as array
  useEffect(() => {
    async function userSubs() {
      const currentUser = auth.currentUser.uid;
      const queryRef = query(
        collection(db, 'users', `${currentUser}`, 'subscribed')
      );
      onSnapshot(queryRef, (QuerySnapshot) => {
        const subs = [];
        QuerySnapshot.forEach((doc) => {
          subs.push(doc.data());
        });
        setSubsArr(subs);
      });
    }
    userSubs();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {subsArr && props.subsOpen ? (
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
              to="createsub"
            >
              Create Subreddit
            </Link>
          </div>

          <h2>FAVOURITES</h2>
          {subsArr ? (
            <div>
              {subsArr.map((sub) => {
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
          ) : null}

          <h2>YOUR COMMUNITIES</h2>

          {subsArr ? (
            <div>
              {subsArr.map((sub) => {
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
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
