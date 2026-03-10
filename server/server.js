const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDB } = require('./config/db');
const pagesRouter = require('./routes/pages');
const visitorsRouter = require('./routes/visitors');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// CORS: 프로덕션에서는 프론트엔드 도메인만 허용 (S3/CloudFront URL)
const corsOptions = isProd && process.env.CORS_ORIGIN
  ? { origin: process.env.CORS_ORIGIN.split(',').map(o => o.trim()) }
  : {};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/pages', pagesRouter);
app.use('/api/visitors', visitorsRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '서버가 정상 작동 중입니다.' });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  });
}).catch(err => {
  console.error('서버 시작 실패:', err);
});
