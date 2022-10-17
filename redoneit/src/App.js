import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

// User authentication and data
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserName, db } from '../src/firebase';
import { onSnapshot, doc } from 'firebase/firestore';

// Components
import NavBar from './components/Navigation/Navbar/NavBar';
import Home from './components/Pages/Home/Home';
import Subreddit from './components/Pages/Subreddit/Subreddit';
import AllSubreddits from './components/Pages/AllSubreddits/AllSubreddits';
import NewPostForm from './components/Posts/NewPostForm/NewPostForm';
import PostDetail from './components/Posts/PostDetail/PostDetail';

function App() {
  const [userId, setUserId] = useState(false);
  const [username, setUsername] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Toggles login modal open/closed
  const toggleLoginModal = () => {
    setLoginModalOpen(!loginModalOpen);
  };

  // Creates listener for users authentication state upon mount
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      const getBasicInfo = async () => {
        const user = auth.currentUser;
        setUserId(auth.currentUser.uid);
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
        userData={userData}
        loginModalOpen={loginModalOpen}
        toggleLoginModal={toggleLoginModal}
      />
      <Routes>
        <Route
          path="/"
          element={<Home userId={userId} toggleLoginModal={toggleLoginModal} />}
        ></Route>
        <Route path="r/" element={<AllSubreddits />}></Route>
        <Route
          path="r/:subName"
          element={
            <Subreddit userId={userId} toggleLoginModal={toggleLoginModal} />
          }
        ></Route>
        <Route
          path="r/:subName/submit"
          element={
            <NewPostForm userId={userId} toggleLoginModal={toggleLoginModal} />
          }
        ></Route>
        <Route
          path="r/:subName/post/:postId"
          element={
            <PostDetail
              userId={userId}
              username={username}
              toggleLoginModal={toggleLoginModal}
            />
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
