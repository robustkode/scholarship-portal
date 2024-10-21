"use client";

import { useParams, useSearchParams } from "next/navigation";

export function useSafeParams(schema) {
  const params = useParams();
  const result = schema.parse(params);
  return result;
}

export function useSafeSearchParams(schema) {
  const params = useSearchParams();
  const result = schema.parse(params);
  return result;
}
