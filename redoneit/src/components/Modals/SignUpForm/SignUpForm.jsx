import './SignUpForm.css';
import React, { useState } from 'react';
import stepArt from '../../../imgs/loginDecoration.png';
import { signInWithRedirect } from 'firebase/auth';
import { auth, provider, registerNewUser } from '../../../firebase';

export default function SignUpForm(props) {
  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();
  const [waiting, setWaiting] = useState(false);

  // Updates 'username' state for use on input change
  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  // Updates 'email' state for use on input change
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Updates 'password1' state for use on input change
  const handlePassword1Change = (event) => {
    setPassword1(event.target.value);
  };

  // Updates 'password2' state for use on input change
  const handlePassword2Change = (event) => {
    setPassword2(event.target.value);
  };

  // Calls Firebase auth Google Sign in function
  const signGoogleUserIn = () => {
    signInWithRedirect(auth, provider);
  };

  // Validates the two password are identical and then
  // calls creates new Firebase user function
  const onSubmit = async (event) => {
    event.preventDefault();
    setWaiting(true);
    if (password1 === password2) {
      await registerNewUser(email, password1, userName);
    }
    props.handleClose();
  };

  return (
    <div className="register-step">
      <div
        className="step-art"
        style={{ backgroundImage: `url(${stepArt})`, backgroundSize: 'cover' }}
      ></div>
      <div className="register-step-content">
        <div className="register-step-header">
          <h1>Register New Account</h1>
          <button onClick={props.handleClose} className="close-btn">
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
              <button className="register-btn" type="submit">
                {waiting ? <div className="lds-dual-ring"></div> : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="step-right"></div>
    </div>
  );
}
