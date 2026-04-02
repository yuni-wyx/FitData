"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fitPreferenceLabels, fitPreferenceOptions, sizeOptions, type AdminLabelRecord } from "@/lib/types";

interface AdminResponse {
  records: AdminLabelRecord[];
}

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

export function AdminTable() {
  const [productName, setProductName] = useState("");
  const [actualSize, setActualSize] = useState("");
  const [fitPreference, setFitPreference] = useState("");
  const [records, setRecords] = useState<AdminLabelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        productName,
        actualSize,
        fitPreference
      });

      const response = await fetch(`/api/admin/labels?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
        signal
      });

      const data = (await response.json()) as AdminResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "讀取資料失敗");
      }

      setRecords(data.records);
    } catch (fetchError) {
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
        return;
      }
      setError(fetchError instanceof Error ? fetchError.message : "讀取資料失敗");
    } finally {
      setLoading(false);
    }
  }, [actualSize, fitPreference, productName]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void fetchRecords(controller.signal);
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [fetchRecords]);

  const summaryText = useMemo(() => `共 ${records.length} 筆標註紀錄`, [records.length]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle className="text-3xl">標註管理頁</CardTitle>
            <CardDescription className="mt-2 text-base">
              查看每一筆標註結果，並依照商品、實際尺碼或穿著感受快速篩選。
            </CardDescription>
          </div>
          <Badge variant="outline" className="w-fit px-4 py-2 text-sm">
            {summaryText}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 p-8 pt-0">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="搜尋商品名稱"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
            />
          </div>
          <Select value={actualSize} onChange={(event) => setActualSize(event.target.value)}>
            <option value="">全部實際尺碼</option>
            {sizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
          <Select value={fitPreference} onChange={(event) => setFitPreference(event.target.value)}>
            <option value="">全部穿著感受</option>
            {fitPreferenceOptions.map((option) => (
              <option key={option} value={option}>
                {fitPreferenceLabels[option]}
              </option>
            ))}
          </Select>
        </div>

        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

        <div className="rounded-3xl border border-white/80 bg-white/70">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品名稱</TableHead>
                <TableHead>身高</TableHead>
                <TableHead>體重</TableHead>
                <TableHead>腰圍</TableHead>
                <TableHead>建議尺碼</TableHead>
                <TableHead>實際尺碼</TableHead>
                <TableHead>穿著感受</TableHead>
                <TableHead>建立時間</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      讀取中...
                    </div>
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    目前沒有符合條件的標註資料
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-semibold">{record.productName}</TableCell>
                    <TableCell>{record.heightCm} cm</TableCell>
                    <TableCell>{record.weightKg} kg</TableCell>
                    <TableCell>{record.waistCm} cm</TableCell>
                    <TableCell>{record.suggestedSize}</TableCell>
                    <TableCell>{record.actualSize ?? "-"}</TableCell>
                    <TableCell>{fitPreferenceLabels[record.fitPreference]}</TableCell>
                    <TableCell>{dateFormatter.format(new Date(record.createdAt))}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
