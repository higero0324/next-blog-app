"use client";
import Link from "next/link";
import type { Post } from "@/app/_types/Post";

type Props = {
  post: Post;
};

const toPlainText = (value: string) =>
  value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const buildExcerpt = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength).trim()}...`;
};

const calcReadingTime = (value: string) => {
  const length = toPlainText(value).length;
  return Math.max(1, Math.ceil(length / 400));
};

const PostSummary: React.FC<Props> = ({ post }) => {
  const excerpt = buildExcerpt(toPlainText(post.content), 140);
  const createdAt = new Date(post.createdAt).toLocaleDateString("ja-JP");
  const readingTime = calcReadingTime(post.content);

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[var(--shadow-soft)] transition hover:-translate-y-1">
      <Link href={`/posts/${post.id}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
          <img
            src={post.coverImageURL}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs text-slate-600">
            {readingTime}分で読めます
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div className="text-xs text-slate-500">{createdAt}</div>
          <div className="font-display text-xl text-slate-900">
            {post.title}
          </div>
          <div className="text-sm text-slate-600">{excerpt}</div>
          <div className="flex flex-wrap gap-2 text-xs">
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
      </Link>
    </article>
  );
};

export default PostSummary;
