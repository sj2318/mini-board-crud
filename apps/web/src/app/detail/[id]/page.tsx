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

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
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

        setPost(data);
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

  async function handleDelete() {
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

      router.push("/main");
    } catch (error) {
      console.error(error);
      setError("게시글을 삭제하는 중 오류가 발생했습니다.");
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <p>게시글을 불러오는 중입니다.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <p>{error}</p>

        <Link href="/main" className="button button-secondary">
          목록으로
        </Link>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="page-container">
        <p>게시글을 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <Link href="/main" className="button button-secondary">
        목록으로
      </Link>

      <div className="post-detail">
        <h1>{post.title}</h1>

        <p className="post-detail-date">
          {new Date(post.createdAt).toLocaleString("ko-KR")}
        </p>

        <div className="post-detail-content">
          {post.content}
        </div>

        <div className="post-detail-actions">
          <Link
            href={`/edit/${post.id}`}
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
      </div>
    </main>
  );
}