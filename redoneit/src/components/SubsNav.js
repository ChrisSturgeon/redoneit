import '../styles/SubsNav.css';
import React, { useEffect, useState } from 'react';
import { getUserSubs } from '../firebase';
import { Link } from 'react-router-dom';
import SubNavLink from './SubNavLink';
import {
  onSnapshot,
  query,
  collection,
  doc,
  orderBy,
  QuerySnapshot,
} from 'firebase/firestore';

import { db, auth } from '../firebase';

export default function SubsNav(props) {
  const [subsArr, setSubsArr] = useState(null);

  // On navbar mount fetches users subs and sets them to state for rendering
  // useEffect(() => {
  //   const setSubs = async () => {
  //     const subsArr = await getUserSubs();
  //     setSubsArr(subsArr);
  //   };
  //   setSubs();
  // }, []);

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
    <div>
      <Link className="all-subs-nav" to="r">
        View all subs
      </Link>
      <hr></hr>
      <div>Your subs</div>

      {subsArr ? (
        <div>
          {subsArr.map((sub) => {
            const linkString = `r/${sub.subName}`;
            return (
              <SubNavLink
                key={sub.subName}
                subName={sub.subName}
                onClick={props.toggleSubNav}
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
