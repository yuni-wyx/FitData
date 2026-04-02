import { NextRequest, NextResponse } from "next/server";
import { type FitPreference } from "@prisma/client";

import { adminFiltersSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");
    const { searchParams } = new URL(request.url);
    const parsed = adminFiltersSchema.safeParse({
      productName: searchParams.get("productName") ?? "",
      actualSize: searchParams.get("actualSize") ?? "",
      fitPreference: searchParams.get("fitPreference") ?? ""
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "篩選條件格式不正確",
          details: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const { productName, actualSize, fitPreference } = parsed.data;

    const records = await db.tryOnLabel.findMany({
      where: {
        selectedSize: actualSize || undefined,
        fitPreference: fitPreference ? (fitPreference as FitPreference) : undefined,
        tryOnCase: {
          productName: productName
            ? {
                contains: productName,
                mode: "insensitive"
              }
            : undefined
        }
      },
      include: {
        tryOnCase: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      records: records.map((item) => ({
        id: item.id,
        productName: item.tryOnCase.productName,
        heightCm: item.tryOnCase.heightCm,
        weightKg: item.tryOnCase.weightKg,
        waistCm: item.tryOnCase.waistCm,
        suggestedSize: item.tryOnCase.suggestedSize,
        actualSize: item.selectedSize,
        fitPreference: item.fitPreference,
        createdAt: item.createdAt.toISOString()
      }))
    });
  } catch (error) {
    console.error("GET /api/admin/labels error", error);
    return NextResponse.json({ error: "無法讀取管理資料" }, { status: 500 });
  }
}
