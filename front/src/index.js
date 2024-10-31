import React, { useEffect, useState } from 'react';

function BackendRequest() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://172.20.0.3:8080/uptime')
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h2>Backend Message:</h2>
            <p>{message}</p>
        </div>
    );
}

export default BackendRequest;
