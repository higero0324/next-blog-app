import { prisma } from "@/lib/prisma";

const main = async () => {
  await prisma.postCategory.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();

  const design = await prisma.category.create({ data: { name: "Design" } });
  const writing = await prisma.category.create({ data: { name: "Writing" } });
  const nextjs = await prisma.category.create({ data: { name: "Next.js" } });

  await prisma.post.create({
    data: {
      title: "やさしいUIのつくり方",
      content:
        "<p>やさしいUIは、余白とリズムから始まります。</p><p>色数を絞り、視線の動きに合わせて情報を並べると、自然と心地よく読めるようになります。</p>",
      coverImageURL:
        "https://w1980.blob.core.windows.net/pg3/cover-img-red.jpg",
      categories: {
        create: [
          { categoryId: design.id },
          { categoryId: writing.id },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "小さな改善で読みやすく",
      content:
        "<p>行間を少し広げるだけで、文章の印象はぐっとやさしくなります。</p><p>見出しと本文の差を作ると、読み手の迷いが減ります。</p>",
      coverImageURL:
        "https://w1980.blob.core.windows.net/pg3/cover-img-green.jpg",
      categories: {
        create: [
          { categoryId: design.id },
          { categoryId: nextjs.id },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "Next.jsでまとめる制作記録",
      content:
        "<p>UIの試行錯誤を記録しておくと、次の改善が速くなります。</p><p>小さな気づきを残しておくことが、大きな進歩につながります。</p>",
      coverImageURL:
        "https://w1980.blob.core.windows.net/pg3/cover-img-purple.jpg",
      categories: {
        create: [
          { categoryId: writing.id },
          { categoryId: nextjs.id },
        ],
      },
    },
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
