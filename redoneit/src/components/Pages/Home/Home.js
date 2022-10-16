import './Home.css';
import PostOverview from '../../Posts/PostOverview/PostOverview';
import React, { useEffect, useState } from 'react';

import {
  auth,
  db,
  getHomePosts,
  getUserSubscriptions,
} from '../../../firebase';
import {
  query,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import HomePostsTable from './HomePostsTable/HomePostsTable';

export default function Home() {
  const [userSubscriptions, setUserSubscriptions] = useState(null);
  const [homePosts, setHomePosts] = useState([]);

  // On inital mount fetch the users subs
  // and put them into usersSubs state as array

  // useEffect(() => {
  //   const getPosts = async () => {
  //     const currentUser = auth.currentUser.uid;
  //     let userSubs = [];
  //     let homePosts = [];

  //     const subsRef = query(
  //       collection(db, 'users', `${currentUser}`, 'subscribed')
  //     );

  //     const querySnapShot = await getDocs(subsRef);
  //     querySnapShot.forEach((doc) => {
  //       userSubs.push(doc.id);
  //     });

  //     userSubs.forEach((subName) => {
  //       const queryRef = query(
  //         collection(db, 'subreddits', `${subName}`, 'posts'),
  //         orderBy('karma', 'desc'),
  //         limit(3)
  //       );
  //       onSnashot(queryRef, (querySnapShot) => {
  //         querySnapShot.forEach((doc) => {
  //           const postData = doc.data();
  //           postData.id = doc.id;
  //           homePosts.push(postData);
  //         });
  //       });
  //     });
  //     setHomePosts(homePosts);
  //   };
  //   getPosts();
  // }, []);

  useEffect(() => {
    const getMySubscriptions = async () => {
      const userSubscriptions = await getUserSubscriptions();
      setUserSubscriptions(userSubscriptions);
    };
    getMySubscriptions();
  }, []);

  useEffect(() => {
    const getHomePosts = async () => {
      let posts = [];
      if (userSubscriptions) {
        userSubscriptions.forEach(async (subName) => {
          const subData = [];
          const queryRef = query(
            collection(db, 'subreddits', `${subName}`, 'posts'),
            orderBy('karma', 'desc'),
            limit(3)
          );

          const querySnapshot = await getDocs(queryRef);
          querySnapshot.forEach((doc) => {
            const postData = doc.data();
            postData.id = doc.id;
            // posts.push(postData);
            // subData.push(postData);
            setHomePosts((prevPosts) => prevPosts.concat(postData));
          });

          // console.log(subData);
          // posts.concat(subData);
          // console.log(posts);
          // setHomePosts((prevPosts) => prevPosts.concat(subData));
        });
        // setHomePosts(posts);
      }
    };
    getHomePosts();
  }, [userSubscriptions]);

  const testFunction = async () => {
    console.log(homePosts);
  };

  return (
    <div className="main">
      <div>I'm the home page</div>
      <button onClick={testFunction}>Test</button>
      {homePosts ? <HomePostsTable posts={homePosts} /> : null}
      {/* {homePosts
        ? homePosts.map((post) => {
            return (
              <PostOverview
                key={post.id}
                postId={post.id}
                subName={post.subreddit}
                homePost={true}
              />
            );
          })
        : null} */}
    </div>
  );
}
