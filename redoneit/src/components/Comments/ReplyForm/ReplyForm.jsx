import './ReplyForm.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { commentReply } from '../../../firebase';

export default function ReplyForm({ commentId, username }) {
  const { subName, postId } = useParams();
  const [replyText, setReplyText] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Updates 'reply text' state for use on textarea change
  const handleTextInput = (event) => {
    setReplyText(event.target.value);
  };

  // Checks if reply text is present and calls firebase set reply
  // function with state, clearing form afterwards
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (replyText.length > 0) {
      await commentReply(subName, postId, commentId, replyText);
      setReplyText('');
      setIsFormValid(false);
      setSubmitted(true);
    }
  };

  // Runs after reply text is entered to check
  // text is present, enabling submit button if so.
  useEffect(() => {
    if (replyText.length > 0) {
      setIsFormValid(true);
    }
  }, [replyText]);

  return (
    <div className="reply-form-main">
      {!submitted ? (
        <form onSubmit={handleFormSubmit}>
          <div>Replying as {username}</div>
          <textarea
            onChange={handleTextInput}
            value={replyText}
            placeholder="Type here"
          ></textarea>
          <button className="login-btn" disabled={!isFormValid} type="submit">
            Post Reply
          </button>
        </form>
      ) : (
        <div>Reply posted!</div>
      )}
    </div>
  );
}
