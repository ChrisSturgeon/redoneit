import './SubsNav.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SubNavLink from '../SubNavigationLink/SubNavLink';
import { onSnapshot, query, collection } from 'firebase/firestore';
import { db, auth } from '../../../firebase';

export default function SubsNav(props) {
  const [subsArr, setSubsArr] = useState(null);

  // On mount establishes listener for users
  // subreddit subscriptions and sets to state
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
    <div className="subs-nav">
      <div className="all-subs-link">
        <Link onClick={props.toggleSubsNav} className="all-subs-btn" to="r">
          View all subreddits
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
    </div>
  );
}
