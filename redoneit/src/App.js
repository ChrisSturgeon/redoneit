import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserName } from '../src/firebase';

import NavBar from './components/NavBar';
import Home from './components/Home';

import { Route, Routes } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import Subreddit from './components/Subreddit';
import Subreddits from './components/Subreddits';

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

        const result = await getUserName(user.uid);
        setUsername(result.username);
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
      <NavBar userId={userId} userName={username} testFunction={testFunction} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="r" element={<Subreddits />}></Route>
        <Route path="r/:subName" element={<Subreddit />}></Route>
      </Routes>
    </div>
  );
}

export default App;
