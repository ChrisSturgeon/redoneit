import './Subreddit.css';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  onSnapshot,
  query,
  collection,
  doc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../../firebase';

// Component imports
import SubredditHeader from './SubredditHeader/SubredditHeader';
import SubredditSidebar from './SubredditSidebar/SubredditSidebar';
import PostOverview from '../../Posts/PostOverview/PostOverview';
import CopiedMessage from './CopiedMessage/CopiedMessage';

const isMobileUser = () => window.innerWidth <= 768;

export default function Subreddit({ userId, toggleLoginModal }) {
  const { subName } = useParams();
  const [overview, setOverview] = useState(null);
  const [posts, setPosts] = useState(null);
  const [primaryColour, setPrimaryColour] = useState(null);
  const [secondaryColour, setSecondaryColour] = useState(null);
  const [isMobile, setIsMobileUser] = useState(isMobileUser());
  const [displayPosts, setDisplayPosts] = useState(true);
  const [displaySidebar, setDisplaySidebar] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const sharePost = async (postId) => {
    navigator.clipboard.writeText(
      `http://localhost:3000/r/learnprogramming/post/${postId}`
    );
    setCopiedMessage(!copiedMessage);
    setTimeout(() => {
      setCopiedMessage(false);
    }, 2000);
  };

  const showPosts = () => {
    if (!displayPosts) {
      setDisplayPosts(true);
      setDisplaySidebar(false);
    }
  };

  const showSidebar = () => {
    if (!displaySidebar) {
      setDisplayPosts(false);
      setDisplaySidebar(true);
    }
  };

  useEffect(() => {
    const onResize = () => {
      setIsMobileUser(isMobileUser);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [isMobile]);

  // On mount and url param change fetches subreddit overview data
  // and posts storing them to state
  useEffect(() => {
    async function fetchSubData() {
      onSnapshot(doc(db, 'subreddits', `${subName}`), (doc) => {
        setOverview(doc.data());
        setPrimaryColour(doc.data().primaryColour);
        setSecondaryColour(doc.data().secondaryColour);
      });
    }

    async function postsSub() {
      const queryRef = query(
        collection(db, 'subreddits', `${subName}`, 'posts'),
        orderBy('karma', 'desc')
      );
      onSnapshot(queryRef, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          posts.push(data);
        });
        setPosts(posts);
      });
    }
    fetchSubData();
    postsSub();
  }, [subName]);

  if (overview) {
    return (
      <div className="subreddit-main">
        <SubredditHeader
          overview={overview}
          primaryColour={primaryColour}
          secondaryColour={secondaryColour}
          userId={userId}
          toggleLoginModal={toggleLoginModal}
          isMobile={isMobile}
          showPosts={showPosts}
          showSidebar={showSidebar}
        />
        <div className="subreddit-body">
          <div className="subreddit-content">
            {displayPosts ? (
              <div className="subreddit-posts">
                <div className="new-post">
                  <Link to="submit?type=text" className="new-post-link">
                    <input type="text" placeholder="Create Post"></input>
                  </Link>
                  <Link to="submit?type=link">
                    <i className="fa-solid fa-link"></i>
                  </Link>
                </div>
                {posts
                  ? posts.map((post) => {
                      return (
                        <PostOverview
                          postId={post.id}
                          subName={subName}
                          key={post.id}
                          userId={userId}
                          toggleLoginModal={toggleLoginModal}
                          sharePost={sharePost}
                        />
                      );
                    })
                  : null}

                <CopiedMessage
                  isVisible={copiedMessage}
                  backgroundColour={secondaryColour}
                />
              </div>
            ) : null}

            {displaySidebar ? (
              <SubredditSidebar
                primaryColour={primaryColour}
                secondaryColour={secondaryColour}
              />
            ) : null}

            {!isMobile ? (
              <SubredditSidebar
                primaryColour={primaryColour}
                secondaryColour={secondaryColour}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="subreddit-loading">
        <div className="lds-dual-ring"></div>
      </div>
    );
  }
}
