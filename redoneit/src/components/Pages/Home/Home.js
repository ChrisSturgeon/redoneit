import './Home.css';
import PostOverview from '../../Posts/PostOverview/PostOverview';
import { useEffect, useState } from 'react';

import { auth, db } from '../../../firebase';
import {
  query,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';

export default function Home() {
  const [homePosts, setHomePosts] = useState(null);

  // On inital mount fetch the users subs
  // and put them into usersSubs state as array

  useEffect(() => {
    const getPosts = async () => {
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
      setHomePosts(homePosts);
    };
    getPosts();
  }, []);

  const testFunction = () => {
    console.log(homePosts);
  };

  return (
    <div className="main">
      <div>I'm the home page</div>
      <button onClick={testFunction}>Test</button>
      {homePosts
        ? homePosts.map((post) => {
            return <div>Hiya</div>;
          })
        : null}
      <div>Pleas worke</div>
    </div>
  );
}
