import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  getRdirectResult,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import {
  getFirestore,
  collection,
  query,
  where,
  get,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';

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
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export function authChange() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      user = auth.currentUser;
      console.log(`${user.displayName} has logged in`);
    } else {
      console.log('No user logged in');
    }
  });
}

export const getUserName = async (userId) => {
  const docRef = doc(db, 'users', `${userId}`);
  const docSnap = await getDoc(docRef);
  const userData = docSnap.data();

  if (docSnap.exists()) {
    return userData;
  } else {
    console.log('No such document');
  }
};

async function createProfile(userId, username) {
  await setDoc(doc(db, 'users', `${userId}`), {
    uid: `${userId}`,
    username: `${username}`,
  });
}

// Creates new user in firestore authentication
// and creates user collection doc with username and id
export async function registerNewUser(email, password, username) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      createProfile(user.uid, username);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}
