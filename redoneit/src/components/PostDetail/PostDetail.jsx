import './PostDetail.css';
import React from 'react';
import { useParams } from 'react-router-dom';

export default function PostDetail(props) {
  const { subName, postId } = useParams();
  return (
    <div className="post-detail-main">
      I'm a post detail for {subName} post {postId}
    </div>
  );
}
