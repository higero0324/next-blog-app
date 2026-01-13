"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import type { Post } from "@/app/_types/Post";

const toPlainText = (value: string) =>
  value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const calcReadingTime = (value: string) => {
  const length = toPlainText(value).length;
  return Math.max(1, Math.ceil(length / 400));
};

const Page: React.FC = () => {
  const { id } = useParams() as { id: string };
  const [post, setPost] = useState<Post | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }

        const apiResBody = (await res.json()) as Post;
        setPost(apiResBody);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? `記事の取得に失敗しました: ${error.message}`
            : `記事の取得に失敗しました: ${error}`;
        console.error(errorMessage);
        setErrorMsg(errorMessage);
      }
    };

    fetchPost();
  }, [id]);

  const readingTime = useMemo(() => {
    if (!post) return 1;
    return calcReadingTime(post.content);
  }, [post]);

  if (!post && !errorMsg) {
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

  if (!post) {
    return null;
  }

  const createdAt = new Date(post.createdAt).toLocaleDateString("ja-JP");

  return (
    <main className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
        一覧へ戻る
      </Link>

      <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[var(--shadow-strong)]">
        <div className="relative aspect-[16/9]">
          <img
            src={post.coverImageURL}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-4 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{createdAt}</span>
            <span>・</span>
            <span>{readingTime}分で読めます</span>
          </div>
          <h1 className="font-display text-3xl text-slate-900 md:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                key={category.id}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
              >
                #{category.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.6fr_0.7fr]">
        <article
          className="prose max-w-none rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-soft)]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <aside className="space-y-4">
          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[var(--shadow-soft)]">
            <div className="text-xs text-slate-500">プロフィール</div>
            <div className="mt-2 flex items-center gap-3">
              <img
                src="/images/avatar.png"
                alt="Author"
                className="h-12 w-12 rounded-full border border-white"
              />
              <div>
                <div className="font-display text-lg">Fuwa Note</div>
                <div className="text-xs text-slate-500">
                  UIデザイン / ライティング
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[var(--shadow-soft)]">
            <div className="text-xs text-slate-500">このブログで扱うこと</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>UIの改善アイデア</li>
              <li>開発の小さな学び</li>
              <li>読者に届けたいヒント</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Page;
