import { initializeApp } from 'firebase/app';

// Firebase authentication imports
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

// Firestore imports
import {
  getFirestore,
  collection,
  query,
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
  onSnapshot,
  deleteDoc,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';

// Firebase configuration details
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

// Returns meta-data about signed in user
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

// Returns signed in users username
export const getUsersName = async (userId) => {
  const docRef = doc(db, 'users', `${userId}`);
  const docSnap = await getDoc(docRef);
  const userData = docSnap.data();

  if (docSnap.exists()) {
    return userData.username;
  } else {
    console.log('No such document');
  }
};

// Creates new user in firestore authentication
// and creates user collection doc with username and id
export async function registerNewUser(email, password, username) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      createProfile(user.uid, username);
    })
    // Error signing in
    .catch((error) => {
      console.log(`An error has occured: ${error.code}`, error.message);
    });
}

// Creates new profile for user in Firestore
async function createProfile(userId, username) {
  await setDoc(doc(db, 'users', `${userId}`), {
    uid: `${userId}`,
    username: `${username}`,
    karma: 0,
  });

  // Subscribe new user to default subreddits
  const technologyRef = doc(
    db,
    'users',
    `${userId}`,
    'subscribed',
    'technology'
  );
  await setDoc(technologyRef, {
    joined: new Date(),
    subName: 'technology',
  });

  const dogsRef = doc(db, 'users', `${userId}`, 'subscribed', 'dogs');
  await setDoc(dogsRef, {
    joined: new Date(),
    subName: 'dogs',
  });

  const learnProgrammingRef = doc(
    db,
    'users',
    `${userId}`,
    'subscribed',
    'learnprogramming'
  );
  await setDoc(learnProgrammingRef, {
    joined: new Date(),
    subName: 'learnprogramming',
  });
}

