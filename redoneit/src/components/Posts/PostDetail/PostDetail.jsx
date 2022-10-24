import './PostDetail.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, downVotePost, upVotePost } from '../../../firebase';
import {
  onSnapshot,
  doc,
  query,
  collection,
  orderBy,
} from 'firebase/firestore';

// Component imports
import Comment from '../../Comments/Comment/Comment';
import CommentForm from '../../Comments/CommentForm/CommentForm';
import CopiedMessage from '../../Pages/Subreddit/CopiedMessage/CopiedMessage';

export default function PostDetail({ userId, username, toggleLoginModal }) {
  const { subName, postId } = useParams();
  const [overview, setOverview] = useState(null);
  const [comments, setComments] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const sharePost = async (postId) => {
    navigator.clipboard.writeText(
      `http://localhost:3000/r/${subName}/post/${postId}`
    );
    setCopiedMessage(!copiedMessage);
    setTimeout(() => {
      setCopiedMessage(false);
    }, 2000);
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
      onSnapshot(queryRef, (QuerySnapshot) => {
        const comments = [];
        const data = QuerySnapshot.forEach((doc) => {
          const comment = doc.data();
          comment.id = doc.id;
          comments.push(comment);
        });
        setComments(comments);
      });
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
                    <button
                      onClick={() =>
                        upVotePost(overview.subreddit, overview.userId, postId)
                      }
                    >
                      <i className="fa-sharp fa-solid fa-arrow-up"></i>
                    </button>
                    <div>{overview.karma}</div>
                    <button
                      onClick={() =>
                        downVotePost(
                          overview.subreddit,
                          overview.userId,
                          postId
                        )
                      }
                    >
                      <i className="fa-sharp fa-solid fa-arrow-down"></i>
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
        </div>
      </div>
    </div>
  );
}
