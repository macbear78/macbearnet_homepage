const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'macbearnet_homepage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDB() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM pages');
    if (rows[0].count === 0) {
      await connection.query(`
        INSERT INTO pages (title, content, slug) VALUES
        ('MacBearNet', '맥베어넷은 응용소프트웨어 공급업체로서 홈페이지, 웹사이트, 데스크탑 소프트웨어, 모바일 앱 솔루션을 공급합니다.', 'home'),
        ('회사 소개', '맥베어넷은 응용소프트웨어 공급업체로서 기업·기관에 안정적인 소프트웨어 솔루션을 공급합니다.', 'about'),
        ('연락처', '맥베어넷 응용소프트웨어 공급업체 | contact@macbearnet.com | 02-1234-5678', 'contact')
      `);
    }
    await connection.query(`
      CREATE TABLE IF NOT EXISTS visitor_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip VARCHAR(45),
        user_agent VARCHAR(500),
        INDEX idx_visited_at (visited_at),
        INDEX idx_visited_date (visited_at)
      )
    `);
    connection.release();
  } catch (err) {
    console.error('DB 초기화 오류:', err.message);
  }
}

module.exports = { pool, initDB };
