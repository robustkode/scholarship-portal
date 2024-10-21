import { useSafeParams } from "@/lib/params";
import { z } from "zod";

export function useScholarshipIdParam() {
  const { id } = useSafeParams(z.object({ id: z.string() }));
  return id;
}
