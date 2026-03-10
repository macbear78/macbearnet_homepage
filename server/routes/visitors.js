const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// 방문 시 기록 저장
router.post('/', async (req, res) => {
  try {
    const ip = req.ip || req.connection?.remoteAddress || null;
    const userAgent = req.get('User-Agent')?.substring(0, 500) || null;
    const [result] = await pool.query(
      'INSERT INTO visitor_logs (visited_at, ip, user_agent) VALUES (NOW(), ?, ?)',
      [ip, userAgent]
    );
    const [countRows] = await pool.query('SELECT COUNT(*) as total FROM visitor_logs');
    res.json({ total: countRows[0]?.total ?? 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 현재 방문자 수 조회 (메인 페이지용)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM visitor_logs');
    res.json({ total: rows[0]?.total ?? 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 관리자용 통계 조회 (로그인 필요)
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM visitor_logs');
    const [byDayRows] = await pool.query(`
      SELECT DATE(visited_at) as date, COUNT(*) as count
      FROM visitor_logs
      WHERE visited_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(visited_at)
      ORDER BY date DESC
    `);
    const [recentRows] = await pool.query(`
      SELECT id, visited_at, ip, user_agent
      FROM visitor_logs
      ORDER BY visited_at DESC
      LIMIT 100
    `);
    res.json({
      total: totalRows[0]?.total ?? 0,
      byDay: byDayRows,
      recent: recentRows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
