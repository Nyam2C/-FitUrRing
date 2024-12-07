import react, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


import Header from './components/common/Header';
import Home from './pages/Home';
import Footer from './components/common/Footer'
import Sign from './pages/Sign';
import MyPage from './pages/MyPage';
import Routine from './pages/routine/Routine';
import Diet from './pages/diet/Diet';

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
                        <Route path="/mypage" element={<MyPage />} />
                        // <Route path="/routine"  element={<Routine />} />
                        <Route path="/diet"  element={<Diet />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;