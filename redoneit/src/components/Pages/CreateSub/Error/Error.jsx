import React, { useEffect } from 'react';

export default function Error({ type }) {
  const idString = `${type}Error`;
  useEffect(() => {
    const error = document.getElementById(idString);
    error.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  });
  return (
    <div id={idString} style={{ color: 'red', fontSize: '0.9rem' }}>
      A subreddit already exists with this {type}{' '}
    </div>
  );
}
