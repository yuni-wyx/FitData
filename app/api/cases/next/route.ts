import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const { db } = await import("@/lib/db");
    const [totalCount, labeledCount, nextCase] = await Promise.all([
      db.tryOnCase.count(),
      db.tryOnCase.count({ where: { isLabeled: true } }),
      db.tryOnCase.findFirst({
        where: { isLabeled: false },
        orderBy: { id: "asc" }
      })
    ]);

    if (!nextCase) {
      return NextResponse.json({
        case: null,
        done: true
      });
    }

    return NextResponse.json({
      case: {
        ...nextCase,
        progress: {
          current: labeledCount + 1,
          total: totalCount,
          labeled: labeledCount
        }
      },
      done: false
    });
  } catch (error) {
    console.error("GET /api/cases/next error", error);
    return NextResponse.json({ error: "無法讀取下一題" }, { status: 500 });
  }
}
