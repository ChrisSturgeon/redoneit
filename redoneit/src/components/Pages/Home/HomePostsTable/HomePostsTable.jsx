import React from 'react';
import { shuffleArray } from '../../../../firebase';
import PostOverview from '../../../Posts/PostOverview/PostOverview';

export default function HomePostsTable(props) {
  // Calls helper function to shuffle users/guests 'top' posts
  // into random order for rendering
  const shuffledPosts = shuffleArray(props.posts);

  return (
    <div>
      {shuffledPosts.map((post) => {
        return (
          <PostOverview
            key={post.id}
            postId={post.id}
            subName={post.subreddit}
            homePost={true}
          />
        );
      })}
    </div>
  );
}
