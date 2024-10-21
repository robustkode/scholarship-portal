import { AVAILABLE_DEGREES } from "@/config";
import { z } from "zod";

export const AVAILABLE_SORT = ["asc", "desc"];

export const ScholarshipFilter = z.object({
  country: z.array(z.string()),
  degree: z.array(z.string()),
  sort: z.enum(AVAILABLE_SORT),
  page: z.number(),
  updated: z.boolean().optional(),
});

export default function formatSearchParams() {}
