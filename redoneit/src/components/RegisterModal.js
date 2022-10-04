import '../styles/RegisterModal.css';
import { Link } from 'react-router-dom';
import stepArt from '../imgs/loginDecoration.png';
import { signInWithRedirect } from 'firebase/auth';
import { auth, provider, registerNewUser } from '../firebase';

import React, { useState } from 'react';

export default function RegisterModal(props) {
  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword1Change = (event) => {
    setPassword1(event.target.value);
  };

  const handlePassword2Change = (event) => {
    setPassword2(event.target.value);
  };

  const signGoogleUserIn = () => {
    signInWithRedirect(auth, provider);
  };

  // Locks home screen scroll when register modal open
  props.registerOpen
    ? (document.body.style.overflow = 'hidden')
    : (document.body.style.overflow = 'auto');

  // Validates registration inputs and then creates new Firebase user
  const onSubmit = (event) => {
    event.preventDefault();

    if (password1 === password2) {
      registerNewUser(email, password1, userName);
    }
    props.toggleRegister();
  };

  if (props.registerOpen) {
    return (
      <div className="register-modal-bg">
        <div className="register-step">
          <div
            className="step-art"
            style={{ backgroundImage: `url(${stepArt})` }}
          ></div>
          <div className="register-step-content">
            <div className="register-step-header">
              <h1>Register New Account</h1>
              <button onClick={props.toggleRegister} className="close-btn">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="step-body">
              <div className="step-body-left">
                <button onClick={signGoogleUserIn} className="oAuth-btn">
                  Register with Google
                </button>
                <button className="oAuth-btn">Register with GitHub</button>
              </div>

              <div className="step-body-right">
                <form onSubmit={onSubmit} className="login-form">
                  <label htmlFor="username">Choose a Username</label>
                  <input
                    onChange={handleUserNameChange}
                    id="username"
                    type="text"
                  ></input>
                  <label htmlFor="email">Your Email</label>
                  <input
                    onChange={handleEmailChange}
                    id="email"
                    type="email"
                  ></input>
                  <label htmlFor="password1">Password</label>
                  <input
                    onChange={handlePassword1Change}
                    id="password1"
                    type="password"
                  ></input>
                  <label htmlFor="password2">Confirm Password</label>
                  <input
                    onChange={handlePassword2Change}
                    id="password2"
                    type="password"
                  ></input>
                  <button className="login-btn" type="submit">
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="step-right"></div>
        </div>
      </div>
    );
  }
}
