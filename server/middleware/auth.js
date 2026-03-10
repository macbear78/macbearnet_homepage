const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'macbearnet-secret-key-change-in-production';

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: '토큰이 만료되었거나 유효하지 않습니다.' });
  }
}

module.exports = { verifyToken, JWT_SECRET };
