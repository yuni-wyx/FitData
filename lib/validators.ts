import { z } from "zod";

import { fitPreferenceOptions, sizeOptions } from "@/lib/types";

export const labelSubmissionSchema = z.object({
  caseId: z.number().int().positive(),
  selectedSize: z.enum(sizeOptions),
  fitPreference: z.enum(fitPreferenceOptions)
});

export const adminFiltersSchema = z.object({
  productName: z.string().trim().max(100).optional().default(""),
  actualSize: z.string().trim().max(10).optional().default(""),
  fitPreference: z.string().trim().max(20).optional().default("")
});
