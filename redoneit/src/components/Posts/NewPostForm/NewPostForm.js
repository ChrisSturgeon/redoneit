import './PostForm.css';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { newTextPost, newURLPost } from '../../../firebase';
import HomeNewPostDropdown from '../HomeNewPostDropdown/HomeNewPostDropdown';

export default function NewPostForm({ userId, toggleLoginModal }) {
  const { subName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [postType, setPostType] = useState(null);
  const [title, setTitle] = useState('');
  const [titleLength, setTitleLength] = useState(0);
  const [showTitleError, setShowTitleError] = useState(false);
  const [url, setUrl] = useState('');
  const [imgURL, setIMGURL] = useState('');
  const [URLValid, setURLValid] = useState(null);
  const [postText, setPostText] = useState('');
  const [linkBtnActive, setlinkBtnActive] = useState(null);
  const [textBtnActive, setTextBtnActive] = useState(null);
  const navigate = useNavigate();
  const [directedFromHome, setDirectedFromHome] = useState(false);
  const [fromHomeSub, setFromHomeSub] = useState(false);
  const [homeSubOpen, setHomeSubOpen] = useState(false);

  // Updates 'title' state for use on input change
  const titleChange = (event) => {
    setTitle(event.target.value);
  };

  // Updates 'URL' state for use on input change
  const urlChange = (event) => {
    setUrl(event.target.value);
  };

  // Updates 'ImgURL' state for use on input change
  const ImgUrlChange = (event) => {
    setIMGURL(event.target.value);
  };

  // Updates 'post text' state for use on input change
  const postTextChange = (event) => {
    setPostText(event.target.value);
  };

  // Opens/closes home subs div
  const toggleHomeSubOpen = () => {
    setHomeSubOpen(!homeSubOpen);
  };

  // Sets chose subreddit into state
  const selectSubFromHome = (subreddit) => {
    setFromHomeSub(subreddit);
    toggleHomeSubOpen();
  };

  // Calls Firebase new post function with post-type
  // state on submit, then auto-forwards
  // user to their newly created post
  const onFormSubmit = async (event) => {
    event.preventDefault();

    if (userId && directedFromHome === false) {
      if (postType === 'link') {
        if (URLValid && titleLength > 0) {
          const newId = await newURLPost(title, url, imgURL, subName);
          navigate(`/r/${subName}/post/${newId}`);
        } else if (URLValid && titleLength < 1) {
          setShowTitleError(true);
        } else if (titleLength > 1 && !URLValid) {
          setURLValid(false);
        }
      }
      if (postType === 'text') {
        if (titleLength > 0) {
          const newId = await newTextPost(title, postText, subName);
          navigate(`/r/${subName}/post/${newId}`);
        } else {
          setShowTitleError(true);
        }
      }
    } else if (userId && directedFromHome) {
      if (fromHomeSub) {
        if (postType === 'link') {
          if (URLValid && titleLength > 0) {
            const newId = await newURLPost(title, url, imgURL, fromHomeSub);
            navigate(`/r/${fromHomeSub}/post/${newId}`);
          } else if (URLValid && titleLength < 1) {
            setShowTitleError(true);
          } else if (titleLength > 1 && !URLValid) {
            setURLValid(false);
          }
        }

        if (postType === 'text') {
          if (titleLength > 0) {
            const newId = await newTextPost(title, postText, fromHomeSub);
            navigate(`/r/${fromHomeSub}/post/${newId}`);
          } else {
            setShowTitleError(true);
          }
        }
      } else {
        toggleHomeSubOpen();
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
    if (title.length > 0) {
      setShowTitleError(false);
    }
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
        setURLValid(true);
      } else {
        setURLValid(false);
      }
    }
  }, [url]);

  // Sets conditional rendering to true if user arrives from link on
  // the home-page, to allow them to select which subreddit
  // they want to post in
  useEffect(() => {
    if (subName === 'home') {
      setDirectedFromHome(true);
    }
  }, [subName]);

  return (
    <div className="post-form-main">
      <div className="post-form-content">
        <h1>
          {subName !== 'home'
            ? `Create a post in r/${subName}`
            : 'Create a post'}
        </h1>
        <hr></hr>
        {subName === 'home' ? (
          <HomeNewPostDropdown
            userId={userId}
            fromHomeSub={fromHomeSub}
            homeSubOpen={homeSubOpen}
            toggleHomeSubOpen={toggleHomeSubOpen}
            selectSubFromHome={selectSubFromHome}
          />
        ) : null}

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
          <label className="title-label" htmlFor="titleInput">
            Title*{' '}
            {showTitleError && <div className="url-error"> enter a title </div>}
          </label>
          <div className="title-input">
            <input
              value={title}
              onChange={titleChange}
              id="titleInput"
              type="text"
              maxLength={300}
            ></input>
            <div className="title-counter">{titleLength}/300</div>
          </div>
          {postType === 'link' ? (
            <>
              <label className="url-label" htmlFor="postURL">
                URL*{' '}
                {URLValid || URLValid === null ? null : (
                  <div className="url-error">- must begin with "https://"</div>
                )}
              </label>
              <input
                value={url}
                onChange={urlChange}
                id="postURL"
                type="text"
              ></input>
              <label htmlFor="imgUrl">Image URL</label>
              <input
                value={imgURL}
                onChange={ImgUrlChange}
                id="imgUrl"
                type="text"
              ></input>
            </>
          ) : (
            <>
              <label htmlFor="postText">Text</label>
              <textarea onChange={postTextChange} id="postText"></textarea>
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
