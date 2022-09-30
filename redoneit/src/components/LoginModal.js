import '../styles/LoginModal.css';
import { Link } from 'react-router-dom';
import stepArt from '../imgs/loginDecoration.png';
import { signInWithRedirect, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../firebase';

import React, { useState } from 'react';

export default function LoginModal(props) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Logs in user and closes modal
  const onLoginSubmit = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        props.toggleLogin();
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  // Locks body scroll when modal is open
  props.loginOpen
    ? (document.body.style.overflow = 'hidden')
    : (document.body.style.overflow = 'auto');

  const signGoogleUserIn = () => {
    signInWithRedirect(auth, provider);
  };

  if (props.loginOpen) {
    return (
      <div className="login-modal-bg">
        <div className="login-step">
          <div
            className="step-art"
            style={{ backgroundImage: `url(${stepArt})` }}
          ></div>
          <div className="login-step-content">
            <div className="step-header">
              <h1>Log In</h1>
              <button onClick={props.toggleLogin} className="close-btn">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="login-step-body">
              <button onClick={signGoogleUserIn} className="oAuth-btn">
                Continue with Google
              </button>
              <button className="oAuth-btn">Continue with GitHub</button>
              <div className="line-divider">
                <span className="line"></span>
                <div>OR</div>
                <span className="line"></span>
              </div>
              <div>
                <form onSubmit={onLoginSubmit} className="login-form">
                  <label htmlFor="email">Email</label>
                  <input
                    onChange={onEmailChange}
                    id="email"
                    type="email"
                  ></input>
                  <label htmlFor="password">Password</label>
                  <input
                    onChange={onPasswordChange}
                    id="password"
                    type="password"
                  ></input>
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
