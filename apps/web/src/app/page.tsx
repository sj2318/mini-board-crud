"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("확인 중...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`)
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
      });
  }, []);

  return (
    <main>
      <h1>FrontEnd - BackEnd 연결 테스트</h1>
      <p>API 상태: {status}</p>
    </main>
  );
}