const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { verifyToken, JWT_SECRET } = require('../middleware/auth');
require('dotenv').config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// 관리자 로그인
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '아이디와 비밀번호를 입력하세요.' });
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
  }

  const token = jwt.sign(
    { id: 1, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ success: true, token });
});

// 토큰 검증 (클라이언트 초기화용)
router.get('/verify', verifyToken, (req, res) => {
  res.json({ success: true });
});

module.exports = router;
