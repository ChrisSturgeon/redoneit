import '../styles/SubNavLink.css';

import { Link } from 'react-router-dom';

export default function SubNavLink(props) {
  return (
    <div className="sub-nav-link-main">
      <Link to={props.linkString}>{props.subName}</Link>
      {props.favourite ? (
        <i className="fa-solid fa-star"></i>
      ) : (
        <i className="fa-regular fa-star"></i>
      )}
    </div>
  );
}
