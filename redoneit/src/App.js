import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';

import NavBar from './components/NavBar';
import Home from './components/Home';
import Subreddit from './components/Subreddit';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBsSKDADU0vsj2G9o86aWhdfK0IMfnY9vw',
  authDomain: 'redoneit-a0b8a.firebaseapp.com',
  projectId: 'redoneit-a0b8a',
  storageBucket: 'redoneit-a0b8a.appspot.com',
  messagingSenderId: '228238352372',
  appId: '1:228238352372:web:a73231cae59165963323a1',
};

// Firebase constants
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

onAuthStateChanged(auth, (user) => {
  if (user) {
    user = auth.currentUser;
    console.log('User logged in!');
  } else {
    console.log('o auth user signed out');
  }
});

function signGoogleUserIn() {
  signInWithRedirect(auth, provider);
}

function test() {
  const user = getAuth(app).currentUser;
  console.log(user.email);
  console.log(user.displayName);
  console.log(user.uid);
  console.log(user.emailVerified);
}

// getRedirectResult(auth)
//   .then((result) => {
//     // This gives you a Google Access Token. You can use it to access Google APIs.
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;

//     // The signed-in user info.
//     const user = result.user;
//   })
//   .catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.customData.email;
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     // ...
//   });

function signOutUser() {
  signOut(auth);
}

function App() {
  return (
    <div>
      <NavBar
        signInUser={signGoogleUserIn}
        signOutUser={signOutUser}
        test={test}
      />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="subreddit" element={<Subreddit />}></Route>
      </Routes>
    </div>
  );
}

export default App;
