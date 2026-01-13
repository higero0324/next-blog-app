import type { Post } from "@/app/_types/Post";

const dummyPosts: Post[] = [
  {
    id: "post-1",
    createdAt: "2024-12-01T12:00:00.000Z",
    title: "やさしいUIのつくり方",
    content:
      "<p>やさしいUIは、余白とリズムから始まります。</p><p>色数を絞り、視線の動きに合わせて情報を並べると、自然と心地よく読めるようになります。</p>",
    coverImageURL: "https://w1980.blob.core.windows.net/pg3/cover-img-red.jpg",
    categories: [
      { id: "cat-design", name: "Design" },
      { id: "cat-ui", name: "UI" },
    ],
  },
  {
    id: "post-2",
    createdAt: "2024-11-22T09:30:00.000Z",
    title: "小さな改善で読みやすく",
    content:
      "<p>行間を少し広げるだけで、文章の印象はぐっとやさしくなります。</p><p>見出しと本文の差を作ると、読み手の迷いが減ります。</p>",
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
