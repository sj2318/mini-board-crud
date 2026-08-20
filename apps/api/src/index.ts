import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import postsRouter from "./routes/posts.js";

const app = express();

app.use(
  cors({
    origin: process.env.WEB_ORIGIN,
  })
);

app.use(express.json());

const port = Number(process.env.API_PORT) || 4000;

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

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
    });
  }
});

app.use("/api/posts", postsRouter);

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});