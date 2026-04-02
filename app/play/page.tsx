"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Home, Loader2, RefreshCcw } from "lucide-react";

import { FitSelector } from "@/components/FitSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  type CasePayload,
  type FitPreferenceOption,
  type NextCaseResponse,
  type SizeOption
} from "@/lib/types";

export default function PlayPage() {
  const [currentCase, setCurrentCase] = useState<CasePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedFit, setSelectedFit] = useState<FitPreferenceOption | null>(null);

  const resetChoices = useCallback(() => {
    setSelectedSize(null);
    setSelectedFit(null);
  }, []);

  const loadNextCase = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/cases/next", {
        method: "GET",
        cache: "no-store"
      });

      const data = (await response.json()) as NextCaseResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "讀取題目失敗");
      }

      setCurrentCase(data.case);
      setIsDone(data.done);
      resetChoices();
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "讀取題目失敗");
    } finally {
      setLoading(false);
    }
  }, [resetChoices]);

  useEffect(() => {
    void loadNextCase();
  }, [loadNextCase]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  async function handleSubmit() {
    if (!currentCase || !selectedSize || !selectedFit) return;

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch("/api/labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          caseId: currentCase.id,
          selectedSize,
          fitPreference: selectedFit
        })
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "送出失敗");
      }

      setSuccessMessage("已記錄，下一題");
      await loadNextCase();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "送出失敗");
    } finally {
      setSubmitting(false);
    }
  }

  const progressText = useMemo(() => {
    if (!currentCase) return "第 0 / 0 題";
    return `第 ${currentCase.progress.current} / ${currentCase.progress.total} 題`;
  }, [currentCase]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            天皇尺碼試穿遊戲
          </h1>
          <Button asChild variant="ghost" className="h-10 rounded-2xl px-3">
            <Link href="/">
              <Home className="mr-1 h-4 w-4" />
              首頁
            </Link>
          </Button>
        </div>

        {loading ? (
          <Card className="flex min-h-[420px] items-center justify-center rounded-3xl p-6 shadow">
            <div className="flex items-center gap-3 text-lg font-semibold text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              載入題目中...
            </div>
          </Card>
        ) : error ? (
          <Card className="rounded-3xl p-6 shadow">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-slate-900">暫時無法繼續</h2>
              <p className="text-base text-rose-600">{error}</p>
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  size="lg"
                  className="h-14 w-full rounded-2xl text-lg"
                  onClick={() => void loadNextCase()}
                >
                  <RefreshCcw className="mr-2 h-5 w-5" />
                  重新載入
                </Button>
                <Button asChild type="button" variant="outline" size="lg" className="h-14 w-full rounded-2xl text-lg">
                  <Link href="/">回首頁</Link>
                </Button>
              </div>
            </div>
          </Card>
        ) : isDone || !currentCase ? (
          <Card className="rounded-3xl p-6 shadow">
            <div className="flex flex-col gap-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">全部完成</h2>
              <p className="text-base text-slate-600">目前所有題目都已標註完成。</p>
              <div className="flex flex-col gap-3">
                <Button asChild size="lg" className="h-14 w-full rounded-2xl text-lg">
                  <Link href="/admin">查看管理頁</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 w-full rounded-2xl text-lg">
                  <Link href="/">回首頁</Link>
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-500">{progressText}</p>
              {successMessage ? (
                <p className="rounded-2xl bg-emerald-100 px-4 py-3 text-base font-semibold text-emerald-700">
                  {successMessage}
                </p>
              ) : null}
            </div>

            <Card className="rounded-3xl p-4 shadow sm:p-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-slate-500">商品名稱</p>
                  <h2 className="text-3xl font-extrabold leading-tight text-slate-900">
                    {currentCase.productName}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <InfoItem label="身高" value={`${currentCase.heightCm}`} unit="cm" />
                  <InfoItem label="體重" value={`${currentCase.weightKg}`} unit="kg" />
                  <InfoItem label="腰圍" value={`${currentCase.waistCm}`} unit="cm" />
                </div>

                <div className="rounded-2xl bg-slate-100 px-4 py-3">
                  <p className="text-sm font-medium text-slate-500">建議尺碼</p>
                  <p className="mt-1 text-lg font-bold text-slate-700">
                    {currentCase.suggestedSize}
                  </p>
                </div>

                <SizeSelector
                  value={selectedSize}
                  onChange={setSelectedSize}
                  disabled={submitting}
                />

                <FitSelector
                  value={selectedFit}
                  onChange={setSelectedFit}
                  disabled={submitting}
                />

                <Button
                  type="button"
                  size="lg"
                  className="h-16 w-full rounded-2xl text-lg font-bold shadow"
                  disabled={submitting || !selectedSize || !selectedFit}
                  onClick={() => void handleSubmit()}
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "確認"}
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

function InfoItem({
  label,
  value,
  unit
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-2xl bg-orange-50 p-3 text-center">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
        <span className="ml-1 text-sm font-semibold text-slate-500">{unit}</span>
      </p>
    </div>
  );
}
