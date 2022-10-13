import './PostOverview.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { upVotePost, downVotePost, postVote } from '../../../firebase';
import { formatDistanceToNowStrict } from 'date-fns';
import { auth } from '../../../firebase';

export default function PostOverview(props) {
  const { subName } = useParams();
  const navigate = useNavigate();
  const postData = props.data;
  const timeInterval = formatDistanceToNowStrict(
    new Date(postData.posted.seconds * 1000)
  );

  let urlString = null;
  if (postData.type === 'link') {
    urlString = postData.url.split('').slice(12, 60).join('');
  }

  const [hasUpVoted, setHasUpvoted] = useState(null);
  const [hasDownVoted, setHasDownVoted] = useState(null);

  // Checks if user has previously upvoted or downvoted
  // this post and stores this in state as boolean to colour
  // up/down arrow buttons accordingly
  useEffect(() => {
    if (postData.upVotedBy.includes(auth.currentUser.uid)) {
      setHasUpvoted(true);
    } else {
      setHasUpvoted(false);
    }

    if (postData.downVotedBy.includes(auth.currentUser.uid)) {
      setHasDownVoted(true);
    } else {
      setHasDownVoted(false);
    }
  }, [postData.upVotedBy, postData.downVotedBy]);

  // Redirects users to post page unless a hyperlink has been clicked
  const navigateToPost = (event) => {
    if (event.target.tagName !== 'A') {
      navigate(`/r/${subName}/post/${postData.id}`);
    }
  };

  return (
    <div key={postData.id} className="post-main">
      <div className="karma-box">
        <button
          onClick={() =>
            upVotePost(postData.subreddit, postData.id, postData.userId)
          }
        >
          <i
            className={
              hasUpVoted
                ? 'fa-sharp fa-solid fa-arrow-up hasUpVoted'
                : 'fa-sharp fa-solid fa-arrow-up'
            }
          ></i>
        </button>
        <div>{postData.karma}</div>
        <button
          onClick={() =>
            downVotePost(postData.subreddit, postData.id, postData.userId)
          }
        >
          <i
            className={
              hasDownVoted
                ? 'fa-sharp fa-solid fa-arrow-down hasDownVoted'
                : 'fa-sharp fa-solid fa-arrow-down '
            }
          ></i>
        </button>
      </div>

      <div onClick={navigateToPost} className="details-box">
        <div className="user-time">
          Posted by u/{postData.user} {timeInterval} ago
        </div>
        <div className="post-title">{postData.title}</div>

        {(() => {
          if (postData.type === 'link') {
            return (
              <a
                className="post-url"
                href={postData.url}
                target="_blank"
                rel="noreferrer"
              >
                {urlString}...
              </a>
            );
          } else if (postData.type === 'text') {
            return <div className="post-text">{postData.postText}</div>;
          }
        })()}
        <div className="comments-share-box">
          <div className="comments-box">
            <i className=" fa-regular fa-message"></i> {postData.comments}{' '}
            comments
          </div>
          <div className="share-box">share</div>
        </div>
      </div>
    </div>
  );
}
