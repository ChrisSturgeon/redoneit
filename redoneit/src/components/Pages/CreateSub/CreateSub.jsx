import './CreateSub.css';
import React, { useEffect, useState } from 'react';
import { set } from 'date-fns';
import SubPreview from './SubPreview/SubPreview';

export default function CreateSub() {
  const [displayName, setDisplayName] = useState('');
  const [displayNameCounter, setDisplayNameCounter] = useState(0);
  const [URL, setURL] = useState('');
  const [URLCounter, setURLCounter] = useState(0);
  const [blurb, setBlurb] = useState('');
  const [blurbCharacterCount, setBlurbCharacterCount] = useState(0);
  const [primaryColour, setPrimaryColour] = useState('#93d687');
  const [secondaryColour, setSecondaryColor] = useState('#ca87d6');

  // Rules state
  const [ruleDisplayCount, setRuleDisplayCount] = useState(1);
  const [rule1, setRule1] = useState('');
  const [rule2, setRule2] = useState('');
  const [rule3, setRule3] = useState('');
  const [rule4, setRule4] = useState('');
  const [rule5, setRule5] = useState('');
  const [rule6, setRule6] = useState('');
  const [rule7, setRule7] = useState('');
  const [rule8, setRule8] = useState('');
  const [rule9, setRule9] = useState('');
  const [rule10, setRule10] = useState('');

  const incrementRuleCount = (event) => {
    event.preventDefault();
    setRuleDisplayCount((prevCount) => prevCount + 1);
  };

  // Updates displayName state for use on input change
  const handleDisplayNameChange = (event) => {
    setDisplayName(event.target.value);
  };

  // Updates 'URL' state for use on input change
  const handleURLChange = (event) => {
    setURL(event.target.value);
  };

  // Updates 'blurb' state for use on input change
  const handleBlurbChange = (event) => {
    setBlurb((prevBlurb) => event.target.value);
  };

  // Updates 'primaryColour' state for use on picker change
  const handlePrimaryColourChange = (event) => {
    setPrimaryColour(event.target.value);
  };

  // Updates 'secondaryColour' state for use on picker change
  const handleSecondaryColourChange = (event) => {
    setSecondaryColor(event.target.value);
  };

  // Updates display name character count on input change
  useEffect(() => {
    setDisplayNameCounter(displayName.length);
  }, [displayName]);

  // Updates display name character count on input change
  useEffect(() => {
    setURLCounter(URL.length);
  }, [URL]);

  // Updates blurb character count on input change
  useEffect(() => {
    setBlurbCharacterCount(blurb.length);
  }, [blurb]);

  return (
    <div className="create-sub-content">
      <div className="create-sub-body">
        <h1>Create a new subreddit</h1>
        <form>
          <fieldset>
            <legend>General</legend>
            <label htmlFor="displayName">Name</label>
            <div className="sub-input">
              <input
                onChange={handleDisplayNameChange}
                value={displayName}
                id="displayName"
                maxLength={25}
              ></input>
              <div className="input-counter">{displayNameCounter}/25</div>
            </div>
            <label htmlFor="URL">URL</label>
            <div className="url-input">
              <div className="r-detail">r/</div>
              <div className="sub-input">
                <input
                  onChange={handleURLChange}
                  value={URL}
                  id="URL"
                  maxLength={25}
                ></input>
                <div className="input-counter">{URLCounter}/25</div>
              </div>
            </div>
            <span>
              <label htmlFor="blurb">Subreddit description</label>
              <div className="input-counter-mobile">
                ({blurbCharacterCount}/250 chars)
              </div>
            </span>
            <div className="sub-input">
              <textarea
                onChange={handleBlurbChange}
                id="blurb"
                maxLength={250}
                value={blurb}
              ></textarea>
              <div className="input-counter-large">
                {blurbCharacterCount}/250
              </div>
            </div>
          </fieldset>
          <fieldset className="rules-inputs">
            <legend>Rules</legend>
            <label>Rule 1</label>
            <input
              value={rule1}
              maxLength={100}
              onChange={(event) => setRule1(event.target.value)}
            ></input>
            {ruleDisplayCount > 1 ? (
              <>
                <label>Rule 2</label>
                <input
                  value={rule2}
                  maxLength={100}
                  onChange={(event) => setRule2(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleDisplayCount > 2 ? (
              <>
                <label>Rule 3</label>
                <input
                  value={rule3}
                  maxLength={100}
                  onChange={(event) => setRule3(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleDisplayCount > 3 ? (
              <>
                <label>Rule 4</label>
                <input
                  value={rule4}
                  maxLength={100}
                  onChange={(event) => setRule4(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleDisplayCount > 4 ? (
              <>
                <label>Rule 5</label>
                <input
                  value={rule5}
                  maxLength={100}
                  onChange={(event) => setRule5(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleDisplayCount > 5 ? (
              <>
                <label>Rule 6</label>
                <input
                  value={rule6}
                  maxLength={100}
                  onChange={(event) => setRule6(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleDisplayCount > 6 ? (
              <>
                <label>Rule 7</label>
                <input
                  value={rule7}
                  maxLength={100}
                  onChange={(event) => setRule7(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleDisplayCount > 7 ? (
              <>
                <label>Rule 8</label>
                <input
                  value={rule8}
                  maxLength={100}
                  onChange={(event) => setRule8(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleDisplayCount > 8 ? (
              <>
                <label>Rule 9</label>
                <input
                  value={rule9}
                  maxLength={100}
                  onChange={(event) => setRule9(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleDisplayCount > 9 ? (
              <>
                <label>Rule 10</label>
                <input
                  value={rule10}
                  maxLength={100}
                  onChange={(event) => setRule10(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleDisplayCount < 10 ? (
              <div className="new-rule">
                <button className="new-rule-btn" onClick={incrementRuleCount}>
                  Add another
                </button>
              </div>
            ) : null}
          </fieldset>
          <fieldset>
            <legend>Colours</legend>
            <div className="colour-inputs">
              <div className="primary-colour-picker">
                <label htmlFor="primary-colour">Primary</label>
                <input
                  id="primary-colour"
                  type="color"
                  value={primaryColour}
                  onChange={handlePrimaryColourChange}
                ></input>
              </div>
              <div className="secondary-colour-picker">
                <label htmlFor="secondary-colour">Secondary</label>
                <input
                  id="secondary-colour"
                  type="color"
                  value={secondaryColour}
                  onChange={handleSecondaryColourChange}
                ></input>
              </div>
            </div>
            <div className="preview-port">
              <SubPreview
                primary={primaryColour}
                secondary={secondaryColour}
                displayName={displayName}
                URL={URL}
              />
            </div>
          </fieldset>
          <button type="submit" className="create-button">
            Create subreddit
          </button>
        </form>
      </div>
    </div>
  );
}
