import './PostOverview.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { upVotePost, downVotePost, postVote } from '../../../firebase';
import { formatDistanceToNowStrict } from 'date-fns';
import { db, auth } from '../../../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export default function PostOverview({ postId, subName }) {
  // const { subName } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const [timeInterval, setTimeInterval] = useState(null);
  const [urlString, setUrlString] = useState(null);

  const [hasUpVoted, setHasUpvoted] = useState(null);
  const [hasDownVoted, setHasDownVoted] = useState(null);

  // Create listener for post data and store to state
  useEffect(() => {
    const getPostData = async () => {
      const postRef = doc(db, 'subreddits', `${subName}`, 'posts', `${postId}`);
      const unsub = onSnapshot(postRef, (doc) => {
        const postData = doc.data();
        setPostData(postData);
      });
    };
    getPostData();
  }, [postId, subName]);

  // Converts posted time to string and stores to state
  useEffect(() => {
    // Formats posted date obj to readable string
    const formatData = () => {
      const timeString = formatDistanceToNowStrict(
        new Date(postData.posted.seconds * 1000)
      );
      setTimeInterval(timeString);
    };

    // If post is 'link' type convert to reduced string for display
    const urlToString = () => {
      if (postData.type === 'link') {
        setUrlString(postData.url.split('').slice(12, 60).join(''));
      }
    };

    const hasVoted = () => {
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
    };

    if (postData) {
      formatData();
      urlToString();
      hasVoted();
    }
  }, [postData]);

  // Redirects users to post page unless a hyperlink has been clicked
  const navigateToPost = (event) => {
    if (event.target.tagName !== 'A') {
      navigate(`/r/${subName}/post/${postId}`);
    }
  };

  if (postData) {
    return (
      <div key={postData.id} className="post-main">
        <div className="karma-box">
          <button onClick={() => upVotePost(subName, postId, postData.userId)}>
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
            onClick={() => downVotePost(subName, postId, postData.userId)}
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
  } else {
    return <div>No data</div>;
  }

  // if (postData) {
  //   return (
  //     <div>
  //       {postData.karma} {timeInterval} {urlString} {hasUpVoted ? 'yes' : 'no'}
  //     </div>
  //   );
  // }
}
