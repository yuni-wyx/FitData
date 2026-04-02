"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fitPreferenceLabels,
  fitPreferenceOptions,
  type FitPreferenceOption
} from "@/lib/types";

interface FitSelectorProps {
  value: FitPreferenceOption | null;
  onChange: (value: FitPreferenceOption) => void;
  disabled?: boolean;
}

export function FitSelector({
  value,
  onChange,
  disabled = false
}: FitSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-slate-500">穿著感受</p>
      <div className="grid grid-cols-2 gap-3">
        {fitPreferenceOptions.map((option) => {
          const isActive = value === option;

          return (
            <Button
              key={option}
              type="button"
              variant={isActive ? "default" : "outline"}
              className={cn(
                "h-16 w-full rounded-2xl text-lg font-bold shadow",
                isActive && "ring-2 ring-orange-200"
              )}
              disabled={disabled}
              onClick={() => onChange(option)}
            >
              {fitPreferenceLabels[option]}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
