# MacBearNet 홈페이지

Vue.js, Node.js, MariaDB로 구축된 풀스택 웹 애플리케이션입니다.

## 기술 스택

- **프론트엔드**: Vue 3, Vue Router, Vite
- **백엔드**: Node.js, Express
- **데이터베이스**: MariaDB

## 사전 요구사항

- Node.js 18+
- MariaDB 10.5+ (또는 MySQL 8+)
- npm 또는 yarn

## 설치 및 실행

### 1. 데이터베이스 설정

MariaDB에서 데이터베이스와 테이블을 생성합니다:

```bash
mysql -u root -p < database/schema.sql
```

또는 MariaDB 클라이언트에서 직접 실행:

```sql
CREATE DATABASE IF NOT EXISTS macbearnet;
USE macbearnet;
-- schema.sql 내용 실행
```

### 2. 서버 설정

```bash
cd server
npm install
cp .env.example .env
# .env 파일에서 DB 비밀번호 등 수정
npm run dev
```

서버는 http://localhost:3000 에서 실행됩니다.

### 3. 클라이언트 설정

새 터미널에서:

```bash
cd client
npm install
npm run dev
```

클라이언트는 http://localhost:5173 에서 실행됩니다.

### 4. 접속

브라우저에서 http://localhost:5173 접속

## 환경 변수 (server/.env)

| 변수 | 설명 | 기본값 |
|------|------|--------|
| PORT | 서버 포트 | 3000 |
| DB_HOST | MariaDB 호스트 | localhost |
| DB_PORT | MariaDB 포트 | 3306 |
| DB_USER | DB 사용자 | root |
| DB_PASSWORD | DB 비밀번호 | - |
| DB_NAME | DB 이름 | macbearnet |

## 프로젝트 구조

```
macbearnet_homepage/
├── client/           # Vue.js 프론트엔드
│   ├── src/
│   │   ├── views/    # 페이지 컴포넌트
│   │   ├── router/   # Vue Router 설정
│   │   └── App.vue
│   └── index.html
├── server/           # Node.js 백엔드
│   ├── config/       # DB 연결 설정
│   ├── routes/       # API 라우트
│   └── server.js
├── database/         # DB 스키마
│   └── schema.sql
└── README.md
```

## API 엔드포인트

- `GET /api/health` - 서버 상태 확인
- `GET /api/pages` - 모든 페이지 목록
- `GET /api/pages/:slug` - slug로 페이지 조회 (home, about, contact)
