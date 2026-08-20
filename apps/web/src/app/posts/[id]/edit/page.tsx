"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("게시글을 불러올 수 없습니다.");
        }

        return response.json();
      })
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch((error) => {
        console.error(error);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("게시글 수정에 실패했습니다.");
      }

      router.push(`/posts/${id}`);
    } catch (error) {
      console.error(error);
      setError("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <p>게시글을 불러오는 중입니다.</p>;
  }

return (
  <main className="page-container">
    <div className="form-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">게시글 수정</h1>

          <p className="page-description">
            작성한 내용을 수정할 수 있어요.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            제목
          </label>

          <input
            id="title"
            type="text"
            className="form-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">
            내용
          </label>

          <textarea
            id="content"
            className="form-textarea"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <div className="form-actions">
          <Link
            href={`/posts/${id}`}
            className="button button-secondary"
          >
            취소
          </Link>

          <button type="submit" className="button button-primary">
            수정
          </button>
        </div>
      </form>
    </div>
  </main>
);
}