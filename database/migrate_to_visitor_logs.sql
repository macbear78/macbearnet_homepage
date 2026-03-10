-- 기존 visitors 테이블에서 visitor_logs로 마이그레이션
-- (visitors의 total 값만 있고 개별 방문 시각은 없으므로 기록 이전 불가)
USE macbearnet_homepage;

DROP TABLE IF EXISTS visitors;

CREATE TABLE IF NOT EXISTS visitor_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip VARCHAR(45),
  user_agent VARCHAR(500),
  INDEX idx_visited_at (visited_at),
  INDEX idx_visited_date (visited_at)
);
