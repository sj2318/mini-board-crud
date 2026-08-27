import { pool } from "../db.js";
import type { PostVO } from "../vo/post.vo.js";
import type { PostDTO } from "../dto/post.dto.js";

export async function findAll(): Promise<PostVO[]> {
  const result = await pool.query<PostVO>(`
    SELECT
      id,
      title,
      content,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM posts
    ORDER BY created_at DESC
  `);

  return result.rows;
}

export async function findById(id: number): Promise<PostVO | null> {
  const result = await pool.query<PostVO>(
    `
      SELECT
        id,
        title,
        content,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM posts
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

export async function create(dto: PostDTO): Promise<PostVO> {
  const result = await pool.query<PostVO>(
    `
      INSERT INTO posts (title, content)
      VALUES ($1, $2)
      RETURNING
        id,
        title,
        content,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [dto.title, dto.content]
  );

  const post = result.rows[0];

  if (!post) {
    throw new Error("게시글 등록에 실패했습니다.");
  }

  return post;
}


export async function update(
  id: number,
  dto: PostDTO
): Promise<PostVO | null> {
  const result = await pool.query<PostVO>(
    `
      UPDATE posts
      SET
        title = $1,
        content = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING
        id,
        title,
        content,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [dto.title, dto.content, id]
  );

  return result.rows[0] || null;
}


export async function remove(id: number): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM posts
      WHERE id = $1
      RETURNING id
    `,
    [id]
  );

  return result.rows.length > 0;
}