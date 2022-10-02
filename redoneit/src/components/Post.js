import '../styles/Post.css';

export default function Post(props) {
  const postData = props.data;
  return (
    <div className="post-main">
      <div className="karma-box">
        <button>Up</button>
        <div>{postData.upVotes - postData.downVotes}</div>
        <button>Down</button>
      </div>

      <div className="details-box">Here</div>
    </div>
  );
}
