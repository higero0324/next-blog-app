"use client";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/app/_types/Post";
import type { Category } from "@/app/_types/Category";
import PostSummary from "@/app/_components/PostSummary";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPaperPlane, faStar } from "@fortawesome/free-solid-svg-icons";

const toPlainText = (value: string) =>
  value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const calcReadingTime = (value: string) => {
  const length = toPlainText(value).length;
  return Math.max(1, Math.ceil(length / 400));
};

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          fetch("/api/posts", {
            method: "GET",
            cache: "no-store",
          }),
          fetch("/api/categories", {
            method: "GET",
            cache: "no-store",
          }),
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

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    const keyword = query.trim().toLowerCase();

    const filtered = posts.filter((post) => {
      const text = `${post.title} ${toPlainText(post.content)}`.toLowerCase();
      const matchesKeyword = keyword ? text.includes(keyword) : true;
      const matchesCategory =
        activeCategoryId === "all"
          ? true
          : post.categories.some((category) => category.id === activeCategoryId);
      return matchesKeyword && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sort === "latest" ? bTime - aTime : aTime - bTime;
    });
  }, [posts, query, activeCategoryId, sort]);

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

  if (posts && posts.length === 0) {
    return <div className="text-slate-500">記事がまだありません。</div>;
  }

  const featuredPost = filteredPosts[0];
  const latestPosts = filteredPosts.slice(1);
  const totalPosts = posts?.length ?? 0;
  const totalCategories = categories?.length ?? 0;

  return (
    <main className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow-strong)]">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-pink-200/70 blur-2xl" />
        <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-blue-200/60 blur-3xl" />
        <div className="relative z-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-xs font-medium text-pink-700">
              <FontAwesomeIcon icon={faStar} />
              最近のアップデート
            </div>
            <h1 className="font-display text-4xl leading-tight text-slate-900 md:text-5xl">
              読みやすさを大切に。
            </h1>
            <p className="text-base text-slate-600 md:text-lg">
              UI/UXの工夫や開発メモを、やさしい言葉でまとめています。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#latest"
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-slate-700"
              >
                最新記事を読む
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
              >
                プロフィールを見る
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[var(--shadow-soft)]">
              <div className="text-xs text-slate-500">最近のテーマ</div>
              <div className="mt-2 font-display text-2xl">ブログ運用のはじまり</div>
              <p className="mt-2 text-sm text-slate-600">
                開設初日の気づきや、準備で詰まったところをまとめました。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/70 bg-white/90 p-4 text-center shadow-[var(--shadow-soft)]">
                <div className="font-display text-2xl text-slate-900">
                  {totalPosts}
                </div>
                <div className="text-xs text-slate-500">記事数</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/90 p-4 text-center shadow-[var(--shadow-soft)]">
                <div className="font-display text-2xl text-slate-900">
                  {totalCategories}
                </div>
                <div className="text-xs text-slate-500">カテゴリ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-[var(--shadow-soft)] md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="text-sm font-semibold text-slate-700">
            記事を探す
          </div>
          <input
            type="search"
            placeholder="キーワードで検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-pink-300 focus:outline-none"
          />
        </div>
        <div className="space-y-4">
          <div className="text-sm font-semibold text-slate-700">
            並び替え
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSort("latest")}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                sort === "latest"
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              新しい順
            </button>
            <button
              type="button"
              onClick={() => setSort("oldest")}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                sort === "oldest"
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              古い順
            </button>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategoryId("all")}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                activeCategoryId === "all"
                  ? "bg-pink-200 text-pink-800"
                  : "border border-pink-100 bg-white text-slate-600"
              }`}
            >
              すべて
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  activeCategoryId === category.id
                    ? "bg-pink-200 text-pink-800"
                    : "border border-pink-100 bg-white text-slate-600"
                }`}
              >
                #{category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {featuredPost && (
        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[var(--shadow-strong)]">
            <div className="relative aspect-[16/9]">
              <img
                src={featuredPost.coverImageURL}
                alt={featuredPost.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-2 text-xs text-slate-600">
                {calcReadingTime(featuredPost.content)}分で読めます
              </div>
            </div>
            <div className="space-y-3 p-6">
              <div className="text-xs text-slate-500">注目記事</div>
              <h2 className="font-display text-3xl text-slate-900">
                {featuredPost.title}
              </h2>
              <p className="text-sm text-slate-600">
                {toPlainText(featuredPost.content).slice(0, 140)}...
              </p>
              <div className="flex flex-wrap gap-2">
                {featuredPost.categories.map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500"
                  >
                    #{category.name}
                  </span>
                ))}
              </div>
              <Link
                href={`/posts/${featuredPost.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                続きを読む
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
              <div className="text-sm font-semibold text-slate-700">運用メモ</div>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>時々更新、気楽に続ける</li>
                <li>詰まったところは正直に記録</li>
                <li>気づいたら少しずつ改善</li>
              </ul>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
              <div className="text-sm font-semibold text-slate-700">ニュースレター</div>
              <p className="mt-2 text-sm text-slate-600">
                たまに近況まとめをお届けします。
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="mail@example.com"
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs focus:border-pink-300 focus:outline-none"
                />
                <button
                  type="button"
                  className="rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-white"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="mr-1" />
                  送信
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="latest" className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl text-slate-900">最新の記事</h2>
          <div className="text-xs text-slate-500">
            {filteredPosts.length} 件
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {latestPosts.map((post) => (
            <PostSummary key={post.id} post={post} />
          ))}
        </div>
        {latestPosts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
            まだ記事がありません。最初の記事を作成しましょう。
          </div>
        )}
      </section>

      <section className="grid gap-6 rounded-[30px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow-soft)] md:grid-cols-3">
        <div className="space-y-3">
          <div className="font-display text-xl text-slate-900">書くこと</div>
          <p className="text-sm text-slate-600">
            ふとした気づきを、小さな文章で残していきます。
          </p>
        </div>
        <div className="space-y-3">
          <div className="font-display text-xl text-slate-900">届けること</div>
          <p className="text-sm text-slate-600">
            役立つヒントを、やさしい言葉で伝えます。
          </p>
        </div>
        <div className="space-y-3">
          <div className="font-display text-xl text-slate-900">つながること</div>
          <p className="text-sm text-slate-600">
            SNSやコメントで、ゆるやかに交流します。
          </p>
        </div>
      </section>
    </main>
  );
};

export default Page;
