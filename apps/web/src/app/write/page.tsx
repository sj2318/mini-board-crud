"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostWritePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`,
        {
          method: "POST",
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
        throw new Error("게시글 등록에 실패했습니다.");
      }

      router.push("/main");
    } catch (error) {
      console.error(error);
      setError("게시글을 등록하는 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-container">
      <div className="form-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">이야기 작성</h1>
            <p className="page-description">
              퇴근 후에 있었던 이야기를 작성해보세요.
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
            <Link href="/main" className="button button-secondary">
              취소
            </Link>

            <button
              type="submit"
              className="button button-primary"
              disabled={submitting}
            >
              {submitting ? "등록 중..." : "등록"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}