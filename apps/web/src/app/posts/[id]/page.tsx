"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("게시글을 불러올 수 없습니다.");
        }

        return response.json();
      })
      .then((data) => {
        setPost(data);
      })
      .catch((error) => {
        console.error(error);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      });
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("게시글을 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("게시글 삭제에 실패했습니다.");
      }

      router.push("/posts");
    } catch (error) {
      console.error(error);
      setError("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!post) {
    return <p>게시글을 불러오는 중입니다.</p>;
  }

return (
  <main className="page-container">
    <Link href="/posts" className="button button-secondary">
      ← 목록으로
    </Link>

    <div style={{ height: "20px" }} />

    <article className="post-detail">
      <h1 className="post-detail-title">{post.title}</h1>

      <p className="post-detail-date">
        작성일 {new Date(post.created_at).toLocaleString("ko-KR")}
      </p>

      <div className="post-detail-content">
        {post.content}
      </div>

      <div className="post-detail-actions">
        <Link
          href={`/posts/${post.id}/edit`}
          className="button button-secondary"
        >
          수정
        </Link>

        <button
          type="button"
          className="button button-danger"
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
    </article>
  </main>
);
}