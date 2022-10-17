import './Home.css';
import React, { useEffect, useState } from 'react';
import { db, getUserSubscriptions } from '../../../firebase';
import { query, collection, getDocs, orderBy, limit } from 'firebase/firestore';
import HomePostsTable from './HomePostsTable/HomePostsTable';

export default function Home({ userId }) {
  const [userSubscriptions, setUserSubscriptions] = useState(null);
  const [homePosts, setHomePosts] = useState([]);

  // On mount if user is logged in fetches which subreddits they're
  // subscribed to, and sets these into state as array
  // for use in fetching relevant top posts for each
  useEffect(() => {
    const getMySubscriptions = async () => {
      if (userId) {
        const userSubscriptions = await getUserSubscriptions();
        setUserSubscriptions(userSubscriptions);
      }
    };
    getMySubscriptions();
  }, [userId]);

  // If user is logged in, fetches the three highest-karma posts for each
  // of their subscribed subreddits, and stores these as array in state
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

  return (
    <div className="main">
      <div>I'm the home page</div>
      {homePosts ? <HomePostsTable posts={homePosts} /> : null}
    </div>
  );
}
