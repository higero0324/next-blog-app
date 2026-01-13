"use client";
import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import type { Category } from "@/app/_types/Category";

const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[] | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/categories", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        setCategories(null);
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      const apiResBody = (await res.json()) as Category[];
      setCategories(apiResBody);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `カテゴリの取得に失敗しました: ${error.message}`
          : `カテゴリの取得に失敗しました: ${error}`;
      console.error(errorMsg);
      setFetchErrorMsg(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const nameError = useMemo(() => {
    const value = newCategoryName.trim();
    if (value.length === 0) return "";
    if (value.length < 2 || value.length > 16) {
      return "2文字以上16文字以内で入力してください。";
    }
    if (categories && categories.some((c) => c.name === value)) {
      return "同じ名前のカテゴリが既に存在します。";
    }
    return "";
  }, [newCategoryName, categories]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      setNewCategoryName("");
      await fetchCategories();
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `カテゴリの作成に失敗しました: ${error.message}`
          : `カテゴリの作成に失敗しました: ${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
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

  if (!categories) {
    return <div className="text-red-500">{fetchErrorMsg}</div>;
  }

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">新規カテゴリ</div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="block font-bold">
            名前
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full rounded-md border-2 px-2 py-1"
            placeholder="新しいカテゴリ名"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            autoComplete="off"
            required
          />
          {nameError && (
            <div className="flex items-center space-x-1 text-sm font-bold text-red-500">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <div>{nameError}</div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
            disabled={isSubmitting || nameError !== ""}
          >
            作成する
          </button>
        </div>
      </form>

      <div className="mb-2 text-xl font-bold">カテゴリ一覧</div>
      {categories.length === 0 ? (
        <div className="text-gray-500">カテゴリがありません。</div>
      ) : (
        <div>
          <div className="mb-3 text-sm text-slate-600">
            クリックすると編集画面に移動します。
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/admin/categories/${category.id}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
              >
                #{category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
