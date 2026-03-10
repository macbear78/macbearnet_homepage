# AWS S3 + Lightsail 배포 가이드

프론트엔드(S3)와 백엔드+DB(Lightsail) 분리 배포 시 참고 문서입니다.

---

## 1. 아키텍처

```
[사용자] → [S3/CloudFront] (Vue 정적 파일)
                ↓
         [Lightsail] (Node.js API + MariaDB)
```

---

## 2. 프론트엔드 (S3)

### 2.1 빌드

```bash
cd client

# .env.production 또는 빌드 시 환경변수 설정
# VITE_API_BASE=http://api.macbearnet.co.kr:3000
npm run build
```

`dist/` 폴더가 생성됩니다.

### 2.2 S3 버킷 설정

1. S3 버킷 생성 (예: `macbearnet-homepage`)
2. **정적 웹 사이트 호스팅** 활성화
   - 인덱스 문서: `index.html`
   - **오류 문서: `index.html`** ← Vue Router(history 모드)용, 404→index.html 리다이렉트
3. 버킷 정책에서 퍼블릭 읽기 허용 (또는 CloudFront 사용 시 OAC)
4. `dist/` 내용 업로드

### 2.3 CloudFront (선택, 권장)

- HTTPS, CDN 캐싱
- Origin: S3 버킷
- **커스텀 오류 응답**: 403, 404 → `/index.html` 반환 (200)

### 2.4 환경변수

빌드 전 `client/.env.production` 생성:

```
VITE_API_BASE=http://api.macbearnet.co.kr:3000
```

또는 CI/CD에서:

```bash
VITE_API_BASE=http://api.macbearnet.co.kr:3000 npm run build
```

---

## 3. 백엔드 (Lightsail)

### 3.1 인스턴스

- Node.js 18+ 이미지 또는 Ubuntu + Node 수동 설치
- MariaDB: 별도 인스턴스 또는 동일 인스턴스에 설치

### 3.2 MariaDB 설정

```bash
# 동일 인스턴스에 MariaDB 설치 시
sudo apt install mariadb-server
sudo mysql_secure_installation

# DB 생성
mysql -u root -p < database/schema.sql
```

원격 DB 사용 시 `DB_HOST`를 Lightsail MariaDB 인스턴스 Private IP로 설정.

### 3.3 Node.js 서버

```bash
cd server
npm install --production
```

### 3.4 환경변수 (server/.env)

```env
NODE_ENV=production
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=비밀번호
DB_NAME=macbearnet_homepage

ADMIN_USERNAME=admin
ADMIN_PASSWORD=강한비밀번호
JWT_SECRET=랜덤긴문자열

# 프론트엔드 도메인 (CORS)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### 3.5 PM2로 프로세스 관리

```bash
npm install -g pm2
pm2 start server.js --name macbearnet-api
pm2 save
pm2 startup
```

### 3.6 nginx 리버스 프록시 (선택)

- 80/443 → Node 3000 포트
- SSL 인증서 (Let's Encrypt)

---

## 4. 체크리스트

| 항목 | 확인 |
|------|------|
| `VITE_API_BASE` 빌드 시 설정 | |
| S3 오류 문서 = index.html | |
| CORS_ORIGIN에 프론트 도메인 포함 | |
| ADMIN_PASSWORD, JWT_SECRET 변경 | |
| DB 방화벽(3306) Lightsail 내부만 허용 | |
| API 포트(3000) 보안그룹에서 80/443만 허용 권장 | |

---

## 5. 참고

- API와 프론트가 같은 도메인(서브도메인 포함)이면 CORS 이슈 없음
- CloudFront에서 `/api`를 Lightsail Origin으로 전달하는 방식도 가능
