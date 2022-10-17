import './PostForm.css';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { newTextPost, newURLPost } from '../../../firebase';

export default function NewPostForm({ userId, toggleLoginModal }) {
  const { subName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [postType, setPostType] = useState(null);
  const [title, setTitle] = useState('');
  const [titleLength, setTitleLength] = useState(0);
  const [url, setUrl] = useState('');
  const [urlClass, setURLClass] = useState('');
  const [postText, setPostText] = useState('');
  const [linkBtnActive, setlinkBtnActive] = useState(null);
  const [textBtnActive, setTextBtnActive] = useState(null);
  const navigate = useNavigate();

  // Updates 'title' state for use on input change
  const titleChange = (event) => {
    setTitle(event.target.value);
  };

  // Updates 'URL' state for use on input change
  const urlChange = (event) => {
    setUrl(event.target.value);
  };
  // Updates 'post text' state for use on input change
  const postTextChange = (event) => {
    setPostText(event.target.value);
  };

  // Calls Firebase new post function with post-type
  // state on submit, then auto-forwards
  // user to their newly created post
  const onFormSubmit = async (event) => {
    event.preventDefault();
    if (userId) {
      if (postType === 'link') {
        const newId = await newURLPost(title, url, subName);
        navigate(`/r/${subName}/post/${newId}`);
      }

      if (postType === 'text') {
        const newId = await newTextPost(title, postText, subName);
        navigate(`/r/${subName}/post/${newId}`);
      }
    } else {
      toggleLoginModal();
    }
  };

  // Switches the type of new post form to 'link'
  const selectLinkPost = () => {
    setSearchParams('type=link');
    setlinkBtnActive(true);
    setTextBtnActive(false);
  };

  // Switches the type of new post form to 'text'
  const selectTextPost = () => {
    setSearchParams('type=text');
    setlinkBtnActive(false);
    setTextBtnActive(true);
  };

  // Updates title length counter in title input bar to show
  // user how close to the 300 character limit they are
  useEffect(() => {
    setTitleLength(title.length);
  }, [title]);

  // Sets post-type state from URL search params
  // and then activates relevant form render and styling
  useEffect(() => {
    setPostType(searchParams.get('type'));
    searchParams.get('type') === 'text'
      ? setTextBtnActive(true)
      : setlinkBtnActive(true);
  }, [searchParams]);

  // Checks to see if URL input field starts with 'https://'
  // and sets validity state accordingly
  useEffect(() => {
    if (url) {
      if (url.startsWith('https://')) {
        setURLClass('url-valid');
      } else {
        setURLClass('url-invalid');
      }
    }
  }, [url]);

  return (
    <div className="post-form-main">
      <div className="post-form-content">
        <h1>Create a post in r/{subName}</h1>
        <hr></hr>
        <div className="post-type">
          <button
            onClick={selectTextPost}
            className={
              textBtnActive ? 'post-type-btn-active' : 'post-type-btn-inactive'
            }
          >
            <i className="fa-regular fa-file-lines"></i>Text Post
          </button>
          <button
            onClick={selectLinkPost}
            className={
              linkBtnActive ? 'post-type-btn-active' : 'post-type-btn-inactive'
            }
          >
            <i className="fa-solid fa-link"></i> Link Post
          </button>
        </div>
        <form onSubmit={onFormSubmit} className="new-post-form">
          <label htmlFor="titleInput">Title</label>
          <div className="title-input">
            <input
              value={title}
              onChange={titleChange}
              id="titleInput"
              type="text"
              maxLength={300}
              disabled={userId ? false : true}
            ></input>
            <div>{titleLength}/300</div>
          </div>
          {postType === 'link' ? (
            <>
              <label htmlFor="postURL">URL</label>
              <input
                value={url}
                onChange={urlChange}
                id="postURL"
                type="text"
                className={urlClass}
                disabled={userId ? false : true}
              ></input>
            </>
          ) : (
            <>
              <label htmlFor="postText">Text</label>
              <textarea
                onChange={postTextChange}
                id="postText"
                disabled={userId ? false : true}
              ></textarea>
            </>
          )}

          <button type="submit" className="post-submit-btn">
            {userId ? 'Post' : 'Login to post'}
          </button>
        </form>
      </div>
    </div>
  );
}
