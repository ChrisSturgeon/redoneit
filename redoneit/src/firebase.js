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
  increment,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  serverTimestamp,
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
let user = auth.currentUser;
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export function authChange() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      user = auth.currentUser;
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
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

/* Increments or decrements post karma by 1. If user has
already upvoted or downvoted,
undos this. Stores record of their vote in both the
post document and user documents arrays
*/
export async function postVote(subreddit, postUser, postId, direction) {
  const currentUser = auth.currentUser.uid;
  const currentUserRef = doc(db, 'users', `${currentUser}`);
  const postUserRef = doc(db, 'users', `${postUser}`);
  const postRef = doc(db, 'subreddits', `${subreddit}`, 'posts', `${postId}`);

  const docSnap = await getDoc(postRef);
  const postData = docSnap.data();

  if (direction === 'upVote') {
    if (!postData.upVotedBy.includes(currentUser)) {
      await updateDoc(postUserRef, { karma: increment(1) });
      await updateDoc(postRef, { karma: increment(1), upVotes: increment(1) });
      await updateDoc(postRef, { upVotedBy: arrayUnion(`${currentUser}`) });
      await updateDoc(currentUserRef, { upVoted: arrayUnion(`${postId}`) });
    } else {
      await updateDoc(postUserRef, { karma: increment(-1) });
      await updateDoc(postRef, {
        karma: increment(-1),
        upVotes: increment(-1),
      });
      await updateDoc(postRef, { upVotedBy: arrayRemove(`${currentUser}`) });
      await updateDoc(currentUserRef, { upVoted: arrayRemove(`${postId}`) });
    }
  } else if (direction === 'downVote') {
    if (!postData.downVotedBy.includes(currentUser)) {
      await updateDoc(postUserRef, { karma: increment(-1) });
      await updateDoc(postRef, {
        karma: increment(-1),
        upVotes: increment(-1),
      });
      await updateDoc(postRef, { downVotedBy: arrayUnion(`${currentUser}`) });
      await updateDoc(currentUserRef, { downVoted: arrayUnion(`${postId}`) });
    } else {
      await updateDoc(postUserRef, { karma: increment(1) });
      await updateDoc(postRef, { karma: increment(1), upVotes: increment(1) });
      await updateDoc(postRef, { downVotedBy: arrayRemove(`${currentUser}`) });
      await updateDoc(currentUserRef, { downVoted: arrayRemove(`${postId}`) });
    }
  }
}

export async function newURLPost(title, url, subName) {
  const currentUser = auth.currentUser.uid;
  const userName = await getUserName(currentUser);

  const docRef = await addDoc(
    collection(db, 'subreddits', `${subName}`, 'posts'),
    {
      downVotedBy: [],
      downVotes: 0,
      karma: 0,
      posted: serverTimestamp(),
      subreddit: subName,
      title: title,
      type: 'link',
      upVotedBy: [],
      upVotes: 0,
      url: url,
      user: userName.username,
      userId: currentUser,
    }
  );
  console.log(docRef.id);
}

export async function newTextPost(title, postText, subName) {
  const currentUser = auth.currentUser.uid;
  const userName = await getUserName(currentUser);

  const docRef = await addDoc(
    collection(db, 'subreddits', `${subName}`, 'posts'),
    {
      downVotedBy: [],
      downVotes: 0,
      karma: 0,
      posted: serverTimestamp(),
      subreddit: subName,
      title: title,
      type: 'text',
      upVotedBy: [],
      upVotes: 0,
      postText: postText,
      user: userName.username,
      userId: currentUser,
    }
  );
  console.log(docRef.id);
}

export async function getUserSubs(userId) {
  const currentUser = auth.currentUser.uid;
  let subs = [];
  const q = query(collection(db, 'users', `${currentUser}`, 'subscribed'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    subs.push(doc.data());
  });

  return subs;
}
