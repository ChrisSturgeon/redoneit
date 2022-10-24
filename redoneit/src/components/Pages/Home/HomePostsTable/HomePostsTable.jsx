import React from 'react';
import { shuffleArray } from '../../../../firebase';
import PostOverview from '../../../Posts/PostOverview/PostOverview';

export default function HomePostsTable({
  userId,
  posts,
  toggleLoginModal,
  sharePost,
}) {
  // Calls helper function to shuffle users/guests 'top' posts
  // into random order for rendering
  const shuffledPosts = shuffleArray(posts);

  if (posts) {
    return (
      <div>
        {shuffledPosts.map((post) => {
          return (
            <PostOverview
              key={post.id}
              postId={post.id}
              subName={post.subreddit}
              homePost={true}
              userId={userId}
              toggleLoginModal={toggleLoginModal}
              sharePost={sharePost}
            />
          );
        })}
      </div>
    );
  } else {
    return <div>LOADING</div>;
  }
}
