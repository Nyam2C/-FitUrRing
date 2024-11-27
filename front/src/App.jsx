import react, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer'
import Sign from './pages/Sign';
import Workout from './pages/Workout';

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
                        <Route path="/workout"  element={<Workout />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;