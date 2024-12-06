import React from "react";
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
        <div className="content-box"></div>
        <div className="content-box"></div>
        <div className="content-box"></div>
        <div className="content-box"></div>
      </div>
    </div>
  );
}

export default Home;
