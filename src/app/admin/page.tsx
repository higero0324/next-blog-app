"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import type { Post } from "@/app/_types/Post";
import type { Category } from "@/app/_types/Category";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/posts", { method: "GET", cache: "no-store" }),
          fetch("/api/categories", { method: "GET", cache: "no-store" }),
        ]);

        if (!postsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data.");
        }

        const postBody = (await postsRes.json()) as Post[];
        const categoriesBody = (await categoriesRes.json()) as Category[];
        setPosts(postBody);
        setCategories(categoriesBody);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? `データの取得に失敗しました: ${error.message}`
            : `データの取得に失敗しました: ${error}`;
        console.error(errorMessage);
        setErrorMsg(errorMessage);
      }
    };

    fetchData();
  }, []);

  const latestPosts = useMemo(() => posts?.slice(0, 5) ?? [], [posts]);

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

  const totalPosts = posts?.length ?? 0;
  const totalCategories = categories?.length ?? 0;

  return (
    <main className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/70 bg-white/90 p-6 text-center shadow-[var(--shadow-soft)]">
          <div className="text-xs text-slate-500">記事数</div>
          <div className="mt-2 font-display text-3xl text-slate-900">
            {totalPosts}
          </div>
        </div>
        <div className="rounded-[24px] border border-white/70 bg-white/90 p-6 text-center shadow-[var(--shadow-soft)]">
          <div className="text-xs text-slate-500">カテゴリ</div>
          <div className="mt-2 font-display text-3xl text-slate-900">
            {totalCategories}
          </div>
        </div>
        <div className="rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
          <div className="text-xs text-slate-500">クイック操作</div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link
              href="/admin/posts/new"
              className="rounded-full bg-slate-900 px-4 py-2 text-white"
            >
              新規投稿
            </Link>
            <Link
              href="/admin/categories/new"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700"
            >
              新規カテゴリ
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-700">最新の投稿</div>
            <Link
              href="/admin/posts"
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              一覧を見る
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {latestPosts.length === 0 ? (
              <div className="text-sm text-slate-500">まだ投稿がありません。</div>
            ) : (
              latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {post.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString("ja-JP")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      編集
                    </Link>
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
          <div className="text-sm font-semibold text-slate-700">カテゴリ一覧</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                >
                  #{category.name}
                </span>
              ))
            ) : (
              <div className="text-sm text-slate-500">カテゴリがありません。</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
