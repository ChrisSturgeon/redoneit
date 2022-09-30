import React from 'react';
import { Link } from 'react-router-dom';

export default function SubredditsTable(props) {
  const subreddits = props.subreddits;

  return (
    <div>
      {subreddits.map((subreddit) => (
        <div key={subreddit.subName}>
          {subreddit.subName} with {subreddit.memberCount} users
          <Link to={`${subreddit.subName}`}>Visit</Link>
        </div>
      ))}
    </div>
  );
}
