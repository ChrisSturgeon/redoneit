import './PostDetail.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db, downVotePost, upVotePost } from '../../../firebase';
import {
  onSnapshot,
  doc,
  query,
  collection,
  orderBy,
} from 'firebase/firestore';

// Components
import Comment from '../../Comments/Comment/Comment';
import CommentForm from '../../Comments/CommentForm/CommentForm';

export default function PostDetail(props) {
  const { subName, postId } = useParams();
  const [overview, setOverview] = useState(null);
  const [comments, setComments] = useState(null);

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
      const currentUser = auth.currentUser.uid;
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
  }, []);

  // Ensure top of content is displayed on page load
  // document.body.scrollTop = document.documentElement.scrollTop = 0;

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
                <div key={overview.id} className="post-main">
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
                  <div className="details-box">
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
                      <div className="share-box">share</div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return <div>...</div>;
            }
          })()}

          <CommentForm />

          {/* Comments detail conditional */}
          {comments
            ? comments.map((comment) => {
                return <Comment key={comment.id} data={comment} />;
              })
            : null}
        </div>
      </div>
    </div>
  );
}
