import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import "./Home.css";

function Home() {
  return (
    <div className="Home">
      <header className="hero">
        <h1>Experience Fitness Your Way </h1>
        <h2>with Custom Workout Routine</h2>
        <p>Unlock a Personalized Training Plan Designed to Fit Your Goals, Schedule, and Lifestyle.</p>
      </header>
      <div className="content-grid">
        <ul>
          <li>
            <Link to="/workout">
              <span>Workout</span>
            </Link>
          </li>
          <li>
            <Link to="/habitTracker">
              <span>Habit Tracker</span>
            </Link>
          </li>
          <li>
            <Link to="/routine">
              <span>Routine</span>
            </Link>
          </li>
          <li>
            <Link to="/diet">
              <span>Diet</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
