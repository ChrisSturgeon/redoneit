import './UserNavBox.css';
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function UserNavBox(props) {
  const [userKarma, setUserKarma] = useState();
  const [userName, setUsername] = useState();

  // Creates realtime listener to update user karma upon mount
  useEffect(() => {
    async function karmaSub() {
      onSnapshot(doc(db, 'users', `${props.userId}`), (doc) => {
        const data = doc.data();
        setUsername(data.username);
        setUserKarma(data.karma);
      });
    }
    karmaSub();
  }, [props.userId]);

  return (
    <button className="user-nav-box">
      <div className="username">{userName}</div>
      <div className="karma">{userKarma} karma</div>
    </button>
  );
}
