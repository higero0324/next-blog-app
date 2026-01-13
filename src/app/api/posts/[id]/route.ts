import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { Prisma } from "@/generated/prisma/client";

type RouteParams = {
  params: Promise<{ id: string }>;
};

type PostWithCategories = Prisma.PostGetPayload<{
  include: { categories: { include: { category: true } } };
}>;

const toPostResponse = (post: PostWithCategories) => ({
  ...post,
  categories: post.categories.map((item) => item.category),
});

export const GET = async (_req: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(toPostResponse(post));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "記事の取得に失敗しました。" },
      { status: 500 },
    );
  }
};
