import './HomeNewPostDropdown.css';
import { useState, useEffect } from 'react';
import { getUserSubscriptions } from '../../../firebase';
import { AnimatePresence, motion } from 'framer-motion';

const slideDown = {
  initial: {
    height: 0,
    opacity: 0,
  },
  visible: {
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
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 1,
      },
      opacity: {
        duration: 0.3,
      },
    },
  },
};

export default function HomeNewPostDropdown({
  userId,
  fromHomeSub,
  homeSubOpen,
  toggleHomeSubOpen,
  selectSubFromHome,
}) {
  const [userSubscriptions, setUserSubscriptions] = useState(null);

  // On mount if user is logged in fetches which subreddits they're
  // subscribed to, and sets these into state as array
  // for use in fetching relevant top posts for each
  useEffect(() => {
    const getMySubscriptions = async () => {
      if (userId) {
        const userSubscriptions = await getUserSubscriptions();
        setUserSubscriptions(userSubscriptions);
      }
    };
    getMySubscriptions();
  }, [userId]);

  // Sets selected subreddit from dropdown into parent-form's state
  const selectSub = (event) => {
    selectSubFromHome(event.target.value);
  };

  if (userSubscriptions) {
    return (
      <AnimatePresence mode="wait">
        <div className="select-sub">
          <button onClick={toggleHomeSubOpen} className="select-isOpen-btn">
            {!fromHomeSub ? 'Choose a community' : `r/${fromHomeSub}`}
            <i
              className={
                homeSubOpen
                  ? 'fa-solid fa-angle-down open'
                  : 'fa-solid fa-angle-down'
              }
            ></i>
          </button>
          {homeSubOpen && (
            <motion.div
              variants={slideDown}
              initial="initial"
              animate="visible"
              exit="exit"
              className="select-sub-dropdown"
            >
              {userSubscriptions.map((sub) => {
                return (
                  <button
                    onClick={selectSub}
                    className="select-sub-btn"
                    key={sub}
                    value={sub}
                  >
                    r/{sub}
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    );
  }
}
