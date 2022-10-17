import './HomeNewPostDropdown.css';
import { useState, useEffect } from 'react';
import { getUserSubscriptions } from '../../../firebase';

export default function HomeNewPostDropdown({ userId, dropDownSelect }) {
  const [userSubscriptions, setUserSubscriptions] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  // On mount if user is logged in fetches which subreddits they're
  // subscribed to, and sets these into state as array
  // for use in fetching relevant top posts for each
  useEffect(() => {
    const getMySubscriptions = async () => {
      if (userId) {
        const userSubscriptions = await getUserSubscriptions();
        setUserSubscriptions(userSubscriptions);
      }
    };
    getMySubscriptions();
  }, [userId]);

  const handleChange = (event) => {
    setSelectedSub(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedSub) dropDownSelect(selectedSub);
  };

  if (userSubscriptions) {
    return (
      <div>
        <form className="home-newpost-form" onSubmit={handleSubmit}>
          <label htmlFor="subreddit-select">Subreddit:</label>
          <select onChange={handleChange} id="subreddit-select">
            <option defaultValue={'select'} value={false}>
              ---
            </option>
            {userSubscriptions.map((sub) => {
              return (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              );
            })}
          </select>
          <button type="submit">Confirm</button>
        </form>
      </div>
    );
  }
}
