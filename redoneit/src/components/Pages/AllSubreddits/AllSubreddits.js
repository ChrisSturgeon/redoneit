import './AllSubreddits.css';
import React, { useEffect, useState } from 'react';
import { onSnapshot, query, collection } from 'firebase/firestore';
import { db } from '../../../firebase';

import SubredditsTable from './AllSubredditsTable/SubredditsTable';

export default function AllSubreddits() {
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
        });
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
