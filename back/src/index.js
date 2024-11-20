const express = require('express');
const cors = require('cors'); // CORS 미들웨어 추가
const { MongoClient } = require('mongodb'); // MongoDB 클라이언트 추가
require('dotenv').config(); // .env 파일 로드
const app = express();
const port = 8080;

app.use(cors()); // 모든 요청에 대해 CORS 허용

const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

console.log(db_user, db_password, db_name);

// 서버 시작 시간을 기록합니다.
const serverStartTime = Date.now();

// MongoDB 연결 설정
const uri = `mongodb://${db_user}:${db_password}@wss-db:27017/${db_name}`;
const client = new MongoClient(uri);

// 컬렉션 목록을 반환하는 엔드포인트 추가
app.get('/api/collections', async (req, res) => {
    try {
        await client.connect();
        const database = client.db(db_name);
        const collections = await database.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);
        res.json(collectionNames);
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).send('Error fetching collections');
    } finally {
        await client.close();
    }
});

// 업타임을 계산하여 반환하는 엔드포인트를 추가합니다.
app.get('/api/uptime', (req, res) => {
    const uptime = Date.now() - serverStartTime;
    console.log(`Server uptime: ${Math.floor(uptime / 1000)} seconds`);
    res.send(`Server uptime: ${Math.floor(uptime / 1000)} seconds`);
});

app.listen(port, () => {
    console.log(`Backend server is running on http://172.20.0.3:${port}`);
});