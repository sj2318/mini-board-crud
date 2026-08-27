"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function PostEditPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPost() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}`
        );

        if (!response.ok) {
          throw new Error("게시글을 불러오지 못했습니다.");
        }

        const data: Post = await response.json();

        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error(error);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getPost();
    }
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

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

      router.push(`/detail/${id}`);
    } catch (error) {
      console.error(error);
      setError("게시글을 수정하는 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <p>게시글을 불러오는 중입니다.</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="form-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">이야기 수정</h1>
            <p className="page-description">
              작성한 내용을 수정할 수 있습니다.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">제목</label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력해주세요."
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">내용</label>

            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="내용을 입력해주세요."
              rows={10}
            />
          </div>

          {error && <p>{error}</p>}

          <div className="form-actions">
            <Link
              href={`/detail/${id}`}
              className="button button-secondary"
            >
              취소
            </Link>

            <button
              type="submit"
              className="button button-primary"
              disabled={submitting}
            >
              {submitting ? "수정 중..." : "수정"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}