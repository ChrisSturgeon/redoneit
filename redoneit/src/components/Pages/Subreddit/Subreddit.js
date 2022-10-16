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

import SubredditHeader from './SubredditHeader/SubredditHeader';
import SubredditSidebar from './SubredditSidebar/SubredditSidebar';
import PostOverview from '../../Posts/PostOverview/PostOverview';
import { db } from '../../../firebase';

export default function Subreddit() {
  const { subName } = useParams();
  const [overview, setOverview] = useState(null);
  const [posts, setPosts] = useState(null);
  const [primaryColour, setPrimaryColour] = useState(null);
  const [secondaryColour, setSecondaryColour] = useState(null);

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

  const testFunction = () => {
    console.log(posts);
  };

  if (overview) {
    return (
      <div className="subreddit-main">
        <SubredditHeader
          overview={overview}
          primaryColour={primaryColour}
          secondaryColour={secondaryColour}
        />
        <div className="subreddit-body">
          <div className="subreddit-content">
            <div className="subreddit-posts">
              <div className="new-post">
                <Link to="submit?type=text" className="new-post-link">
                  <input type="text" placeholder="Create Post"></input>
                </Link>
                <Link to="submit?type=link">
                  <i className="fa-solid fa-link"></i>
                </Link>
                <button onClick={() => testFunction()}>Test</button>
              </div>
              {posts
                ? posts.map((post) => {
                    return (
                      <PostOverview
                        postId={post.id}
                        subName={subName}
                        key={post.id}
                      />
                    );
                  })
                : null}
            </div>
            <SubredditSidebar
              primaryColour={primaryColour}
              secondaryColour={secondaryColour}
            />
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
