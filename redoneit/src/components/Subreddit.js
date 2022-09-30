import '../styles/Subreddit.css';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SubredditHeader from './SubredditHeader';
import SubredditComments from './SubredditComments';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Subreddit() {
  const { subName } = useParams();
  const [overview, setOverview] = useState(null);

  // On render fetches subreddit overview info and sets it to overview state
  useEffect(() => {
    async function fetchSubData() {
      onSnapshot(doc(db, 'subreddits', `${subName}`), (doc) => {
        setOverview(doc.data());
      });
    }
    fetchSubData();
  }, []);

  return (
    <div className="subreddit-main">
      {overview ? <SubredditHeader overview={overview} /> : null}
      <SubredditComments />
    </div>
  );
}
