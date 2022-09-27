import NavBar from './components/NavBar';
import Home from './components/Home';
import Subreddit from './components/Subreddit';
import { Route, Routes } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="subreddit" element={<Subreddit />}></Route>
      </Routes>
    </div>
  );
}

export default App;
