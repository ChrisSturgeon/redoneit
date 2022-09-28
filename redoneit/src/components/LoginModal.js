import '../styles/LoginModal.css';
import { Link } from 'react-router-dom';
import stepArt from '../imgs/loginDecoration.png';

import React from 'react';

export default function LoginModal(props) {
  props.loginOpen
    ? (document.body.style.overflow = 'hidden')
    : (document.body.style.overflow = 'auto');

  if (props.loginOpen) {
    return (
      <div className="modal-bg">
        <div className="step">
          <div
            className="step-art"
            style={{ backgroundImage: `url(${stepArt})` }}
          ></div>
          <div className="step-content">
            <div className="step-header">
              <h1>Log In</h1>
              <button onClick={props.toggleLogin} className="close-btn">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="step-body">
              <button className="oAuth-btn">Continue with Google</button>
              <button className="oAuth-btn">Continue with GitHub</button>
              <div className="line-divider">
                <span className="line"></span>
                <div>OR</div>
                <span className="line"></span>
              </div>
              <div>
                <form className="login-form">
                  <label htmlFor="username">Username</label>
                  <input id="username" type="text"></input>
                  <label htmlFor="password">Password</label>
                  <input id="password" type="password"></input>
                  <button className="login-btn" type="submit">
                    Log In
                  </button>
                </form>
              </div>

              <div className="user-management">
                <div>
                  Forgot your <Link>username</Link> or <Link>password</Link>?
                </div>
                <div>
                  New to Reddit? <Link>Sign Up</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
