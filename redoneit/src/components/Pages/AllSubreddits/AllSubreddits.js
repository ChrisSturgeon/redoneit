import './AllSubreddits.css';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot, query, collection } from 'firebase/firestore';
import { db, getAllSubs, getSubsNames } from '../../../firebase';

import SubredditsTable from './AllSubredditsTable/SubredditsTable';

export default function AllSubreddits() {
  const [subsNames, setSubsNames] = useState(null);
  const [subsData, setSubsData] = useState([]);

  // Subscribes to subreddits meta list on mount, compiles summaries
  // into array and stores this in state
  // useEffect(() => {
  //   async function subredditSub() {
  //     const queryRef = query(collection(db, 'subreddits'));
  //     onSnapshot(queryRef, (querySnapshot) => {
  //       const summaries = [];
  //       querySnapshot.forEach((doc) => {
  //         summaries.push(doc.data());
  //       });
  //       setSubreddits(summaries);
  //     });
  //   }
  //   subredditSub();
  //   console.log(subreddits);
  // }, []);

  // useEffect(() => {
  //   const getSubsData = async () => {
  //     const data = await getAllSubs();
  //     setSubsData(data);
  //     console.log(data);
  //   };
  //   getSubsData();
  // }, []);

  useEffect(() => {
    const getNames = async () => {
      const names = await getSubsNames();
      setSubsNames(names);
      // console.log(names);
    };
    getNames();
  }, []);

  useEffect(() => {
    const getAboutData = async () => {
      subsNames.forEach(async (sub) => {
        let subInfo = { ...sub };
        let prevData = [...subsData];
        console.log(sub.subName);
        const subRef = doc(
          db,
          'subreddits',
          `${sub.subName}`,
          'sidebar',
          'about'
        );
        const aboutData = await getDoc(subRef);

        // console.log(subInfo);
        subInfo.about = aboutData.data();
        // console.log(subInfo);
        const dataArr = subInfo;
        setSubsData((prevArr) => prevArr.concat(dataArr));

        // console.log(prevData);
        // setSubsData(prevData.concat(subInfo));
        // setSubsData((prevData) => prevData.push(subInfo));
        // console.log(subsData);

        // setSubsData((prevData) => prevData.push(subInfo));

        // sub.about = aboutData.data();
        // setSubsData((prevData) => prevData.concat(sub));
        // console.log(sub);
      });
    };
    if (subsNames) {
      getAboutData();
    }
  }, [subsNames]);

  return (
    <div className="all-subs-body">
      <button
        onClick={() => {
          console.log(subsData);
        }}
      >
        Click me
      </button>
      {subsData && <SubredditsTable subsData={subsData} />}
    </div>
  );
}
