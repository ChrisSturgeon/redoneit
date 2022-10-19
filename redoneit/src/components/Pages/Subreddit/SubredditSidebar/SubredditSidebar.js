import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns';
import { db } from '../../../../firebase';
import './SubredditSidebar.css';

export default function SubredditSidebar({ primaryColour, secondaryColour }) {
  const { subName } = useParams();
  const [about, setAbout] = useState(null);
  const [rules, setRules] = useState(null);
  const [createdString, setCreatedString] = useState(null);

  // On mount creates listener on 'about' document info from
  // firebase and sets it to 'about' state
  useEffect(() => {
    const getAbout = async () => {
      const docRef = doc(db, 'subreddits', `${subName}`, 'sidebar', 'about');
      const unsub = onSnapshot(docRef, (doc) => {
        const data = doc.data();
        setAbout(data);
        setCreatedString(
          format(new Date(data.created.seconds * 1000), 'MMM dd, yyyy')
        );
      });
    };
    getAbout();
  }, [subName]);

  // On mount fetches subreddit rules once and sets them to rules state
  useEffect(() => {
    const getRules = async () => {
      const docRef = doc(db, 'subreddits', `${subName}`, 'sidebar', 'rules');
      const unsub = onSnapshot(docRef, (doc) => {
        try {
          setRules(doc.data().rulesArr);
        } catch (error) {
          setRules(null);
          console.log('An error has occured:', error);
        }
      });
    };
    getRules();
  }, [subName]);

  if (about && rules) {
    return (
      <div className="subreddit-sidebar">
        <div className="sidebar-about">
          <div
            className="sidebar-about-header"
            style={{ backgroundColor: primaryColour }}
          >
            <h1>About Community</h1>
          </div>
          <div className="sidebar-about-body">
            <div className="sidebar-about-blurb">{about.blurb}</div>
            <div className="sidebar-about-created">
              <i className="fa-solid fa-cake-candles"></i>Created{' '}
              {createdString}
            </div>
            <hr></hr>
            <div className="sidebar-members-count">
              <div>{about.memberCount}</div>

              <div>members</div>
            </div>
            <hr></hr>
            <Link to={`/r/${subName}/submit`}>
              <button style={{ backgroundColor: secondaryColour }}>
                Create Post
              </button>
            </Link>
          </div>
        </div>

        {rules[0].length > 0 ? (
          <div className="sidebar-rules">
            <div
              className="sidebar-rules-header"
              style={{ backgroundColor: primaryColour }}
            >
              <h1>Rules</h1>
            </div>
            <div className="sidebar-rules-body">
              {rules.map((rule, index) => {
                if (index < rules.length - 1) {
                  if (rule.length > 0) {
                    return (
                      <div key={index}>
                        {index + 1}. {rule}
                        <hr></hr>
                      </div>
                    );
                  }
                } else {
                  if (rule.length > 0) {
                    return (
                      <div key={index}>
                        {index + 1}. {rule}
                        <hr></hr>
                      </div>
                    );
                  }
                }
              })}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
