import './SubredditHeader.css';
import React from 'react';

export default function SubredditHeader({
  overview,
  primaryColour,
  secondaryColour,
}) {
  return (
    <div className="subreddit-header">
      <span className="upper" style={{ backgroundColor: primaryColour }}></span>
      <div className="lower">
        <div className="details-box">
          <span style={{ backgroundColor: primaryColour }} className="logo">
            R
          </span>
          <div className="text-info">
            <div className="display-name">{overview.displayName}</div>
            <div className="r-sub-name">r/{overview.subName}</div>
            <div className="member-count">{overview.memberCount} members</div>
          </div>
          <div className="join-box">
            <button style={{ backgroundColor: secondaryColour }}>Join</button>
          </div>
        </div>
      </div>
    </div>
  );
}
