# After6 - 퇴근 후 뭐하지?

Next.js, Express, PostgreSQL을 사용해서 만든 간단한 게시판 CRUD 프로젝트입니다.

퇴근 후에 했던 활동이나 경험을 작성하고 다른 사람의 이야기를 볼 수 있는 게시판 형태로 구현했습니다.

서비스는 AWS EC2에 배포했으며, Nginx를 통해 FrontEnd와 BackEnd를 연결했습니다.

---

## 주요 기능

- 게시글 목록 조회
- 게시글 상세 조회
- 게시글 작성
- 게시글 수정
- 게시글 삭제
- FrontEnd / BackEnd API 연동
- PostgreSQL 데이터 저장 및 조회
- AWS EC2 외부 배포

---

## 기술 스택

### FrontEnd

- Next.js 15
- React 19
- TypeScript

### BackEnd

- Node.js
- Express 5
- TypeScript

### Database

- PostgreSQL 16

### 개발 환경

- Yarn 4
- Docker Compose
- VS Code

### 배포 환경

- AWS EC2
- Ubuntu
- Nginx
- Docker

---

## 프로젝트 구조

```text
mini-board-crud/
│
├─ apps/
│  │
│  ├─ api/
│  │  ├─ migrations/
│  │  │  └─ create_posts.sql
│  │  │
│  │  ├─ src/
│  │  │  ├─ controller/
│  │  │  │  └─ post.controller.ts
│  │  │  │
│  │  │  ├─ dto/
│  │  │  │  └─ post.dto.ts
│  │  │  │
│  │  │  ├─ mapper/
│  │  │  │  └─ post.mapper.ts
│  │  │  │
│  │  │  ├─ routes/
│  │  │  │  └─ post.routes.ts
│  │  │  │
│  │  │  ├─ service/
│  │  │  │  └─ post.service.ts
│  │  │  │
│  │  │  ├─ vo/
│  │  │  │  └─ post.vo.ts
│  │  │  │
│  │  │  ├─ db.ts
│  │  │  └─ index.ts
│  │  │
│  │  ├─ .env.example
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  │
│  └─ web/
│     ├─ src/
│     │  └─ app/
│     │     ├─ main/
│     │     │  └─ page.tsx
│     │     │
│     │     ├─ write/
│     │     │  └─ page.tsx
│     │     │
│     │     ├─ detail/
│     │     │  └─ [id]/
│     │     │     └─ page.tsx
│     │     │
│     │     ├─ edit/
│     │     │  └─ [id]/
│     │     │     └─ page.tsx
│     │     │
│     │     ├─ globals.css
│     │     ├─ layout.tsx
│     │     └─ page.tsx
│     │
│     ├─ .env.example
│     └─ package.json
│
├─ compose.yml
├─ .env.example
├─ package.json
└─ yarn.lock
```

---

## BackEnd 구조

BackEnd는 역할별로 분리하여 구성했습니다.

```text
Request
  ↓
Routes
  ↓
Controller
  ↓
Service
  ↓
Mapper
  ↓
PostgreSQL
```

### 역할

- `routes`
  - API URL과 HTTP Method를 Controller에 연결합니다.

- `controller`
  - 요청값을 받고 유효성을 확인한 뒤 Service를 호출합니다.

- `service`
  - 게시글 관련 비즈니스 로직을 처리합니다.

- `mapper`
  - PostgreSQL에 실행할 SQL을 작성하고 조회/등록/수정/삭제를 처리합니다.

- `dto`
  - 게시글 등록 및 수정 요청에 사용하는 데이터 구조를 정의합니다.

- `vo`
  - 데이터베이스에서 조회한 게시글 데이터 구조를 정의합니다.

- `db.ts`
  - PostgreSQL 연결 설정을 담당합니다.

- `index.ts`
  - Express 애플리케이션 초기 설정과 API Route 등록을 담당합니다.

---

## FrontEnd 화면 구성

| 경로 | 기능 |
| --- | --- |
| `/` | `/main`으로 이동 |
| `/main` | 게시글 목록 조회 |
| `/write` | 게시글 작성 |
| `/detail/[id]` | 게시글 상세 조회 |
| `/edit/[id]` | 게시글 수정 |

---

## API 구성

| Method | URL | 기능 |
| --- | --- | --- |
| GET | `/api/health` | BackEnd 상태 확인 |
| GET | `/api/db-health` | Database 연결 상태 확인 |
| GET | `/api/posts` | 게시글 목록 조회 |
| GET | `/api/posts/:id` | 게시글 상세 조회 |
| POST | `/api/posts` | 게시글 등록 |
| PUT | `/api/posts/:id` | 게시글 수정 |
| DELETE | `/api/posts/:id` | 게시글 삭제 |

---

## 데이터베이스

게시글 데이터는 PostgreSQL의 `posts` 테이블에 저장됩니다.

```sql
CREATE TABLE posts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 로컬 실행 방법

### 1. PostgreSQL 실행

```bash
docker compose up -d postgres
```

### 2. BackEnd 실행

```bash
yarn workspace @guide/api dev
```

BackEnd 기본 주소:

```text
http://localhost:4000
```

### 3. FrontEnd 실행

```bash
yarn workspace @guide/web dev
```

FrontEnd 기본 주소:

```text
http://localhost:3000
```

---

## 배포 구성

AWS EC2 환경에서 다음 구조로 실행됩니다.

```text
사용자
  ↓
Nginx :80
  ├─ /        → Next.js :3000
  └─ /api     → Express :4000
                         ↓
                  PostgreSQL :5432
```

PostgreSQL은 EC2 내부의 Docker 컨테이너에서 실행됩니다.

---