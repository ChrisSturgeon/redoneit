import '../styles/SubredditHeader.css';
import React from 'react';

export default function SubredditHeader(props) {
  const data = props.overview;
  return (
    <div className="subreddit-header">
      <span className="upper"></span>
      <div className="lower">
        <div className="details-box">
          <span className="logo">R</span>
          <div className="text-info">
            <div className="display-name">{data.displayName}</div>
            <div className="r-sub-name">r/{data.subName}</div>
            <div className="member-count">{data.memberCount} members</div>
          </div>
          <div className="join-box">
            <button>Join</button>
          </div>
        </div>
      </div>
    </div>
  );
}
