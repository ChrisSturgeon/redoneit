import './CommentForm.css';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { submitComment, auth, getUsersName } from '../../../firebase';

export default function CommentForm() {
  const { subName, postId } = useParams();
  const [commentText, setCommentText] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [username, setUsername] = useState(null);

  const handleTextInput = (event) => {
    setCommentText(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (commentText.length > 0) {
      await submitComment(subName, postId, commentText);
      setCommentText('');
      setIsFormValid(false);
      setSubmitted(true);
    }
  };

  // Sets form validity state to true if input is not blank
  useEffect(() => {
    if (commentText.length > 0) {
      setIsFormValid(true);
    }
  }, [commentText]);

  // Fetches user name upon render and stores in state
  useEffect(() => {
    const fetchUserName = async () => {
      const username = await getUsersName(auth.currentUser.uid);
      setUsername(username);
    };
    fetchUserName();
  }, []);

  document.body.scrollTop = document.documentElement.scrollTop = 0;

  return (
    <div className="comment-form-main">
      {!submitted ? (
        <form onSubmit={handleFormSubmit}>
          <div>Commenting as {username ? username : null}</div>
          <textarea
            onChange={handleTextInput}
            value={commentText}
            placeholder="What are your thoughts?"
          ></textarea>
          <button disabled={!isFormValid} type="submit">
            Comment
          </button>
        </form>
      ) : (
        <div>
          <div>Thanks for your comment!</div>
          <button onClick={() => setSubmitted(false)}>Add another?</button>
        </div>
      )}
    </div>
  );
}
