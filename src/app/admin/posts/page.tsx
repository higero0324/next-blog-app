"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import type { Post } from "@/app/_types/Post";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/posts", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }

        const apiResBody = (await res.json()) as Post[];
        setPosts(apiResBody);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? `記事の取得に失敗しました: ${error.message}`
            : `記事の取得に失敗しました: ${error}`;
        console.error(errorMessage);
        setErrorMsg(errorMessage);
      }
    };

    fetchPosts();
  }, []);

  if (!posts && !errorMsg) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (errorMsg) {
    return <div className="text-red-500">{errorMsg}</div>;
  }

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-2xl text-slate-900">投稿一覧</h2>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          新規投稿
        </Link>
      </div>

      <div className="space-y-3">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="rounded-[22px] border border-white/70 bg-white/90 px-5 py-4 shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {post.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString("ja-JP")}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600"
                  >
                    編集
                  </Link>
                  <Link
                    href={`/posts/${post.id}`}
                    className="rounded-full bg-slate-900 px-3 py-1 text-white"
                  >
                    公開ページ
                  </Link>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {post.categories.map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600"
                  >
                    #{category.name}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500">投稿がありません。</div>
        )}
      </div>
    </main>
  );
};

export default Page;
