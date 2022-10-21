import './Slider.css';
import { useState } from 'react';

export default function Slider({ showPosts, showSidebar }) {
  const [postActive, setPostsActive] = useState(true);
  const [sideBarActive, setSideBarActive] = useState(false);

  return (
    <div className="sub-slider">
      <button
        className={postActive ? 'slider-btn active' : 'slider-btn'}
        onClick={() => {
          showPosts();
          setPostsActive(true);
          setSideBarActive(false);
        }}
      >
        Posts
      </button>
      <button
        className={sideBarActive ? 'slider-btn active' : 'slider-btn'}
        onClick={() => {
          showSidebar();
          setSideBarActive(true);
          setPostsActive(false);
        }}
      >
        About
      </button>
    </div>
  );
}
