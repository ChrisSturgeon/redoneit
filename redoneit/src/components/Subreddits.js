import '../styles/Subreddits.css';
import React, { useEffect, useState } from 'react';
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

import SubredditsTable from './SubredditsTable';

export default function Subreddits() {
  const [subreddits, setSubreddits] = useState(null);

  // Subscribes to subreddits meta list on mount, compiles summaries
  // into array and stores this in state
  useEffect(() => {
    async function subredditSub() {
      const queryRef = query(collection(db, 'subreddits'));
      onSnapshot(queryRef, (querySnapshot) => {
        const summaries = [];
        querySnapshot.forEach((doc) => {
          summaries.push(doc.data());
          console.log(doc.data());
        });
        console.log('dog');
        setSubreddits(summaries);
      });
    }
    subredditSub();
  }, []);

  return (
    <div className="main">
      {subreddits ? <SubredditsTable subreddits={subreddits} /> : null}
    </div>
  );
}
