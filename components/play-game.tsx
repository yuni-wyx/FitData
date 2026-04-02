"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, RefreshCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fitPreferenceLabels,
  fitPreferenceOptions,
  sizeOptions,
  type CasePayload,
  type FitPreferenceOption,
  type NextCaseResponse,
  type SizeOption
} from "@/lib/types";

export function PlayGame() {
  const [currentCase, setCurrentCase] = useState<CasePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedFitPreference, setSelectedFitPreference] = useState<FitPreferenceOption | null>(null);

  const resetSelection = useCallback(() => {
    setSelectedSize(null);
    setSelectedFitPreference(null);
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(""), 1400);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

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
      resetSelection();
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "讀取題目失敗");
    } finally {
      setLoading(false);
    }
  }, [resetSelection]);

  useEffect(() => {
    void loadNextCase();
  }, [loadNextCase]);

  async function submitLabel() {
    if (!currentCase || !selectedSize || !selectedFitPreference) return;

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
          fitPreference: selectedFitPreference
        })
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "送出標註失敗");
      }

      setSuccessMessage("已記錄，下一題");
      await loadNextCase();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "送出標註失敗");
    } finally {
      setSubmitting(false);
    }
  }

  const progressText = useMemo(() => {
    if (!currentCase) return "第 0 / 0 題";
    return `第 ${currentCase.progress.current} / ${currentCase.progress.total} 題`;
  }, [currentCase]);

  if (loading) {
    return (
      <Card className="mx-auto flex min-h-[360px] w-full max-w-3xl items-center justify-center">
        <div className="flex items-center gap-3 text-lg font-semibold text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          載入題目中...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="p-8">
          <CardTitle className="text-3xl">暫時無法繼續</CardTitle>
          <CardDescription className="text-base text-rose-600">{error}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3 p-8 pt-0">
          <Button size="lg" onClick={() => void loadNextCase()}>
            <RefreshCcw className="mr-2 h-5 w-5" />
            重新載入
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">回首頁</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isDone || !currentCase) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="p-8 text-center">
          <Badge variant="success" className="mx-auto mb-2">
            全部完成
          </Badge>
          <CardTitle className="text-3xl">今天的題目都標完了</CardTitle>
          <CardDescription className="text-base">目前所有題目都已完成標註，現在可以去管理頁查看資料。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-8 pt-0 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link href="/admin">查看管理頁</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1">
            <Link href="/">回首頁</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Badge className="w-fit px-4 py-2 text-sm">{progressText}</Badge>
          {successMessage ? (
            <Badge variant="success" className="px-4 py-2 text-sm">
              {successMessage}
            </Badge>
          ) : null}
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-white/70 p-8">
          <CardTitle className="text-3xl sm:text-4xl">{currentCase.productName}</CardTitle>
          <CardDescription className="text-base">
            請根據下方資料，選擇你覺得最適合的實際尺碼
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoBlock label="身高" value={`${currentCase.heightCm} cm`} />
            <InfoBlock label="體重" value={`${currentCase.weightKg} kg`} />
            <InfoBlock label="腰圍" value={`${currentCase.waistCm} cm`} />
            <InfoBlock label="建議尺碼" value={currentCase.suggestedSize} highlight />
          </div>

          <div className="grid gap-4">
            <div>
              <p className="mb-3 text-sm font-semibold text-muted-foreground">1. 選擇實際尺碼</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {sizeOptions.map((size) => (
                  <Button
                    key={size}
                    size="lg"
                    variant={selectedSize === size ? "default" : "outline"}
                    disabled={submitting}
                    className="h-20 text-2xl font-bold"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-muted-foreground">2. 選擇穿著感受</p>
              <div className="grid grid-cols-2 gap-4">
                {fitPreferenceOptions.map((option) => (
                  <Button
                    key={option}
                    size="lg"
                    variant={selectedFitPreference === option ? "default" : "outline"}
                    disabled={submitting}
                    className="h-16 text-xl font-bold"
                    onClick={() => setSelectedFitPreference(option)}
                  >
                    {fitPreferenceLabels[option]}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="h-16 text-lg"
              disabled={submitting || !selectedSize || !selectedFitPreference}
              onClick={() => void submitLabel()}
            >
              {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "送出並前往下一題"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  highlight = false
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border px-5 py-6 ${
        highlight
          ? "border-orange-200 bg-orange-50/80"
          : "border-white/80 bg-white/70"
      }`}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
