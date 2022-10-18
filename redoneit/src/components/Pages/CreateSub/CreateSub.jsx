import './CreateSub.css';
import React, { useEffect, useState } from 'react';
import { set } from 'date-fns';
import SubPreview from './SubPreview/SubPreview';

export default function CreateSub() {
  const [displayName, setDisplayName] = useState('');
  const [URL, setURL] = useState('');
  const [blurb, setBlurb] = useState('');
  const [blurbCharacterCount, setBlurbCharacterCount] = useState(0);
  const [primaryColour, setPrimaryColour] = useState('#93d687');
  const [secondaryColour, setSecondaryColor] = useState('#ca87d6');

  // Rules state
  const [ruleCount, setRuleCount] = useState(1);
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
    setRuleCount((prevCount) => prevCount + 1);
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

  // Updates blurb character count on input change
  useEffect(() => {
    setBlurbCharacterCount(blurb.length);
  }, [blurb]);

  return (
    <div className="create-sub-content">
      <div className="create-sub-body">
        <h1>Create a new subreddit</h1>
        <form>
          <label htmlFor="displayName">Display name</label>
          <input
            onChange={handleDisplayNameChange}
            value={displayName}
            id="displayName"
          ></input>
          <label htmlFor="URL">URL</label>
          <div className="url-input">
            <div className="r-detail">r/</div>
            <input onChange={handleURLChange} value={URL} id="URL"></input>
          </div>
          <label htmlFor="blurb">
            {!blurbCharacterCount > 0
              ? `Subreddit description (max 250 characters)`
              : `Subreddit description  (${blurbCharacterCount}/250 chars.)`}
          </label>
          <textarea
            onChange={handleBlurbChange}
            id="blurb"
            maxLength={250}
            value={blurb}
          ></textarea>
          <div className="rules-inputs">
            <label>Rule 1</label>
            <input
              value={rule1}
              maxLength={100}
              onChange={(event) => setRule1(event.target.value)}
            ></input>
            {ruleCount > 1 ? (
              <>
                <label>Rule 2</label>
                <input
                  value={rule2}
                  maxLength={100}
                  onChange={(event) => setRule2(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleCount > 2 ? (
              <>
                <label>Rule 3</label>
                <input
                  value={rule3}
                  maxLength={100}
                  onChange={(event) => setRule3(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleCount > 3 ? (
              <>
                <label>Rule 4</label>
                <input
                  value={rule4}
                  maxLength={100}
                  onChange={(event) => setRule4(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleCount > 4 ? (
              <>
                <label>Rule 5</label>
                <input
                  value={rule5}
                  maxLength={100}
                  onChange={(event) => setRule5(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleCount > 5 ? (
              <>
                <label>Rule 6</label>
                <input
                  value={rule6}
                  maxLength={100}
                  onChange={(event) => setRule6(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleCount > 6 ? (
              <>
                <label>Rule 7</label>
                <input
                  value={rule7}
                  maxLength={100}
                  onChange={(event) => setRule7(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleCount > 7 ? (
              <>
                <label>Rule 8</label>
                <input
                  value={rule8}
                  maxLength={100}
                  onChange={(event) => setRule8(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleCount > 8 ? (
              <>
                <label>Rule 9</label>
                <input
                  value={rule9}
                  maxLength={100}
                  onChange={(event) => setRule9(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleCount > 9 ? (
              <>
                <label>Rule 10</label>
                <input
                  value={rule10}
                  maxLength={100}
                  onChange={(event) => setRule10(event.target.value)}
                ></input>
              </>
            ) : null}
            {ruleCount < 10 ? (
              <div className="new-rule">
                <button className="new-rule-btn" onClick={incrementRuleCount}>
                  Add another
                </button>
              </div>
            ) : null}
          </div>
          <div className="colour-inputs">
            <div className="primary-colour-picker">
              <label htmlFor="primary-colour">Primary Colour</label>
              <input
                id="primary-colour"
                type="color"
                value={primaryColour}
                onChange={handlePrimaryColourChange}
              ></input>
            </div>
            <div className="secondary-colour-picker">
              <label htmlFor="secondary-colour">Secondary Colour</label>
              <input
                id="secondary-colour"
                type="color"
                value={secondaryColour}
                onChange={handleSecondaryColourChange}
              ></input>
            </div>
          </div>
        </form>
        <SubPreview
          primary={primaryColour}
          secondary={secondaryColour}
          displayName={displayName}
          URL={URL}
        />
      </div>
    </div>
  );
}
