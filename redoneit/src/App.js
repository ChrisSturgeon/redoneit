import { initializeApp } from 'firebase/app';
import { onAuthStateChanged } from 'firebase/auth';

import { auth, getUserName } from '../src/firebase';

import NavBar from './components/NavBar';
import Home from './components/Home';
import Subreddit from './components/Subreddit';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  const testFunction = async () => {
    const legs = await getUserName(userId);
    console.log(legs);
  };

  // Monitors user authentication state
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      const getBasicInfo = async () => {
        const user = auth.currentUser;
        setUserId(user.uid);
        console.log(`${user.uid} has logged in`);
        const result = await getUserName(user.uid);
        setUsername(result.username);
        console.log(typeof result.username);
      };
      if (user) {
        getBasicInfo();
      } else {
        setUsername(null);
      }
    });
  }, []);

  return (
    <div>
      <NavBar userName={username} testFunction={testFunction} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="subreddit" element={<Subreddit />}></Route>
      </Routes>
    </div>
  );
}

export default App;
