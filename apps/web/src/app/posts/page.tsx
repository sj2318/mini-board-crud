"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);

  return (
    <main className="page-container">
      <section className="page-header">
        <div>
          <h1 className="page-title">After6</h1>

          <p className="page-description">
            퇴근 후 뭐하지?
            <br />
            다른 사람들의 퇴근 후 이야기를 둘러보세요.
          </p>
        </div>

        <Link href="/posts/new" className="button button-primary">
          글 작성
        </Link>
      </section>

      {posts.length === 0 ? (
        <section className="empty-state">
          <h2>아직 등록된 이야기가 없어요.</h2>

          <p>
            오늘 퇴근 후 했던 일을
            <br />
            첫 번째로 공유해보세요.
          </p>

          <Link href="/posts/new" className="button button-primary">
            첫 글 작성하기
          </Link>
        </section>
      ) : (
        <section>
          <h2>최근 이야기</h2>

          <div className="post-list">
            {posts.map((post) => (
              <Link
                href={`/posts/${post.id}`}
                className="post-card"
                key={post.id}
              >
                <h3 className="post-card-title">{post.title}</h3>

                <p className="post-card-content">{post.content}</p>

                <div className="post-card-date">
                  {new Date(post.created_at).toLocaleDateString("ko-KR")}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}