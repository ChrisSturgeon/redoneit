import './UserNavBox.css';
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function UserNavBox(props) {
  const [userKarma, setUserKarma] = useState();
  const [userName, setUsername] = useState();

  // On mount sets listener to update user's karma in realtime
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
    <div className="user-nav-box">
      <div className="username">{userName}</div>
      <div className="karma">{userKarma} karma</div>
    </div>
  );
}
