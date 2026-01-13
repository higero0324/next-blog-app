"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import type { Post } from "@/app/_types/Post";

type CategoryApiResponse = {
  id: string;
  name: string;
};

type SelectableCategory = {
  id: string;
  name: string;
  isSelected: boolean;
};

const Page: React.FC = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<SelectableCategory[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [postRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/posts/${id}`, { method: "GET", cache: "no-store" }),
          fetch("/api/categories", { method: "GET", cache: "no-store" }),
        ]);

        if (!postRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data.");
        }

        const postBody = (await postRes.json()) as Post;
        const categoriesBody = (await categoriesRes.json()) as CategoryApiResponse[];

        setPost(postBody);
        setTitle(postBody.title);
        setContent(postBody.content);
        setCoverImageURL(postBody.coverImageURL);

        const selectedIds = new Set(postBody.categories.map((c) => c.id));
        setCategories(
          categoriesBody.map((category) => ({
            id: category.id,
            name: category.name,
            isSelected: selectedIds.has(category.id),
          })),
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? `記事の取得に失敗しました: ${error.message}`
            : `記事の取得に失敗しました: ${error}`;
        console.error(message);
        setErrorMsg(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const selectedCategoryIds = useMemo(() => {
    if (!categories) return [];
    return categories.filter((c) => c.isSelected).map((c) => c.id);
  }, [categories]);

  const toggleCategory = (categoryId: string) => {
    if (!categories) return;
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? { ...category, isSelected: !category.isSelected }
          : category,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          coverImageURL,
          categoryIds: selectedCategoryIds,
        }),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      router.push("/admin/posts");
    } catch (error) {
      const message =
        error instanceof Error
          ? `更新に失敗しました: ${error.message}`
          : `更新に失敗しました: ${error}`;
      console.error(message);
      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("この投稿を削除しますか？")) {
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      router.push("/admin/posts");
    } catch (error) {
      const message =
        error instanceof Error
          ? `削除に失敗しました: ${error.message}`
          : `削除に失敗しました: ${error}`;
      console.error(message);
      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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

  if (!post || !categories) {
    return null;
  }

  return (
    <main>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-2xl font-bold">投稿の編集</div>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm text-red-600"
          disabled={isSubmitting}
        >
          削除する
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="title" className="block font-bold">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full rounded-md border-2 px-2 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="content" className="block font-bold">
            本文
          </label>
          <textarea
            id="content"
            name="content"
            className="h-48 w-full rounded-md border-2 px-2 py-1"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="coverImageURL" className="block font-bold">
            カバー画像 (URL)
          </label>
          <input
            type="url"
            id="coverImageURL"
            name="coverImageURL"
            className="w-full rounded-md border-2 px-2 py-1"
            value={coverImageURL}
            onChange={(e) => setCoverImageURL(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <div className="font-bold">カテゴリ</div>
          <div className="flex flex-wrap gap-x-3.5">
            {categories.length > 0 ? (
              categories.map((category) => (
                <label key={category.id} className="flex space-x-1">
                  <input
                    id={category.id}
                    type="checkbox"
                    checked={category.isSelected}
                    className="mt-0.5 cursor-pointer"
                    onChange={() => toggleCategory(category.id)}
                  />
                  <span className="cursor-pointer">{category.name}</span>
                </label>
              ))
            ) : (
              <div>選択可能なカテゴリがありません。</div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
            disabled={isSubmitting}
          >
            更新する
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
