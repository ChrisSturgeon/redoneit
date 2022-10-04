import '../styles/SubsNav.css';
import React, { useEffect, useState } from 'react';
import { auth, getUserSubs } from '../firebase';
import { Link, Redirect } from 'react-router-dom';

export default function SubsNav(props) {
  const [subsArr, setSubsArr] = useState(null);
  // On navbar mount fetches users subs and sets them to state for rendering
  useEffect(() => {
    const setSubs = async () => {
      const subsArr = await getUserSubs();
      setSubsArr(subsArr);
    };
    setSubs();
  }, []);

  return (
    <div>
      I'm the subs array
      {/* {subsArr ? (
        <div>
          {subsArr.map((sub) => {
            const linkString = `r/${sub.subName}`;
            return (
              <div key={sub.subName}>
                <Link to={linkString}>{sub.subName}</Link>
              </div>
            );
          })}
        </div>
      ) : null} */}
      <ul>
        <Link to="r/technology">Technology</Link>
        <Link to="r/learnprogramming">learnprogramming</Link>
      </ul>
    </div>
  );
}
