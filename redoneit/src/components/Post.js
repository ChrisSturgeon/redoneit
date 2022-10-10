import { verifyPasswordResetCode } from 'firebase/auth';
import '../styles/Post.css';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { postVote } from '../firebase';

import { format } from 'date-fns';

export default function Post(props) {
  const { subName } = useParams();
  const navigate = useNavigate();
  const postData = props.data;
  const dateObj = new Date(postData.posted.seconds * 1000);
  const dateString = format(dateObj, 'do LLL yy');
  const timeString = format(dateObj, 'HH:mm');
  let urlString = null;
  if (postData.type === 'link') {
    urlString = postData.url.split('').slice(12, 60).join('');
  }

  // Prevents loading post details when hyperlink clicked
  const navigateToPost = (event) => {
    if (event.target.tagName !== 'A') {
      console.log('Dog!!');
      navigate(`/r/${subName}/post/${postData.id}`);
    }
  };

  return (
    <div key={postData.id} className="post-main">
      <div className="karma-box">
        <button
          onClick={() =>
            postVote(postData.subreddit, postData.userId, postData.id, 'upVote')
          }
        >
          <i className="fa-sharp fa-solid fa-arrow-up"></i>
        </button>
        <div>{postData.karma}</div>
        <button
          onClick={() =>
            postVote(
              postData.subreddit,
              postData.userId,
              postData.id,
              'downVote'
            )
          }
        >
          <i className="fa-sharp fa-solid fa-arrow-down"></i>
        </button>
      </div>

      <div onClick={navigateToPost} className="details-box">
        <div className="user-time">
          Posted by u/{postData.user} on {dateString} at {timeString}
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
