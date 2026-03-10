const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, slug, created_at FROM pages ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM pages WHERE slug = ?',
      [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: '페이지를 찾을 수 없습니다.' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
