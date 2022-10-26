import './Reply.css';
import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useParams } from 'react-router-dom';
import { upVoteReply, downVoteReply, deleteReply } from '../../../firebase';
import { onSnapshot, doc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';

export default function Reply({ commentId, data, userId, toggleLoginModal }) {
  const { subName, postId } = useParams();
  const dateObj = new Date(data.posted.seconds * 1000);
  const timeInterval = formatDistanceToNowStrict(dateObj);
  const [postKarma, setPostKarma] = useState(null);
  const [hasUpVoted, setHasUpvoted] = useState(null);
  const [hasDownVoted, setHasDownVoted] = useState(null);
  const [karmaClass, setKarmaClass] = useState(null);

  // Calls firebase upvote function with comment
  // details if user is logged in, or opens login modal
  const upVote = () => {
    if (userId) {
      upVoteReply(subName, postId, commentId, data.id, data.userId);
    } else {
      toggleLoginModal();
    }
  };

  // Calls firebase downvote function with comment
  // details if user is logged in, or opens login modal
  const downVote = () => {
    if (userId) {
      downVoteReply(subName, postId, commentId, data.id, data.userId);
    } else {
      toggleLoginModal();
    }
  };

  const deleteThisReply = async () => {
    await deleteReply(subName, postId, data.parentId, data.id);
  };

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
        `${commentId}`,
        'replies',
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
  // this comment and stores this in state as boolean to colour
  // up/down arrow buttons accordingly
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
    <div key={data.id} className="reply-main">
      <div className="reply-left">
        <div className="reply-line"></div>
      </div>
      <div className="reply-body">
        <div className="user-and-time">
          <div className="username">{data.user}</div>
          <div>-</div>
          <div className="posted-interval">{timeInterval} ago</div>
          {userId === data.userId && (
            <button className="comment-delete-btn" onClick={deleteThisReply}>
              <i className="fa-solid fa-trash"></i>
              <div className="delete-text">Delete Reply</div>
            </button>
          )}
        </div>
        <div className="reply-text">{data.text}</div>
        <div className="karma">
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
        </div>
      </div>
    </div>
  );
}
