import './PostDetail.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth, downVotePost, upVotePost } from '../../../firebase';

import {
  onSnapshot,
  doc,
  query,
  collection,
  orderBy,
  getDocs,
} from 'firebase/firestore';

// Component imports
import Comment from '../../Comments/Comment/Comment';
import CommentForm from '../../Comments/CommentForm/CommentForm';
import CopiedMessage from '../../Pages/Subreddit/CopiedMessage/CopiedMessage';
import { set } from 'date-fns';

export default function PostDetail({ userId, username, toggleLoginModal }) {
  const { subName, postId } = useParams();
  const [overview, setOverview] = useState(null);
  const [comments, setComments] = useState(null);
  const [noComments, setNoComments] = useState(true);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [hasUpVoted, setHasUpvoted] = useState(null);
  const [hasDownVoted, setHasDownVoted] = useState(null);

  const sharePost = async (postId) => {
    navigator.clipboard.writeText(
      `http://localhost:3000/r/${subName}/post/${postId}`
    );
    setCopiedMessage(!copiedMessage);
    setTimeout(() => {
      setCopiedMessage(false);
    }, 2000);
  };

  // If user is logged in calls firebase upvote post function
  //  with post details, or opens login modal
  const upVoteThisPost = () => {
    if (userId) {
      upVotePost(overview.subreddit, postId, overview.userId);
    } else {
      toggleLoginModal();
    }
  };

  // If user is logged in calls firebase downvote post function
  //  with post details, or opens login modal
  const downVoteThisPost = () => {
    if (userId) {
      downVotePost(overview.subreddit, postId, overview.userId);
    } else {
      toggleLoginModal();
    }
  };

  // Sets listener for postoverview information and stores to state
  useEffect(() => {
    async function getOverview() {
      onSnapshot(
        doc(db, 'subreddits', `${subName}`, 'posts', `${postId}`),
        (doc) => {
          setOverview(doc.data());
        }
      );
    }

    getOverview();
  }, [subName, postId]);

  // Colours upvote/downvote button if user has voted on post
  useEffect(() => {
    if (userId && overview) {
      if (overview.upVotedBy.includes(userId)) {
        setHasUpvoted(true);
      } else {
        setHasUpvoted(false);
      }

      if (overview.downVotedBy.includes(userId)) {
        setHasDownVoted(true);
      } else {
        setHasDownVoted(false);
      }
    }
  }, [userId, overview]);

  // Sets listener for post's comments to ordered by descending karma
  useEffect(() => {
    async function getComments() {
      const queryRef = query(
        collection(
          db,
          'subreddits',
          `${subName}`,
          'posts',
          `${postId}`,
          'comments'
        ),
        orderBy('karma', 'desc')
      );

      const lengthSnap = await getDocs(queryRef);

      if (lengthSnap.size > 0) {
        onSnapshot(queryRef, (QuerySnapshot) => {
          const comments = [];
          const data = QuerySnapshot.forEach((doc) => {
            const comment = doc.data();
            comment.id = doc.id;
            comments.push(comment);
            setNoComments(false);
          });
          setComments(comments);
        });
      } else {
        setComments(null);
        setNoComments(true);
      }
    }
    getComments();
  }, [userId]);

  return (
    <div className="post-detail-main">
      <div className="post-detail-content">
        <div className="post-detail-header">
          {overview ? `${overview.title}` : null}
          <button className="back-btn" onClick={() => window.history.back()}>
            <i className="fa-solid fa-xmark"></i>
            <div>Back</div>
          </button>
        </div>
        <div className="post-detail-body">
          {/* Post Header conditional*/}
          {(() => {
            if (overview) {
              let urlString = null;
              if (overview.type === 'link') {
                urlString = overview.url.split('').slice(12, 60).join('');
              }
              return (
                <div key={overview.id} className="post-details-main">
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
                    <div>{overview.karma}</div>
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
                  <div className="post-details-overview">
                    <div className="user-time">Posted by u/{overview.user}</div>
                    <div className="post-title">{overview.title}</div>
                    {(() => {
                      if (overview.type === 'link') {
                        return (
                          <a
                            className="post-url"
                            href={overview.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {urlString}...
                          </a>
                        );
                      } else if (overview.type === 'text') {
                        return (
                          <div className="post-text">{overview.postText}</div>
                        );
                      }
                    })()}
                    <div className="comments-share-box">
                      <div className="comments-box">
                        <i className=" fa-regular fa-message"></i>{' '}
                        {overview.comments} comments
                      </div>
                      <button
                        className="share-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          sharePost(postId);
                        }}
                      >
                        <i className="fa-solid fa-share"></i>
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else {
              return <div>...</div>;
            }
          })()}

          <CommentForm
            userId={userId}
            username={username}
            toggleLoginModal={toggleLoginModal}
          />

          <CopiedMessage isVisible={copiedMessage} backgroundColour="#2985d5" />

          {/* Comments detail conditional */}
          {comments
            ? comments.map((comment) => {
                return (
                  <Comment
                    key={comment.id}
                    data={comment}
                    userId={userId}
                    toggleLoginModal={toggleLoginModal}
                    username={username}
                  />
                );
              })
            : null}

          {noComments ? (
            <div className="no-comments">There are no comments yet! </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
