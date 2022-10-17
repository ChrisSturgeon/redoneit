import './Home.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db, getUserSubscriptions } from '../../../firebase';
import { query, collection, getDocs, orderBy, limit } from 'firebase/firestore';
import HomePostsTable from './HomePostsTable/HomePostsTable';
import HomeSidebar from './HomeSidebar/HomeSideBar';

export default function Home({ userId, toggleLoginModal }) {
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
    <div className="home-main">
      <div className="home-content">
        <div className="home-posts">
          {userId ? (
            <div className="new-post-home">
              <Link to="r/home/submit?type=text" className="new-post-link">
                <input type="text" placeholder="Create Post"></input>
              </Link>
              <Link to="r/home/submit?type=link">
                <i className="fa-solid fa-link"></i>
              </Link>
            </div>
          ) : null}

          {homePosts ? (
            <HomePostsTable
              userId={userId}
              posts={homePosts}
              toggleLoginModal={toggleLoginModal}
            />
          ) : (
            <div>LOAFING</div>
          )}
        </div>

        <div>{userId ? <HomeSidebar userId={userId} /> : null}</div>
      </div>
    </div>
  );
}
