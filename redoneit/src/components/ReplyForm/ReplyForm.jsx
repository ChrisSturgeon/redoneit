import './ReplyForm.css';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { submitComment } from '../../firebase';
import { set } from 'date-fns';

export default function ReplyForm() {
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
      await submitComment(subName, postId, commentText);
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
    <div className="comment-form-main">
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
        <div>
          <div>Thanks for your comment!</div>
          <button onClick={() => setSubmitted(false)}>Add another?</button>
        </div>
      )}
    </div>
  );
}
