import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        // 백엔드 서버로 요청을 보냅니다.
        fetch('http://localhost:8080/')
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Hello from the frontend!</h1>
            <p>Message from backend: {message}</p>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
