import react, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './pages/Home';
import Footer from './components/common/Footer'
import Sign from './pages/Sign';
import HabitTracker from './pages/HabitTracker';
import Goal from './pages/Goal';
import MyPage from './pages/MyPage';
import Workout from './pages/Workout';
import Routine from './pages/Routine';

import './App.css';

function App(){
    const [userId, setUserId] = useState();

    return (
        <Router>
            <div className="App">
                <Header userId={userId} />
                <div id="main-content">
                    <Routes>
                        <Route exact path="/"  element={<Home />} />
                        <Route path="/sign"  element={<Sign />} />
                        <Route path="/habitTracker" element={<HabitTracker />} />
                        <Route path="/habitTracker/Goal" element={<Goal />} />
                        <Route path="/workout"  element={<Workout />} />
                        <Route path="/routine"  element={<Routine />} />
                        <Route path="/mypage" element={<MyPage />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;