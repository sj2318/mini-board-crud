import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import postRoutes from "./routes/post.routes.js";


const app = express();
const port = Number(process.env.PORT || process.env.API_PORT) || 4000;


// FrontEnd 요청 허용
app.use(
  cors({
    origin: process.env.WEB_ORIGIN,
  })
);


// JSON 데이터 사용
app.use(express.json());


// BackEnd 서버 상태 확인
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});


// DB 연결 상태 확인
app.get("/api/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");

    res.json({
      status: "ok",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "데이터베이스 연결에 실패했습니다.",
    });
  }
});


// 게시글 API 연결
app.use("/api/posts", postRoutes);


// 서버 실행
app.listen(port, "0.0.0.0", () => {
  console.log(`API server running on port ${port}`);
});