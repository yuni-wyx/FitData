export const sizeOptions = ["S", "M", "L", "XL", "2L", "3L", "4L", "5L"] as const;
export const fitPreferenceOptions = ["FITTED", "LOOSE"] as const;
export const fitPreferenceLabels = {
  FITTED: "合身",
  LOOSE: "寬鬆"
} as const;

export type SizeOption = (typeof sizeOptions)[number];
export type FitPreferenceOption = (typeof fitPreferenceOptions)[number];

export interface CasePayload {
  id: number;
  productName: string;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  suggestedSize: SizeOption;
  actualSize: SizeOption | null;
  fitPreference: FitPreferenceOption | null;
  isLabeled: boolean;
  progress: {
    current: number;
    total: number;
    labeled: number;
  };
}

export interface NextCaseResponse {
  case: CasePayload | null;
  done: boolean;
}

export interface AdminLabelRecord {
  id: number;
  productName: string;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  suggestedSize: string;
  actualSize: string | null;
  fitPreference: FitPreferenceOption;
  createdAt: string;
}
