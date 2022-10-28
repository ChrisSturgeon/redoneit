import './Comment.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';

// Firebase imports
import {
  db,
  auth,
  upVoteComment,
  downVoteComment,
  deleteComment,
} from '../../../firebase';

// Firestore imports
import {
  onSnapshot,
  doc,
  query,
  collection,
  orderBy,
} from 'firebase/firestore';

// Component imports
import ReplyForm from '../ReplyForm/ReplyForm';
import Reply from '../Reply/Reply';

export default function Comment({ data, userId, toggleLoginModal, username }) {
  const parentId = data.id;
  const { subName, postId } = useParams();
  const dateObj = new Date(data.posted.seconds * 1000);
  const timeInterval = formatDistanceToNowStrict(dateObj);
  const [postKarma, setPostKarma] = useState(null);
  const [replies, setReplies] = useState(null);
  const [hasUpVoted, setHasUpvoted] = useState(null);
  const [hasDownVoted, setHasDownVoted] = useState(null);
  const [karmaClass, setKarmaClass] = useState(null);
  const [replyForm, setReplyForm] = useState(null);

  // Calls upvote comment firebase function with post
  // details if user is logged in, or opens login modal
  const upVote = () => {
    if (userId) {
      upVoteComment(subName, postId, data.id, data.userId);
    } else {
      toggleLoginModal();
    }
  };

  // Calls downvote comment firebase function with post
  // details if user is logged in, or opens login modal
  const downVote = () => {
    if (userId) {
      downVoteComment(subName, postId, data.id, data.userId);
    } else {
      toggleLoginModal();
    }
  };

  // Opens closes the this comment's reply form
  const toggleReplyForm = () => {
    if (userId) {
      setReplyForm(!replyForm);
    } else {
      toggleLoginModal();
    }
  };

  // Calls delete comments function from firebase module
  const deleteThisComment = async () => {
    await deleteComment(subName, postId, data.id);
  };

  // On mount sets sets listener for this comment's replies, ordered by descending karma score
  useEffect(() => {
    async function getReplies() {
      const queryRef = query(
        collection(
          db,
          'subreddits',
          `${subName}`,
          'posts',
          `${postId}`,
          'comments',
          `${data.id}`,
          'replies'
        ),
        orderBy('karma', 'desc')
      );
      onSnapshot(queryRef, (QuerySnapshot) => {
        const replies = [];
        const data = QuerySnapshot.forEach((doc) => {
          const reply = doc.data();
          reply.parentId = parentId;
          reply.id = doc.id;
          replies.push(reply);
        });
        setReplies(replies);
      });
    }
    getReplies();
  }, [data]);

  // Listener for real-time karma updates
  useEffect(() => {
    async function getKarma() {
      const docRef = doc(
        db,
        'subreddits',
        `${subName}`,
        'posts',
        `${postId}`,
        'comments',
        `${data.id}`
      );
      const unsub = onSnapshot(docRef, (doc) => {
        const data = doc.data();
        setPostKarma(data.karma);
      });
    }
    getKarma();
  });

  // Checks if user has previously upvoted or downvoted
  // this comment and stores this in state as boolean for use
  // with rendering up/down vote arrow buttons as orange or blue to colour
  useEffect(() => {
    if (userId) {
      if (data.upVotedBy.includes(auth.currentUser.uid)) {
        setHasUpvoted(true);
        setKarmaClass('hasUpVoted');
      } else {
        setHasUpvoted(false);
      }

      if (data.downVotedBy.includes(auth.currentUser.uid)) {
        setHasDownVoted(true);
        setKarmaClass('hasDownVoted');
      } else {
        setHasDownVoted(false);
      }
    }
  }, [userId, data.upVotedBy, data.downVotedBy]);

  return (
    <div key={data.id} className="comment-main">
      <div className="comment-left">
        <div className="comment-line"></div>
      </div>
      <div className="comment-body">
        <div className="user-and-time">
          <div className="username">{data.user}</div>
          <div>-</div>
          <div className="posted-interval">{timeInterval} ago</div>
          {userId === data.userId && (
            <button className="comment-delete-btn" onClick={deleteThisComment}>
              <i className="fa-solid fa-trash"></i>
              <div className="delete-text">Delete comment</div>
            </button>
          )}
        </div>
        <div className="reply-text">{data.text}</div>
        <div className="karma-and-reply">
          <button onClick={upVote}>
            {' '}
            <i
              className={
                hasUpVoted
                  ? 'fa-sharp fa-solid fa-arrow-up hasUpVoted'
                  : 'fa-sharp fa-solid fa-arrow-up'
              }
            ></i>
          </button>
          {postKarma ? (
            <div className="karma-bold">
              <div className={karmaClass}>{postKarma}</div>
            </div>
          ) : (
            <div className="karma-bold">0</div>
          )}
          <button onClick={downVote}>
            {' '}
            <i
              className={
                hasDownVoted
                  ? 'fa-sharp fa-solid fa-arrow-down hasDownVoted'
                  : 'fa-sharp fa-solid fa-arrow-down '
              }
            ></i>
          </button>
          <button className="reply-btn" onClick={toggleReplyForm}>
            <i className=" fa-regular fa-message"></i>
            <div>reply</div>
          </button>
        </div>

        {replyForm ? (
          <ReplyForm
            commentId={data.id}
            toggleReplyForm={toggleReplyForm}
            username={username}
          />
        ) : null}

        <div>
          {replies
            ? replies.map((reply) => {
                return (
                  <Reply
                    key={reply.id}
                    commentId={data.id}
                    data={reply}
                    userId={userId}
                    toggleLoginModal={toggleLoginModal}
                  />
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}
