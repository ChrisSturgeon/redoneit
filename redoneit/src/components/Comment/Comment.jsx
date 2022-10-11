import './Comment.css';
import { formatDistanceToNowStrict } from 'date-fns';
import { useParams } from 'react-router-dom';
import { upVoteComment, downVoteComment } from '../../firebase';

export default function Comment({ data }) {
  const { subName, postId } = useParams();

  const dateObj = new Date(data.posted.seconds * 1000);
  const timeInterval = formatDistanceToNowStrict(dateObj);

  // TO REMOVE - test function
  const test = () => {
    console.log(subName, postId, data.id);
  };

  const upVote = () => {
    upVoteComment(subName, postId, data.id);
  };

  const downVote = () => {
    downVoteComment(subName, postId, data.id);
  };

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
        {data.karma}
        <button onClick={downVote}>Downvote</button>
        <button>Reply</button>
        {/* TO REMOVE */}
        <button onClick={test}>Test</button>
      </div>
    </div>
  );
}
