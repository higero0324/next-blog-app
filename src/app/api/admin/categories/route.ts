import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as { name?: string };
    const name = body.name?.trim() ?? "";

    if (!name) {
      return NextResponse.json(
        { error: "入力内容を確認してください。" },
        { status: 400 },
      );
    }

    const created = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "カテゴリの作成に失敗しました。" },
      { status: 500 },
    );
  }
};
