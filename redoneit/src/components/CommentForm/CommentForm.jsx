import './CommentForm.css';

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { submitComment } from '../../firebase';
import { serverTimestamp } from 'firebase/firestore';

export default function CommentForm() {
  const { subName, postId } = useParams();
  const [commentText, setCommentText] = useState('');

  const handleTextInput = (event) => {
    setCommentText(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await submitComment(subName, postId, commentText, serverTimestamp());
  };
  return (
    <div className="comment-form-main">
      <form onSubmit={handleFormSubmit}>
        <div>Commenting as XXX</div>
        <textarea
          onChange={handleTextInput}
          value={commentText}
          placeholder="What are your thoughts?"
        ></textarea>
        <button type="submit">Comment</button>
      </form>
    </div>
  );
}
