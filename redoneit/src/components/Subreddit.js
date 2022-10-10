import '../styles/Subreddit.css';

import React, { useState, useEffect } from 'react';
import { useParams, Route, Routes, Link } from 'react-router-dom';
import {
  onSnapshot,
  query,
  collection,
  doc,
  orderBy,
} from 'firebase/firestore';

import SubredditHeader from './SubredditHeader';
import SubredditSidebar from './SubredditSidebar';
import Post from './Post';
import { db } from '../firebase';

export default function Subreddit() {
  const { subName } = useParams();
  const [overview, setOverview] = useState(null);
  const [posts, setPosts] = useState(null);

  // On mount and url param change fetches subreddit overview data
  // and posts storing them to state
  useEffect(() => {
    async function fetchSubData() {
      onSnapshot(doc(db, 'subreddits', `${subName}`), (doc) => {
        setOverview(doc.data());
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
          console.log(doc.data());
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
        <SubredditHeader overview={overview} />
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
              </div>
              {posts
                ? posts.map((post) => {
                    return <Post key={post.id} data={post} />;
                  })
                : null}
            </div>
            <SubredditSidebar />
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
