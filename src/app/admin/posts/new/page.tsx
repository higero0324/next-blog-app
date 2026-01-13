"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCoverImageURL, setNewCoverImageURL] = useState("");

  const router = useRouter();

  const [checkableCategories, setCheckableCategories] = useState<
    SelectableCategory[] | null
  >(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/categories", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          setCheckableCategories(null);
          throw new Error(`${res.status}: ${res.statusText}`);
        }

        const apiResBody = (await res.json()) as CategoryApiResponse[];
        setCheckableCategories(
          apiResBody.map((body) => ({
            id: body.id,
            name: body.name,
            isSelected: false,
          })),
        );
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

    fetchCategories();
  }, []);

  const switchCategoryState = (categoryId: string) => {
    if (!checkableCategories) return;

    setCheckableCategories(
      checkableCategories.map((category) =>
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
      const requestBody = {
        title: newTitle,
        content: newContent,
        coverImageURL: newCoverImageURL,
        categoryIds: checkableCategories
          ? checkableCategories.filter((c) => c.isSelected).map((c) => c.id)
          : [],
      };
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      const postResponse = await res.json();
      router.push(`/posts/${postResponse.id}`);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `投稿の作成に失敗しました: ${error.message}`
          : `投稿の作成に失敗しました: ${error}`;
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

  if (!checkableCategories) {
    return <div className="text-red-500">{fetchErrorMsg}</div>;
  }

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">新規投稿</div>

      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex items-center rounded-lg bg-white px-8 py-4 shadow-lg">
            <FontAwesomeIcon
              icon={faSpinner}
              className="mr-2 animate-spin text-gray-500"
            />
            <div className="flex items-center text-gray-500">送信中...</div>
          </div>
        </div>
      )}

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
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="タイトルを入力してください"
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
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="本文を入力してください"
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
            value={newCoverImageURL}
            onChange={(e) => setNewCoverImageURL(e.target.value)}
            placeholder="カバー画像のURLを入力してください"
            required
          />
        </div>

        <div className="space-y-1">
          <div className="font-bold">カテゴリ</div>
          <div className="flex flex-wrap gap-x-3.5">
            {checkableCategories.length > 0 ? (
              checkableCategories.map((category) => (
                <label key={category.id} className="flex space-x-1">
                  <input
                    id={category.id}
                    type="checkbox"
                    checked={category.isSelected}
                    className="mt-0.5 cursor-pointer"
                    onChange={() => switchCategoryState(category.id)}
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
            投稿する
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
