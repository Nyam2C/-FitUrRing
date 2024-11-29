function fetchUptime() {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = 'Checking uptime...';

    fetch('/api/uptime')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            statusDiv.textContent = `Uptime: ${data}`;
        })
        .catch(error => {
            statusDiv.textContent = `Error: ${error.message}`;
        });
}