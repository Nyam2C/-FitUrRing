const express = require('express');
const cors = require('cors'); // CORS 미들웨어 추가
const app = express();
const port = 8080;

app.use(cors()); // 모든 요청에 대해 CORS 허용

// 서버 시작 시간을 기록합니다.
const serverStartTime = Date.now();

// 업타임을 계산하여 반환하는 엔드포인트를 추가합니다.
app.get('/api/uptime', (req, res) => {
    const uptime = Date.now() - serverStartTime;
    console.log(`Server uptime: ${Math.floor(uptime / 1000)} seconds`);
    res.send(`Server uptime: ${Math.floor(uptime / 1000)} seconds`);
});

app.listen(port, () => {
    console.log(`Backend server is running on http://172.20.0.3:${port}`);
});
