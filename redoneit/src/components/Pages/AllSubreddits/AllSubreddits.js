import './AllSubreddits.css';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot, query, collection } from 'firebase/firestore';
import { db, getAllSubs, getSubsNames } from '../../../firebase';
import { format } from 'date-fns';

export default function AllSubreddits() {
  const [subsNames, setSubsNames] = useState(null);
  const [subsData, setSubsData] = useState([]);

  useEffect(() => {
    const getNames = async () => {
      const names = await getSubsNames();
      setSubsNames(names);
    };
    getNames();
  }, []);

  useEffect(() => {
    const getAboutData = async () => {
      setSubsData([]);
      subsNames.forEach(async (sub) => {
        let subInfo = { ...sub };
        const subRef = doc(
          db,
          'subreddits',
          `${sub.subName}`,
          'sidebar',
          'about'
        );
        const aboutData = await getDoc(subRef);
        // if (aboutData.exists()) {
        //   console.log(aboutData.data());
        // } else {
        //   console.log('Data missing');
        // }
        // console.log(subInfo);
        subInfo.about = { ...aboutData.data() };
        setSubsData((prevData) => prevData.concat(subInfo));
      });
    };
    if (subsNames) {
      getAboutData();
    }
  }, [subsNames]);

  return (
    <div className="all-subs-body">
      {subsData && (
        <div className="all-subs-step">
          <button onClick={() => console.log(subsNames)}>Click</button>
          <table className="all-subs-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Members</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {subsData.map((sub) => {
                let createdString;
                if (sub.about.created) {
                  createdString = format(
                    new Date(sub.about.created.seconds * 1000),
                    'MMM yy'
                  );
                }

                return (
                  <tr key={sub.subName}>
                    <td>{sub.displayName}</td>
                    <td>{sub.about.memberCount}</td>
                    {createdString ? (
                      <td>{createdString}</td>
                    ) : (
                      <td>Missing</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
