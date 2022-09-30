import '../styles/Subreddit.css';

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Subreddit() {
  const { subName } = useParams();
  return (
    <div className="subreddit-main">Hi! this is the {subName} subreddit</div>
  );
}
