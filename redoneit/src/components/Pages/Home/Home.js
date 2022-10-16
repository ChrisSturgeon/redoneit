import './Home.css';
import React, { useEffect, useState } from 'react';

import { db, getUserSubscriptions } from '../../../firebase';
import { query, collection, getDocs, orderBy, limit } from 'firebase/firestore';
import HomePostsTable from './HomePostsTable/HomePostsTable';

export default function Home({ userId }) {
  const [userSubscriptions, setUserSubscriptions] = useState(null);
  const [homePosts, setHomePosts] = useState([]);

  useEffect(() => {
    const getMySubscriptions = async () => {
      if (userId) {
        const userSubscriptions = await getUserSubscriptions();
        setUserSubscriptions(userSubscriptions);
      }
    };
    getMySubscriptions();
  }, [userId]);

  useEffect(() => {
    const getHomePosts = async () => {
      if (userSubscriptions) {
        userSubscriptions.forEach(async (subName) => {
          const queryRef = query(
            collection(db, 'subreddits', `${subName}`, 'posts'),
            orderBy('karma', 'desc'),
            limit(3)
          );
          const querySnapshot = await getDocs(queryRef);
          querySnapshot.forEach((doc) => {
            const postData = doc.data();
            postData.id = doc.id;
            setHomePosts((prevPosts) => prevPosts.concat(postData));
          });
        });
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
    </div>
  );
}
