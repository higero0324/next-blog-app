import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { Prisma } from "@/generated/prisma/client";

type PostWithCategories = Prisma.PostGetPayload<{
  include: { categories: { include: { category: true } } };
}>;

const toPostResponse = (post: PostWithCategories) => ({
  ...post,
  categories: post.categories.map((item) => item.category),
});

export const GET = async (_req: NextRequest) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    return NextResponse.json(posts.map(toPostResponse));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "記事の取得に失敗しました。" },
      { status: 500 },
    );
  }
};
