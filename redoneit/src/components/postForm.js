import '../styles/PostForm.css';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { newTextPost, newURLPost } from '../firebase';

export default function PostForm() {
  const { subName } = useParams();
  const [postType, setPostType] = useState('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [urlClass, setURLClass] = useState('');
  const [postText, setPostText] = useState('');

  const titleChange = (event) => {
    setTitle(event.target.value);
  };

  const urlChange = (event) => {
    setUrl(event.target.value);
  };

  useEffect(() => {
    if (url) {
      if (url.startsWith('https://')) {
        setURLClass('url-valid');
      } else {
        setURLClass('url-invalid');
      }
    }
  }, [url]);

  const postTextChange = (event) => {
    setPostText(event.target.value);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    console.log(title);
    console.log(url);

    if (postType === 'link') {
      newURLPost(title, url, subName);
    }

    if (postType === 'text') {
      console.log(postText);
      newTextPost(title, postText, subName);
    }
  };

  return (
    <div className="post-form-main">
      <div className="post-form-content">
        <h1>Create a post in r/{subName}</h1>
        <hr></hr>
        <div className="post-type">
          <button onClick={() => setPostType('link')}>Link Post</button>
          <button onClick={() => setPostType('text')}>Text Post</button>
        </div>
        <form onSubmit={onFormSubmit} className="new-post-form">
          <label htmlFor="titleInput">Title</label>
          <input
            value={title}
            onChange={titleChange}
            id="titleInput"
            type="text"
          ></input>
          {postType === 'link' ? (
            <>
              <label htmlFor="postURL">URL</label>
              <input
                value={url}
                onChange={urlChange}
                id="postURL"
                type="text"
                className={urlClass}
              ></input>
            </>
          ) : (
            <>
              <label htmlFor="postText">Text</label>
              <textarea onChange={postTextChange} id="postText"></textarea>
            </>
          )}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
