import { NextRequest, NextResponse } from "next/server";

import { labelSubmissionSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function POST(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");
    const json = await request.json();
    const parsed = labelSubmissionSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "送出的資料格式不正確",
          details: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const { caseId, selectedSize, fitPreference } = parsed.data;

    const existingCase = await db.tryOnCase.findUnique({
      where: { id: caseId }
    });

    if (!existingCase) {
      return NextResponse.json({ error: "找不到指定題目" }, { status: 404 });
    }

    const result = await db.$transaction(async (tx) => {
      const label = await tx.tryOnLabel.create({
        data: {
          caseId,
          selectedSize,
          fitPreference
        }
      });

      const updatedCase = await tx.tryOnCase.update({
        where: { id: caseId },
        data: {
          actualSize: selectedSize,
          fitPreference,
          isLabeled: true
        }
      });

      return { label, updatedCase };
    });

    return NextResponse.json({
      success: true,
      labelId: result.label.id,
      case: result.updatedCase
    });
  } catch (error) {
    console.error("POST /api/labels error", error);
    return NextResponse.json({ error: "無法儲存標註結果" }, { status: 500 });
  }
}
