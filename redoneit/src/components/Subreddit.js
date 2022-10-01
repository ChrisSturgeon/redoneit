import '../styles/Subreddit.css';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { onSnapshot, query, collection, doc } from 'firebase/firestore';

import SubredditHeader from './SubredditHeader';
import SubredditSidebar from './SubredditSidebar';
import Posts from './Posts';
import { db } from '../firebase';

export default function Subreddit() {
  const { subName } = useParams();
  const [overview, setOverview] = useState(null);
  const [posts, setPosts] = useState(null);

  // On render fetches subreddit overview info and sets it to overview state
  useEffect(() => {
    async function fetchSubData() {
      onSnapshot(doc(db, 'subreddits', `${subName}`), (doc) => {
        setOverview(doc.data());
      });
    }
    fetchSubData();
  }, []);

  // Subscribes to subreddit posts meta list on mount, compiles summaries
  // into array and stores this in state
  useEffect(() => {
    async function postsSub() {
      const queryRef = query(
        collection(db, 'subreddits', `${subName}`, 'posts')
      );
      onSnapshot(queryRef, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push(doc.data());
        });
        console.log(posts);
        setPosts(posts);
      });
    }
    postsSub();
  }, []);

  return (
    <div className="subreddit-main">
      {overview ? <SubredditHeader overview={overview} /> : null}
      <div className="subreddit-body">
        <div className="subreddit-content">
          <Posts />
          <SubredditSidebar />
        </div>
      </div>
    </div>
  );
}
