import './SubNavLink.css';
import { favouriteSub, unFavouriteSub } from '../../../firebase';
import { Link } from 'react-router-dom';

export default function SubNavLink(props) {
  return (
    <div className={props.mobile ? 'sub-nav-link-mobile' : 'sub-nav-link-main'}>
      <Link onClick={props.toggleSubsNav} to={props.linkString}>
        {props.subName}
      </Link>

      {props.favourite ? (
        <button
          className="star-btn"
          onClick={() => {
            unFavouriteSub(props.subName);
          }}
        >
          <i
            className="fa-solid fa-star"
            style={{ color: 'var(--accent-blue)' }}
          ></i>
        </button>
      ) : (
        <button
          className="star-btn"
          onClick={() => {
            favouriteSub(props.subName);
          }}
        >
          <i className="fa-regular fa-star"></i>
        </button>
      )}
    </div>
  );
}
