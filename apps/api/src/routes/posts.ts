import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, content, created_at, updated_at
      FROM posts
      ORDER BY id DESC
    `);
    

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 목록 조회 중 오류가 발생했습니다.",
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "제목과 내용을 입력해주세요.",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO posts (title, content)
        VALUES ($1, $2)
        RETURNING id, title, content, created_at, updated_at
      `,
      [title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 생성 중 오류가 발생했습니다.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        SELECT id, title, content, created_at, updated_at
        FROM posts
        WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 조회 중 오류가 발생했습니다.",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;


    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "제목과 내용을 입력해주세요.",
      });
    }       
    const result = await pool.query(
      `
        UPDATE posts
        SET title = $1, content = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING id, title, content, created_at, updated_at
      `,
      [title, content, id]
    );  

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 수정 중 오류가 발생했습니다.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        DELETE FROM posts
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    res.json({
      message: "게시글이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 삭제 중 오류가 발생했습니다.",
    });
  }
});

export default router;

