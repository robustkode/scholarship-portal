"use server";
import { authenticatedAction } from "@/lib/safe-actions";
import {
  createModeratorTokenUseCase,
  fireModeratorUseCase,
} from "@/use-cases/users";
import * as z from "zod";

export const createModeratorTokenAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await createModeratorTokenUseCase({
      ...input,
      userId: ctx.user.id,
    });
  });

export const fireModeratorAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .handler(async ({ input }) => {
    await fireModeratorUseCase(input);
  });
