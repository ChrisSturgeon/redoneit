import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

// User authentication and data
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserName, db } from '../src/firebase';
import { onSnapshot, doc } from 'firebase/firestore';

// Components
import NavBar from './components/NavBar';
import Home from './components/Home';
import Subreddit from './components/Subreddit';
import Subreddits from './components/Subreddits';
import PostForm from './components/postForm';
import PostDetail from './components/PostDetail/PostDetail';

function App() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [userData, setUserData] = useState(null);

  const testFunction = async () => {
    const legs = await getUserName(userId);
  };

  // Monitors user authentication state
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      const getBasicInfo = async () => {
        const user = auth.currentUser;
        setUserId(user.uid);
        const result = await getUserName(user.uid);
        setUsername(result.username);
        console.log(`${result.username} signed in!`);
      };
      if (user) {
        getBasicInfo();
      } else {
        setUsername(null);
        console.log('signed out');
      }
    });
  }, []);

  // Listener for changes to user data
  useEffect(() => {
    const subUserData = (userId) => {
      onSnapshot(doc(db, 'users', `${userId}`), (doc) => {
        setUserData(doc.data());
      });
    };
    subUserData(userId);
  }, [userId]);

  return (
    <div>
      <NavBar
        userId={userId}
        userName={username}
        testFunction={testFunction}
        userData={userData}
      />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="r/" element={<Subreddits />}></Route>
        <Route path="r/:subName" element={<Subreddit />}></Route>
        <Route path="r/:subName/submit" element={<PostForm />}></Route>
        <Route path="r/:subName/post/:postId" element={<PostDetail />}></Route>
      </Routes>
    </div>
  );
}

export default App;
