import './HomeSidebar.css';
import homeBanner from '../../../../imgs/homeBanner.png';
import snooHome from '../../../../imgs/snooHome.png';
import { Link } from 'react-router-dom';

export default function HomeSidebar({ userId }) {
  return (
    <div className="home-sidebar">
      <div
        className="home-sidebar-banner"
        style={{
          backgroundImage: `url(${homeBanner})`,
          backgroundSize: 'cover',
        }}
      ></div>
      <div className="home-sidebar-content">
        <div className="home-sidebar-title">
          <img
            className="snoo-home"
            src={snooHome}
            alt="reddit-snoo-character"
          />
          <div className="sidebar-title-text">Home</div>
        </div>
        <div className="home-sidebar-blurb">
          {userId
            ? 'Your personal Reddit frontpage. Come here to check in with your favourite communities.'
            : 'The home page of the internet. Create an account or login to personalise!'}
        </div>
        <hr></hr>

        <div className="create-buttons">
          <Link to="r/home/submit?type=text">
            <button className="home-sidebar-post">Create Post</button>
          </Link>
          <button className="home-sidebar-community">Create Community</button>
        </div>
      </div>
    </div>
  );
}
