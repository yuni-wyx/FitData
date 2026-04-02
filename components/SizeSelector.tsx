"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sizeOptions, type SizeOption } from "@/lib/types";

interface SizeSelectorProps {
  value: SizeOption | null;
  onChange: (value: SizeOption) => void;
  disabled?: boolean;
}

export function SizeSelector({
  value,
  onChange,
  disabled = false
}: SizeSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-slate-500">實際尺碼</p>
      <div className="grid grid-cols-4 gap-3">
        {sizeOptions.map((size) => {
          const isActive = value === size;

          return (
            <Button
              key={size}
              type="button"
              variant={isActive ? "default" : "outline"}
              className={cn(
                "h-16 w-full rounded-2xl text-lg font-bold shadow",
                isActive && "ring-2 ring-orange-200"
              )}
              disabled={disabled}
              onClick={() => onChange(size)}
            >
              {size}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
