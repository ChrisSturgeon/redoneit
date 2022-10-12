import './ReplyForm.css';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { commentReply } from '../../firebase';
import { set } from 'date-fns';

export default function ReplyForm({ commentId }) {
  const { subName, postId } = useParams();
  const [commentText, setCommentText] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleTextInput = (event) => {
    setCommentText(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (commentText.length > 0) {
      await commentReply(subName, postId, commentId, commentText);
      setCommentText('');
      setIsFormValid(false);
      setSubmitted(true);
    }
  };

  useEffect(() => {
    if (commentText.length > 0) {
      setIsFormValid(true);
    }
  }, [commentText]);

  return (
    <div className="reply-form-main">
      {!submitted ? (
        <form onSubmit={handleFormSubmit}>
          <div>Replying as XXX</div>
          <textarea
            onChange={handleTextInput}
            value={commentText}
            placeholder="Type here"
          ></textarea>
          <button disabled={!isFormValid} type="submit">
            Comment
          </button>
        </form>
      ) : (
        <div>Reply posted!</div>
      )}
    </div>
  );
}
