import { verifyPasswordResetCode } from 'firebase/auth';
import '../styles/Post.css';
import { Link } from 'react-router-dom';

import { format } from 'date-fns';

export default function Post(props) {
  const postData = props.data;
  const dateObj = new Date(postData.posted.seconds * 1000);
  const dateString = format(dateObj, 'do LLL yy');
  const timeString = format(dateObj, 'HH:mm');
  const urlString = postData.url.split('').slice(12, 60).join('');

  return (
    <div
      key={postData.id}
      onClick={() => console.log(urlString)}
      className="post-main"
    >
      <div className="karma-box">
        <button>
          <i className="fa-sharp fa-solid fa-arrow-up"></i>
        </button>
        <div>{postData.karma}</div>
        <button>
          <i className="fa-sharp fa-solid fa-arrow-down"></i>
        </button>
      </div>
      <div className="details-box">
        <div className="user-time">
          Posted by u/{postData.user} on {dateString} at {timeString}
        </div>
        <div className="post-title">{postData.title}</div>
        <a
          className="post-url"
          href={postData.url}
          target="_blank"
          rel="noreferrer"
        >
          {urlString}...
        </a>
      </div>
    </div>
  );
}
