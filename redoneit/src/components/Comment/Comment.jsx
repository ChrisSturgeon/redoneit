import './Comment.css';
import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useParams } from 'react-router-dom';
import { upVoteComment, downVoteComment } from '../../firebase';
import {
  onSnapshot,
  doc,
  query,
  collection,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase';

export default function Comment({ data, updateScrollPosition }) {
  const { subName, postId } = useParams();
  const dateObj = new Date(data.posted.seconds * 1000);
  const timeInterval = formatDistanceToNowStrict(dateObj);
  const [postKarma, setPostKarma] = useState(null);

  // TO REMOVE - test function
  const test = () => {
    console.log(subName, postId, data.id);
  };

  const upVote = () => {
    updateScrollPosition(window.pageYOffset);
    upVoteComment(subName, postId, data.id);
  };

  const downVote = () => {
    downVoteComment(subName, postId, data.id);
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

  return (
    <div key={data.id} className="comment-main">
      <div className="user-and-time">
        <div className="username">{data.user}</div>
        <div>-</div>
        <div className="posted-interval">{timeInterval} ago</div>
      </div>
      <div className="reply-text">{data.text}</div>

      <div className="karma-and-reply">
        <button onClick={upVote}>Upvote</button>
        {postKarma ? `${postKarma}` : '0'}
        <button onClick={downVote}>Downvote</button>
        <button>Reply</button>
        {/* TO REMOVE */}
        <button onClick={test}>Test</button>
      </div>
    </div>
  );
}
