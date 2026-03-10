-- MacBearNet 홈페이지용 MariaDB 스키마
CREATE DATABASE IF NOT EXISTS macbearnet_homepage;
USE macbearnet_homepage;

CREATE TABLE IF NOT EXISTS pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO pages (title, content, slug) VALUES
('MacBearNet', '맥베어넷(MacBearNet)은 응용소프트웨어 공급업체로서 기업·공공·개인에 최적화된 소프트웨어 솔루션을 공급합니다.', 'home'),
('회사 소개', '맥베어넷(MacBearNet)은 응용소프트웨어 공급업체로서 기업·기관 고객에게 안정적인 소프트웨어 솔루션을 공급합니다.', 'about'),
('연락처', '맥베어넷(MacBearNet) 응용소프트웨어 공급업체\n이메일: contact@macbearnet.com\n전화: 02-1234-5678', 'contact');
