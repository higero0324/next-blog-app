"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import type { Category } from "@/app/_types/Category";

const Page: React.FC = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/categories", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }

        const apiResBody = (await res.json()) as Category[];
        setCategories(apiResBody);
        const target = apiResBody.find((category) => category.id === id);
        if (!target) {
          throw new Error("カテゴリが見つかりませんでした。");
        }
        setName(target.name);
      } catch (error) {
        const message =
          error instanceof Error
            ? `カテゴリの取得に失敗しました: ${error.message}`
            : `カテゴリの取得に失敗しました: ${error}`;
        console.error(message);
        setErrorMsg(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [id]);

  const nameError = useMemo(() => {
    const value = name.trim();
    if (value.length === 0) return "";
    if (value.length < 2 || value.length > 16) {
      return "2文字以上16文字以内で入力してください。";
    }
    if (categories && categories.some((c) => c.name === value && c.id !== id)) {
      return "同じ名前のカテゴリが既に存在します。";
    }
    return "";
  }, [name, categories, id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      router.push("/admin/categories/new");
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
    if (!window.confirm("このカテゴリを削除しますか？")) {
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      router.push("/admin/categories/new");
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

  if (!categories) {
    return null;
  }

  return (
    <main>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-2xl font-bold">カテゴリの編集</div>
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
          <label htmlFor="name" className="block font-bold">
            名前
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full rounded-md border-2 px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            更新する
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
