import '../styles/SubNavLink.css';
import { favouriteSub, unFavouriteSub } from '../firebase';

import { Link } from 'react-router-dom';

export default function SubNavLink(props) {
  return (
    <Link
      to={props.linkString}
      onClick={() => {
        props.closeNav();
      }}
      className="sub-nav-link-main"
    >
      {props.subName}

      {props.favourite ? (
        <button
          className="star-btn"
          onClick={() => {
            unFavouriteSub(props.subName);
          }}
        >
          <i className="fa-solid fa-star"></i>
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
    </Link>
  );
}
