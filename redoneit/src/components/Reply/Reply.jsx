import './Reply.css';
import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useParams } from 'react-router-dom';
import { upVoteReply, downVoteReply } from '../../firebase';
import { onSnapshot, doc, query, collection } from 'firebase/firestore';
import { db, auth } from '../../firebase';

export default function Reply({ commentId, data }) {
  const { subName, postId } = useParams();
  const dateObj = new Date(data.posted.seconds * 1000);
  const timeInterval = formatDistanceToNowStrict(dateObj);
  const [postKarma, setPostKarma] = useState(null);
  const [replies, setReplies] = useState(null);
  const [hasUpVoted, setHasUpvoted] = useState(null);
  const [hasDownVoted, setHasDownVoted] = useState(null);
  const [replyForm, setReplyForm] = useState(null);

  // TO REMOVE - test function
  const test = () => {
    console.log(data);
  };

  const upVote = () => {
    upVoteReply(subName, postId, commentId, data.id, data.userId);
  };

  const downVote = () => {
    downVoteReply(subName, postId, commentId, data.id, data.userId);
  };

  const toggleReplyForm = () => {
    setReplyForm(!replyForm);
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
    if (data.upVotedBy.includes(auth.currentUser.uid)) {
      setHasUpvoted(true);
    } else {
      setHasUpvoted(false);
    }

    if (data.downVotedBy.includes(auth.currentUser.uid)) {
      setHasDownVoted(true);
    } else {
      setHasDownVoted(false);
    }
  }, [data.upVotedBy, data.downVotedBy]);

  return (
    <div key={data.id} className="reply-main">
      <div className="user-and-time">
        <div className="username">{data.user}</div>
        <div>-</div>
        <div className="posted-interval">{timeInterval} ago</div>
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
        {postKarma ? `${postKarma}` : '0'}
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
        <button onClick={test}>log props</button>
      </div>
    </div>
  );
}
