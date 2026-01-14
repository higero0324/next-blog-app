import type { Post } from "@/app/_types/Post";

const dummyPosts: Post[] = [
  {
    id: "post-1",
    createdAt: "2024-12-01T12:00:00.000Z",
    title: "ブログ開設日、やっと公開できた話",
    content:
      "<p>今日はブログ開設日。思ったより準備が多くて、正直へとへとでした。</p><p>特に手こずったのは記事一覧のレイアウト。画像の比率がバラついて、最初はカードが崩れてしまって。</p><p>どうにか見た目が整って、ようやく公開。まだ粗いところはあるけど、まずは一歩踏み出せたのがうれしいです。</p>",
    coverImageURL: "https://w1980.blob.core.windows.net/pg3/cover-img-red.jpg",
    categories: [
      { id: "cat-design", name: "Design" },
      { id: "cat-ui", name: "UI" },
    ],
  },
  {
    id: "post-2",
    createdAt: "2024-11-22T09:30:00.000Z",
    title: "初日からつまずいたポイントまとめ",
    content:
      "<p>最初に詰まったのは、カテゴリの表示とデータ取得。</p><p>APIのレスポンスとフロントの型が合っていなくて、何度もエラー。地味だけど、ここを揃えるだけで一気に安定しました。</p><p>あとはボタンの見やすさ。暗い背景に暗い文字が混ざっていたので、白文字に統一することで少し読みやすくなった気がします。</p>",
    coverImageURL:
      "https://w1980.blob.core.windows.net/pg3/cover-img-green.jpg",
    categories: [
      { id: "cat-writing", name: "Writing" },
      { id: "cat-ui", name: "UI" },
    ],
  },
  {
    id: "post-3",
    createdAt: "2024-11-05T18:45:00.000Z",
    title: "Next.jsでまとめる制作記録",
    content:
      "<p>UIの試行錯誤を記録しておくと、次の改善が速くなります。</p><p>小さな気づきを残しておくことが、大きな進歩につながります。</p>",
    coverImageURL:
      "https://w1980.blob.core.windows.net/pg3/cover-img-purple.jpg",
    categories: [
      { id: "cat-next", name: "Next.js" },
      { id: "cat-writing", name: "Writing" },
    ],
  },
];

export default dummyPosts;
