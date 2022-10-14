import './Home.css';
import PostOverview from '../../Posts/PostOverview/PostOverview';
export default function Home() {
  return (
    <div className="main">
      <div>I'm the home page</div>
      <PostOverview />
    </div>
  );
}
