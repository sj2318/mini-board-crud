"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`
        );

        if (!response.ok) {
          throw new Error("게시글 목록 조회 실패");
        }

        const data: Post[] = await response.json();

        setPosts(data);
      } catch (error) {
        console.error(error);
        setError("게시글 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    getPosts();
  }, []);

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
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">After6</h1>
          <p className="page-description">
            퇴근 후 뭐하지? 다른 사람들의 퇴근 후 이야기를 둘러보세요.
          </p>
        </div>

        <Link href="/write" className="button button-primary">
          글 작성
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>아직 등록된 게시글이 없습니다.</p>

          <Link href="/write" className="button button-primary">
            첫 글 작성하기
          </Link>
        </div>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/detail/${post.id}`}
              className="post-card"
            >
              <h2 className="post-card-title">{post.title}</h2>

              <p className="post-card-content">{post.content}</p>

              <p className="post-card-date">
                {new Date(post.createdAt).toLocaleString("ko-KR")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}