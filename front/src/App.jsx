import react, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Header from './components/Header';
import MainContent from './pages/MainContent';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import './App.css';

function App(){
    const [userId, setUserId] = useState();

    return (
        <Router>
            <div className="App">
                <Header userId={userId} />
                <div>

                </div>
            </div>


            <Routes>
                <Route exact path="/"  element={<MainContent />} />
                <Route path="/signin"  element={<SignIn />} />
                <Route path="/signup"  element={<SignUp />} />
            </Routes>
        </Router>
    );
}

export default App;