// Upvotes post storing user's ID in array of upvoters,
// increases karma of post by 1 and
// karma of user who posted by 1.
export async function upVotePost(subreddit, postId, postUser) {
  const currentUser = auth.currentUser.uid;
  const postUserRef = doc(db, 'users', `${postUser}`);
  const postRef = doc(db, 'subreddits', `${subreddit}`, 'posts', `${postId}`);

  const docSnap = await getDoc(postRef);
  const postData = docSnap.data();

  // Undo any previous downvote
  if (postData.downVotedBy.includes(currentUser)) {
    await updateDoc(postRef, {
      karma: increment(1),
      downVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(postUserRef, { karma: increment(1) });
  }

  // Upvote the comment
  if (postData.upVotedBy.includes(currentUser)) {
    await updateDoc(postRef, {
      karma: increment(-1),
      upVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(postUserRef, { karma: increment(-1) });
  } else {
    await updateDoc(postRef, {
      karma: increment(1),
      upVotedBy: arrayUnion(`${currentUser}`),
    });
    await updateDoc(postUserRef, { karma: increment(1) });
  }
}

// Downvotes post storing user's ID in array of downvoters,
// decreases karma of post by 1 and
// karma of user who posted by 1.
export async function downVotePost(subreddit, postId, postUser) {
  const currentUser = auth.currentUser.uid;
  const postUserRef = doc(db, 'users', `${postUser}`);
  const postRef = doc(db, 'subreddits', `${subreddit}`, 'posts', `${postId}`);

  const docSnap = await getDoc(postRef);
  const postData = docSnap.data();

  // Undo any previous upvotes
  if (postData.upVotedBy.includes(currentUser)) {
    await updateDoc(postRef, {
      karma: increment(-1),
      upVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(postUserRef, { karma: increment(-1) });
  }

  // Downvote the comment
  if (postData.downVotedBy.includes(currentUser)) {
    await updateDoc(postRef, {
      karma: increment(1),
      downVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(postUserRef, { karma: increment(1) });
  } else {
    await updateDoc(postRef, {
      karma: increment(-1),
      downVotedBy: arrayUnion(`${currentUser}`),
    });
    await updateDoc(postUserRef, { karma: increment(-1) });
  }
}

// Creates a new post in subreddits 'posts' collection with type URL,
// returning the id of the new post so user can be forwarded to it.
export async function newURLPost(title, url, subName) {
  const currentUser = auth.currentUser.uid;
  const userName = await getUserName(currentUser);

  const docRef = await addDoc(
    collection(db, 'subreddits', `${subName}`, 'posts'),
    {
      comments: 0,
      downVotedBy: [],
      karma: 0,
      posted: serverTimestamp(),
      subreddit: subName,
      title: title,
      type: 'link',
      upVotedBy: [],
      url: url,
      user: userName.username,
      userId: currentUser,
    }
  );
  return docRef.id;
}

// Creates a new post in subreddits 'posts' collection with type text,
// returning the id of the new post so user can be forwarded to it.
export async function newTextPost(title, postText, subName) {
  const currentUser = auth.currentUser.uid;
  const userName = await getUserName(currentUser);

  const docRef = await addDoc(
    collection(db, 'subreddits', `${subName}`, 'posts'),
    {
      comments: 0,
      downVotedBy: [],
      karma: 0,
      posted: serverTimestamp(),
      subreddit: subName,
      title: title,
      type: 'text',
      upVotedBy: [],
      postText: postText,
      user: userName.username,
      userId: currentUser,
    }
  );
  return docRef.id;
}

// Returns an array of the signed-in users subscribed subreddits
export async function getUserSubs() {
  const currentUser = auth.currentUser.uid;
  let subs = [];
  const q = query(collection(db, 'users', `${currentUser}`, 'subscribed'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    subs.push(doc.data());
  });

  return subs;
}

// Un-favourites a subreddit in user's profile
export async function favouriteSub(subName) {
  const currentUser = auth.currentUser.uid;
  const subRef = doc(db, 'users', `${currentUser}`, 'subscribed', `${subName}`);

  await updateDoc(subRef, {
    favourite: true,
  });
}

// Un-favourites a subreddit in user's profile
export async function unFavouriteSub(subName) {
  const currentUser = auth.currentUser.uid;
  const subRef = doc(db, 'users', `${currentUser}`, 'subscribed', `${subName}`);

  await updateDoc(subRef, {
    favourite: false,
  });
}

// Upvotes comment after checking user has not already upvoted.
// If they have already upvoted, removes upvote
export async function upVoteComment(
  subreddit,
  postId,
  commentId,
  commentUserId
) {
  const currentUser = auth.currentUser.uid;
  const commentUserRef = doc(db, 'users', `${commentUserId}`);
  const commentRef = doc(
    db,
    'subreddits',
    `${subreddit}`,
    'posts',
    `${postId}`,
    'comments',
    `${commentId}`
  );

  const docSnap = await getDoc(commentRef);
  const commentData = docSnap.data();

  // Reverse any previous downvote to to start afresh
  if (commentData.downVotedBy.includes(currentUser)) {
    await updateDoc(commentRef, {
      karma: increment(1),
      downVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(1) });
  }

  // Upvote comment
  if (commentData.upVotedBy.includes(currentUser)) {
    await updateDoc(commentRef, {
      karma: increment(-1),
      upVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(-1) });
  } else {
    await updateDoc(commentRef, {
      karma: increment(1),
      upVotedBy: arrayUnion(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(1) });
  }
}

// Downvotes comment after checking user has not already downvoted.
// If they have already downvoted, removes downvote
export async function downVoteComment(
  subreddit,
  postId,
  commentId,
  commentUserId
) {
  const currentUser = auth.currentUser.uid;
  const commentUserRef = doc(db, 'users', `${commentUserId}`);
  const commentRef = doc(
    db,
    'subreddits',
    `${subreddit}`,
    'posts',
    `${postId}`,
    'comments',
    `${commentId}`
  );

  const docSnap = await getDoc(commentRef);
  const commentData = docSnap.data();

  // Reverse any previous upvote to start afresh
  if (commentData.upVotedBy.includes(currentUser)) {
    await updateDoc(commentRef, {
      karma: increment(-1),
      upVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(-1) });
  }

  // Downvote comment
  if (commentData.downVotedBy.includes(currentUser)) {
    await updateDoc(commentRef, {
      karma: increment(1),
      downVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(1) });
  } else {
    await updateDoc(commentRef, {
      karma: increment(-1),
      downVotedBy: arrayUnion(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(-1) });
  }
}

// Stores comment in post's comment collection
// and increases post's comment count by 1.
export async function submitComment(subreddit, postId, commentText) {
  const currentUser = auth.currentUser.uid;
  const userName = await getUserName(currentUser);

  const commentRef = collection(
    db,
    'subreddits',
    `${subreddit}`,
    'posts',
    `${postId}`,
    'comments'
  );

  await addDoc(commentRef, {
    downVotedBy: [],
    karma: 0,
    posted: new Date(),
    text: commentText,
    upVotedBy: [],
    user: userName.username,
    userId: currentUser,
  });

  const postRef = doc(db, 'subreddits', `${subreddit}`, 'posts', `${postId}`);
  await updateDoc(postRef, { comments: increment(1) });
}

// Upvotes comment after checking user has not already upvoted.
// If they have already upvoted, removes upvote
export async function upVoteReply(
  subreddit,
  postId,
  commentId,
  replyId,
  replyUserId
) {
  const currentUser = auth.currentUser.uid;
  const commentUserRef = doc(db, 'users', `${replyUserId}`);
  const replyRef = doc(
    db,
    'subreddits',
    `${subreddit}`,
    'posts',
    `${postId}`,
    'comments',
    `${commentId}`,
    'replies',
    `${replyId}`
  );

  const docSnap = await getDoc(replyRef);
  const replyData = docSnap.data();

  // Reverse any previous downvote to to start afresh
  if (replyData.downVotedBy.includes(currentUser)) {
    await updateDoc(replyRef, {
      karma: increment(1),
      downVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(1) });
  }

  // Upvote comment
  if (replyData.upVotedBy.includes(currentUser)) {
    await updateDoc(replyRef, {
      karma: increment(-1),
      upVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(-1) });
  } else {
    await updateDoc(replyRef, {
      karma: increment(1),
      upVotedBy: arrayUnion(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(1) });
  }
}

// Downvotes comment after checking user has not already downvoted.
// If they have already downvoted, removes downvote
export async function downVoteReply(
  subreddit,
  postId,
  commentId,
  replyId,
  replyUserId
) {
  const currentUser = auth.currentUser.uid;
  const commentUserRef = doc(db, 'users', `${replyUserId}`);
  const replyRef = doc(
    db,
    'subreddits',
    `${subreddit}`,
    'posts',
    `${postId}`,
    'comments',
    `${commentId}`,
    'replies',
    `${replyId}`
  );

  const docSnap = await getDoc(replyRef);
  const replyData = docSnap.data();

  // Reverse any previous upvote to start afresh
  if (replyData.upVotedBy.includes(currentUser)) {
    await updateDoc(replyRef, {
      karma: increment(-1),
      upVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(-1) });
  }

  // Downvote comment
  if (replyData.downVotedBy.includes(currentUser)) {
    await updateDoc(replyRef, {
      karma: increment(1),
      downVotedBy: arrayRemove(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(1) });
  } else {
    await updateDoc(replyRef, {
      karma: increment(-1),
      downVotedBy: arrayUnion(`${currentUser}`),
    });
    await updateDoc(commentUserRef, { karma: increment(-1) });
  }
}

// Stores reply to comment in given comment's replies collection
// and increases post's comment count by 1
export async function commentReply(subreddit, postId, commentId, replyText) {
  const currentUser = auth.currentUser.uid;
  const userName = await getUserName(currentUser);

  const docRef = await addDoc(
    collection(
      db,
      'subreddits',
      `${subreddit}`,
      'posts',
      `${postId}`,
      'comments',
      `${commentId}`,
      'replies'
    ),
    {
      downVotedBy: [],
      karma: 0,
      posted: new Date(),
      upVotedBy: [],
      text: replyText,
      user: userName.username,
      userId: currentUser,
    }
  );

  const postRef = doc(db, 'subreddits', `${subreddit}`, 'posts', `${postId}`);
  await updateDoc(postRef, { comments: increment(1) });
}

// Adds user as member of subreddit and updates sub's member count by 1
export async function joinSub(subreddit) {
  const currentUser = auth.currentUser.uid;
  const subRef = doc(db, 'subreddits', `${subreddit}`, 'sidebar', 'about');
  await setDoc(
    doc(db, 'users', `${currentUser}`, 'subscribed', `${subreddit}`),
    {
      favourite: false,
      joined: new Date(),
      subName: subreddit,
    }
  );
  await updateDoc(subRef, {
    memberCount: increment(1),
  });
}

// Removes user as member of subreddit and decrements sub's member count by 1
export async function leaveSub(subreddit) {
  const currentUser = auth.currentUser.uid;
  const subRef = doc(db, 'subreddits', `${subreddit}`, 'sidebar', 'about');

  await deleteDoc(
    doc(db, 'users', `${currentUser}`, 'subscribed', `${subreddit}`)
  );
  await updateDoc(subRef, {
    memberCount: increment(-1),
  });
}

export async function getUserSubscriptions() {
  const currentUser = auth.currentUser.uid;
  let userSubs = [];
  const subsRef = query(
    collection(db, 'users', `${currentUser}`, 'subscribed')
  );

  const querySnapShot = await getDocs(subsRef);
  querySnapShot.forEach((doc) => {
    userSubs.push(doc.id);
  });

  return userSubs;
}

export async function getHomePosts() {
  const currentUser = auth.currentUser.uid;
  let userSubs = [];
  let homePosts = [];

  const subsRef = query(
    collection(db, 'users', `${currentUser}`, 'subscribed')
  );

  const querySnapShot = await getDocs(subsRef);
  querySnapShot.forEach((doc) => {
    userSubs.push(doc.id);
  });

  userSubs.forEach((subName) => {
    const queryRef = query(
      collection(db, 'subreddits', `${subName}`, 'posts'),
      orderBy('karma', 'desc'),
      limit(3)
    );
    onSnapshot(queryRef, (querySnapShot) => {
      querySnapShot.forEach((doc) => {
        const postData = doc.data();
        postData.id = doc.id;
        homePosts.push(postData);
      });
    });
  });
  return homePosts;
}

// Returns a randomised array for use with displaying posts on the homepage
export function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export async function createSub(
  userId,
  URL,
  displayName,
  primaryColour,
  secondaryColour,
  blurb,
  rules
) {
  await setDoc(doc(db, 'subreddits', `${URL}`), {
    subName: displayName,
    displayName: displayName,
    primaryColour: primaryColour,
    secondaryColour: secondaryColour,
  });

  const aboutRef = doc(db, 'subreddits', `${URL}`, 'sidebar', 'about');
  await setDoc(aboutRef, {
    blurb: blurb,
    created: new Date(),
    createdBy: userId,
    memberCount: 0,
  });

  const rulesRef = doc(db, 'subreddits', `${URL}`, 'sidebar', 'rules');
  await setDoc(rulesRef, {
    rulesArr: rules,
  });
}

export async function isOriginalURL(URL) {
  const subRef = doc(db, 'subreddits', `${URL}`);
  const sub = await getDoc(subRef);

  if (sub.exists()) {
    return false;
  } else {
    return true;
  }
}

export async function isOriginalName(name) {
  const nameQuery = query(
    collection(db, 'subreddits'),
    where('subName', '==', `${name}`)
  );

  let resultArr = [];
  const result = await getDocs(nameQuery);
  result.forEach((doc) => {
    resultArr.push(doc.data());
  });

  if (resultArr.length > 0) {
    return false;
  } else {
    return true;
  }
}

export async function getDefaultHomePosts() {
  console.log('Fetching posts...');
}
