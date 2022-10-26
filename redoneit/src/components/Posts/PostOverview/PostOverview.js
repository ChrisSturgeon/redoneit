import './PostOverview.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { upVotePost, downVotePost, postVote } from '../../../firebase';
import { formatDistanceToNowStrict } from 'date-fns';
import { db, auth } from '../../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const isMobileUser = () => window.innerWidth <= 768;

export default function PostOverview({
  postId,
  subName,
  homePost,
  userId,
  toggleLoginModal,
  sharePost,
  shareHomePost,
}) {
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const [timeInterval, setTimeInterval] = useState(null);
  const [urlString, setUrlString] = useState(null);
  const [hasUpVoted, setHasUpvoted] = useState(null);
  const [hasDownVoted, setHasDownVoted] = useState(null);
  const [isMobile, setIsMobile] = useState(isMobileUser());

  // If user is logged in calls firebase upvote post function
  //  with post details, or opens login modal
  const upVoteThisPost = (event) => {
    if (userId) {
      event.stopPropagation();
      upVotePost(subName, postId, postData.userId);
    } else {
      toggleLoginModal();
    }
  };

  // If user is logged in calls firebase downvote post function
  //  with post details, or opens login modal
  const downVoteThisPost = (event) => {
    if (userId) {
      event.stopPropagation();
      downVotePost(subName, postId, postData.userId);
    } else {
      toggleLoginModal();
    }
  };

  // Redirects users to post page unless a hyperlink has been clicked
  const navigateToPost = (event) => {
    if (event.target.tagName !== 'A') {
      navigate(`/r/${subName}/post/${postId}`);
    }
  };

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

    // Checks if user has already up/down voted post, and
    // sets state accordingly for use in colour-rendering buttons
    const hasVoted = () => {
      if (userId) {
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
      }
    };

    if (postData) {
      formatData();
      urlToString();
      hasVoted();
    }
  }, [postData, userId]);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(isMobileUser);
      if (window.innerWidth >= 768) {
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [isMobile]);

  if (postData && !isMobile) {
    return (
      <div key={postData.id} className="post-main">
        <div className="karma-box">
          <button onClick={upVoteThisPost}>
            <i
              className={
                hasUpVoted
                  ? 'fa-sharp fa-solid fa-arrow-up hasUpVoted'
                  : 'fa-sharp fa-solid fa-arrow-up'
              }
            ></i>
          </button>
          <div>{postData.karma}</div>
          <button onClick={downVoteThisPost}>
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
          <div className="post-details-left">
            <div className="user-time">
              Posted by u/{postData.user} {timeInterval} ago{' '}
              {homePost ? `${postData.subreddit}` : null}
            </div>
            <div className="post-title-img">
              <div className="post-title">{postData.title}</div>
            </div>
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
              <button className="comments-btn">
                <i className=" fa-regular fa-message"></i> {postData.comments}{' '}
                comments
              </button>
              <button
                className="share-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  sharePost(postId, subName);
                }}
              >
                <i className="fa-solid fa-share"></i>
                Share
              </button>
            </div>
          </div>
          <div className="post-details-right">
            {postData.imgUrl && (
              <div>
                <img src={postData.imgUrl}></img>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else if (postData) {
    return (
      <div
        key={postData.id}
        onClick={navigateToPost}
        className="post-mobile-main"
      >
        <div className="mobile-post-header">
          {homePost ? (
            <div>
              r/{postData.subreddit} - {timeInterval}
            </div>
          ) : (
            <div>
              u/{postData.user} - {timeInterval}
            </div>
          )}
        </div>
        <div className="mobile-post-title-img">
          <div>{postData.title}</div>
          {postData.imgUrl && <img src={postData.imgUrl}></img>}
        </div>
        <div className="mobile-post-bottom">
          <div className="mobile-karma-box">
            <button onClick={upVoteThisPost}>
              <i
                className={
                  hasUpVoted
                    ? 'fa-sharp fa-solid fa-arrow-up hasUpVoted'
                    : 'fa-sharp fa-solid fa-arrow-up'
                }
              ></i>
            </button>
            <div>{postData.karma}</div>
            <button onClick={downVoteThisPost}>
              <i
                className={
                  hasDownVoted
                    ? 'fa-sharp fa-solid fa-arrow-down hasDownVoted'
                    : 'fa-sharp fa-solid fa-arrow-down '
                }
              ></i>
            </button>
          </div>
          <div className="mobile-comments">
            <i className=" fa-regular fa-message mobile"></i>
            {postData.comments}
          </div>
          <div className="mobile-share">
            <button
              className="share-btn"
              onClick={(event) => {
                event.stopPropagation();
                sharePost(postId, subName);
              }}
            >
              <i className="fa-solid fa-share"></i>
              Share
            </button>
          </div>
        </div>
      </div>
    );
  }
}
