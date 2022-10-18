import './SubPreview.css';

import React from 'react';

export default function SubPreview({ primary, secondary, displayName, URL }) {
  return (
    <div className="sub-preview-main">
      <div className="preview-header">
        <div className="top" style={{ backgroundColor: `${primary}` }}></div>
        <div className="bottom">
          <div className="header-content">
            <div className="r-logo" style={{ backgroundColor: `${primary}` }}>
              R
            </div>
            <div className="titles">
              <div className="name">
                {displayName ? displayName : 'Preview Subreddit'}
              </div>
              <div className="url">{URL ? `r/${URL}` : 'r/preview'}</div>
              <div className="members">50 members</div>
            </div>
            <button
              className="preview-join"
              style={{ backgroundColor: `${secondary}` }}
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="preview-posts"></div>
      <div className="preview-posts"></div>
      <div className="preview-posts"></div>
      <div className="preview-sidebar">
        <div
          className="sidebar-top"
          style={{ backgroundColor: `${primary}` }}
        ></div>
        <div
          className="sidebar-button"
          style={{ backgroundColor: `${secondary}` }}
        ></div>
      </div>
    </div>
  );
}
