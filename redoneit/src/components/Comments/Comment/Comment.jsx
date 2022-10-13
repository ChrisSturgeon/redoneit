import './Comment.css';
import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useParams } from 'react-router-dom';
import { db, auth, upVoteComment, downVoteComment } from '../../../firebase';
import {
  onSnapshot,
  doc,
  query,
  collection,
  orderBy,
} from 'firebase/firestore';
import ReplyForm from '../ReplyForm/ReplyForm';
import Reply from '../Reply/Reply';

export default function Comment({ data }) {
  const { subName, postId } = useParams();
  const dateObj = new Date(data.posted.seconds * 1000);
  const timeInterval = formatDistanceToNowStrict(dateObj);
  const [postKarma, setPostKarma] = useState(null);
  const [replies, setReplies] = useState(null);
  const [hasUpVoted, setHasUpvoted] = useState(null);
  const [hasDownVoted, setHasDownVoted] = useState(null);
  const [karmaClass, setKarmaClass] = useState(null);
  const [replyForm, setReplyForm] = useState(null);

  // Sets listener for comment's replies to ordered by descending karma
  useEffect(() => {
    async function getReplies() {
      const currentUser = auth.currentUser.uid;
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
          reply.id = doc.id;
          replies.push(reply);
        });
        setReplies(replies);
      });
    }
    getReplies();
  }, []);

  // TO REMOVE - test function
  const test = () => {
    console.log(replies);
  };

  const upVote = () => {
    upVoteComment(subName, postId, data.id, data.userId);
  };

  const downVote = () => {
    downVoteComment(subName, postId, data.id, data.userId);
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
  }, [data.upVotedBy, data.downVotedBy]);

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
          {/* TO REMOVE */}
          <button onClick={test}>Test</button>
        </div>

        {replyForm ? <ReplyForm commentId={data.id} /> : null}

        <div>
          {replies
            ? replies.map((reply) => {
                return (
                  <Reply key={reply.id} commentId={data.id} data={reply} />
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}