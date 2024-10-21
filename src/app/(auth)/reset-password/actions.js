"use server";

import { RateLimitByIp, rateLimitByIp } from "@/lib/limiter";
import { unauthenticatedAction } from "@/lib/safe-actions";
import { changePasswordUseCase } from "@/use-cases/users"
import { z } from "zod";

export const changePasswordAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      token: z.string(),
      password: z.string().min(8),
    }),
  )
  .handler(async ({ input: { token, password } }) => {
    await RateLimitByIp({ key: "change-password", limit: 2, window: 30000 });
    await changePasswordUseCase(token, password);
  });
