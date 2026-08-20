"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }

    try {
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

      router.push("/posts");
    } catch (error) {
      console.error(error);
      setError("게시글 등록 중 오류가 발생했습니다.");
    }
  };

return (
  <main className="page-container">
    <div className="form-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">이야기 작성</h1>
          <p className="page-description">
            오늘 퇴근 후 어떤 시간을 보냈나요?
            <br />
            다른 사람들과 경험을 공유해보세요.
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
            placeholder="어떤 활동을 했나요?"
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
            placeholder="퇴근 후 경험을 자유롭게 적어주세요."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <div className="form-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => router.push("/posts")}
          >
            취소
          </button>

          <button type="submit" className="button button-primary">
            등록
          </button>
        </div>
      </form>
    </div>
  </main>
);
}