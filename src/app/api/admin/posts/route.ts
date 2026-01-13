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

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as {
      title?: string;
      content?: string;
      coverImageURL?: string;
      categoryIds?: string[];
    };

    const title = body.title?.trim() ?? "";
    const content = body.content?.trim() ?? "";
    const coverImageURL = body.coverImageURL?.trim() ?? "";
    const categoryIds = Array.isArray(body.categoryIds) ? body.categoryIds : [];

    if (!title || !content || !coverImageURL) {
      return NextResponse.json(
        { error: "入力内容を確認してください。" },
        { status: 400 },
      );
    }

    const created = await prisma.post.create({
      data: {
        title,
        content,
        coverImageURL,
        categories: {
          create: categoryIds.map((id) => ({
            category: {
              connect: { id },
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(toPostResponse(created));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "記事の作成に失敗しました。" },
      { status: 500 },
    );
  }
};
