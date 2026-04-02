import Link from "next/link";
import { BarChart3, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeHero() {
  return (
    <Card className="overflow-hidden border-amber-100/80 bg-hero">
      <CardHeader className="space-y-4 p-8 sm:p-10">
        <div className="inline-flex w-fit rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700">
          天皇尺碼試穿遊戲
        </div>
        <CardTitle className="max-w-2xl text-4xl leading-tight sm:text-5xl">
          用最簡單的方式，快速完成服飾尺碼標註
        </CardTitle>
        <CardDescription className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
          請根據客人的身形，選擇你覺得最適合的尺碼。每答一題就自動跳到下一題，簡單、快速、像玩遊戲一樣。
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-8 pt-0 sm:flex-row sm:items-center sm:justify-between sm:p-10 sm:pt-0">
        <div className="grid gap-3 text-sm text-slate-700">
          <p>適合手機與平板操作，按鈕大、資訊清楚，方便長輩直接使用。</p>
          <p>標註完成後可到管理頁查看所有紀錄與篩選結果。</p>
        </div>
        <div className="flex flex-col gap-3 sm:min-w-52">
          <Button asChild size="lg" className="w-full">
            <Link href="/play">
              <PlayCircle className="mr-2 h-5 w-5" />
              開始標註
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/admin">
              <BarChart3 className="mr-2 h-5 w-5" />
              前往管理頁
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
