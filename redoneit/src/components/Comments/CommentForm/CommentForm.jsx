import './CommentForm.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { submitComment } from '../../../firebase';

export default function CommentForm({ userId, username, toggleLoginModal }) {
  const { subName, postId } = useParams();
  const [commentText, setCommentText] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Updates state value of 'post' text
  const handleTextInput = (event) => {
    setCommentText(event.target.value);
  };

  // Checks comment field has text and calls firebase submit comment function with value
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (commentText.length > 0 && userId) {
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

  // Scrolls to top of page
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
          {userId ? (
            <button className="login-btn" disabled={!isFormValid} type="submit">
              Post Comment
            </button>
          ) : (
            <button className="login-btn" onClick={() => toggleLoginModal()}>
              Login to comment
            </button>
          )}
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
