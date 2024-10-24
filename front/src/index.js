import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());
        }, 1000);

        return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 인터벌을 정리합니다.
    }, []);

    return (
        <div>
            <h1>Hello from the frontend!</h1>
            <p>Current Time: {currentTime}</p>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
