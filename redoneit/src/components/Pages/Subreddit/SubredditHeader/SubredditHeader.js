import './SubredditHeader.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db, joinSub, leaveSub } from '../../../../firebase';
import { onSnapshot, collection, query } from 'firebase/firestore';
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
  const [memberCount, setMemberCount] = useState(null);

  const joinSubreddit = async () => {
    if (userId) {
      await joinSub(subName);
    } else {
      toggleLoginModal();
    }
  };

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
            <div className="member-count">{overview.memberCount} members</div>
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
