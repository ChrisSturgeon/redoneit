import React from 'react';
import { shuffleArray } from '../../../../firebase';

import PostOverview from '../../../Posts/PostOverview/PostOverview';

export default function HomePostsTable(props) {
  const shuffledPosts = shuffleArray(props.posts);

  return (
    <div>
      {shuffledPosts.map((post) => {
        return (
          <PostOverview
            postId={post.id}
            subName={post.subreddit}
            homePost={true}
          />
        );
      })}
    </div>
  );
}
