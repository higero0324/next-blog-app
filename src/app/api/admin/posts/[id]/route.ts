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
      where: { id },
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

export const PUT = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params;
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

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        coverImageURL,
        categories: {
          deleteMany: {},
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
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

    return NextResponse.json(toPostResponse(updated));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "記事の更新に失敗しました。" },
      { status: 500 },
    );
  }
};

export const DELETE = async (_req: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params;
    await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "記事の削除に失敗しました。" },
      { status: 500 },
    );
  }
};
