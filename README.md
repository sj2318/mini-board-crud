# After6 - 퇴근 후 뭐하지?

Next.js, Express, PostgreSQL을 사용해서 만든 간단한 게시판 CRUD 프로젝트입니다.

퇴근 후에 했던 활동이나 경험을 작성하고 다른 사람의 이야기를 볼 수 있는 게시판 형태로 구현했습니다.

## 주요 기능

- 게시글 목록 조회
- 게시글 상세 조회
- 게시글 작성
- 게시글 수정
- 게시글 삭제

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

## 프로젝트 구조

```text
mini-board-crud/
├─ apps/
│  ├─ api/
│  │  ├─ migrations/
│  │  │  └─ create_posts.sql
│  │  ├─ src/
│  │  │  ├─ routes/
│  │  │  │  └─ posts.ts
│  │  │  ├─ db.ts
│  │  │  └─ index.ts
│  │  ├─ .env.example
│  │  └─ package.json
│  │
│  └─ web/
│     ├─ src/
│     │  └─ app/
│     │     ├─ posts/
│     │     │  ├─ [id]/
│     │     │  │  ├─ edit/
│     │     │  │  │  └─ page.tsx
│     │     │  │  └─ page.tsx
│     │     │  ├─ new/
│     │     │  │  └─ page.tsx
│     │     │  └─ page.tsx
│     │     ├─ globals.css
│     │     └─ layout.tsx
│     └─ package.json
│
├─ compose.yml
├─ .env.example
├─ package.json
└─ yarn.lock