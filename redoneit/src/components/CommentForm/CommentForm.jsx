import './CommentForm.css';

import React from 'react';

export default function CommentForm() {
  return (
    <div className="comment-form-main">
      <form>
        <div>Commenting as XXX</div>
        <textarea placeholder="What are your thoughts?"></textarea>
        <button type="submit">Comment</button>
      </form>
    </div>
  );
}
