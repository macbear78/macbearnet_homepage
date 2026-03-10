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
('MacBearNet', '맥베어넷(MacBearNet)은 응용소프트웨어 공급업체로서 기업·공공·개인에 최적화된 소프트웨어 솔루션을 공급합니다. 홈페이지, 웹사이트, 데스크탑 응용소프트웨어, 모바일 애플리케이션 등 업무 효율화와 비즈니스 성장을 위한 전문 솔루션을 제공합니다.', 'home'),
('회사 소개', '맥베어넷(MacBearNet)은 응용소프트웨어 공급업체로서 기업·기관 고객에게 안정적인 소프트웨어 솔루션을 공급합니다.\n\n■ 홈페이지 솔루션 공급\n기업 홈페이지 구축을 위한 맞춤형 웹 솔루션 공급 및 유지보수\n\n■ 웹사이트 솔루션 공급\n전자상거래, 예약·관리시스템 등 비즈니스용 웹 애플리케이션 공급\n\n■ 데스크탑 응용소프트웨어 공급\nWindows·Mac 플랫폼용 업무용 애플리케이션 개발 및 공급\n\n■ 모바일 애플리케이션 공급\niOS·Android 기업용·컨슈머 앱 개발 및 공급\n\n신뢰성 있는 기술력과 풍부한 공급 실적으로 고객사의 디지털 전환을 지원합니다.', 'about'),
('연락처', '맥베어넷(MacBearNet) 응용소프트웨어 공급업체\n\n이메일: contact@macbearnet.com\n전화: 02-1234-5678\n\n솔루션 문의·도입 상담·기술 지원 요청을 환영합니다.', 'contact');

-- 방문 기록 (방문 시점 기록)
CREATE TABLE IF NOT EXISTS visitor_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip VARCHAR(45),
  user_agent VARCHAR(500),
  INDEX idx_visited_at (visited_at),
  INDEX idx_visited_date (visited_at)
);
