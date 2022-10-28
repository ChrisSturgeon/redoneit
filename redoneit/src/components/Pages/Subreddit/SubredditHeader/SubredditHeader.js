import './SubredditHeader.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db, joinSub, leaveSub } from '../../../../firebase';
import { doc, onSnapshot, collection, query } from 'firebase/firestore';
import Slider from './Slider/Slider';

export default function SubredditHeader({
  overview,
  primaryColour,
  secondaryColour,
  userId,
  toggleLoginModal,
  isMobile,
  showPosts,
  showSidebar,
}) {
  const { subName } = useParams();
  const [isMember, setIsMember] = useState(null);
  const [about, setAbout] = useState(null);

  // Subscribes user to subreddit, calling firebase helper function
  const joinSubreddit = async () => {
    if (userId) {
      await joinSub(subName);
    } else {
      toggleLoginModal();
    }
  };

  // On mount creates listener on 'about' document info from
  // firebase and sets it to 'about' state
  useEffect(() => {
    const getAbout = async () => {
      const docRef = doc(db, 'subreddits', `${subName}`, 'sidebar', 'about');
      const unsub = onSnapshot(docRef, (doc) => {
        const data = doc.data();
        setAbout(data);
      });
    };
    if (subName) {
    }
    getAbout();
  }, [subName]);

  // Test to check for collection
  useEffect(() => {
    const isSubscribed = async () => {
      if (userId) {
        const currentUser = auth.currentUser.uid;
        const queryRef = query(
          collection(db, 'users', `${currentUser}`, 'subscribed')
        );
        onSnapshot(queryRef, (QuerySnapshot) => {
          const data = QuerySnapshot.forEach((doc) => {
            if (doc.id === subName) {
              setIsMember(true);
            }
          });
        });
      }
    };
    isSubscribed();
  }, [isMember, subName, userId]);

  return (
    <div className="subreddit-header">
      <span className="upper" style={{ backgroundColor: primaryColour }}></span>
      <div className="lower">
        <div className="details-box">
          <div className="logo-box">
            <span style={{ backgroundColor: primaryColour }} className="logo">
              R
            </span>
          </div>
          <div className="text-info">
            <div className="display-name">{overview.displayName}</div>
            <div className="r-sub-name">r/{overview.subName}</div>
            {about && (
              <div className="member-count">{about.memberCount} members</div>
            )}
          </div>
          <div className="join-box">
            {isMember ? (
              <button
                onClick={async () => {
                  await leaveSub(subName);
                  setIsMember(false);
                }}
                style={{ backgroundColor: secondaryColour }}
              >
                Member!
              </button>
            ) : (
              <button
                onClick={joinSubreddit}
                style={{ backgroundColor: secondaryColour }}
              >
                Join
              </button>
            )}
          </div>
        </div>
        {isMobile && (
          <div>
            <Slider showPosts={showPosts} showSidebar={showSidebar} />
          </div>
        )}
      </div>
    </div>
  );
}
