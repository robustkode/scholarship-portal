"use server";
import { authenticatedAction } from "@/lib/safe-actions";
import { createModeratorTokenUseCase } from "@/use-cases/users";
import {
  addVideoUseCase,
  deleteVideoUseCase,
  updateVideoUseCase,
} from "@/use-cases/videos";
import { revalidatePath, revalidateTag } from "next/cache";
import * as z from "zod";

export const addVideoAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      title: z.string().min(3),
      link: z.string().url(),
      tag: z.string().min(3),
      scholarshipId: z.string().optional(),
    })
  )
  .handler(async ({ input, ctx }) => {
    const response = await addVideoUseCase(input);
    revalidateTag("home-guides");
    revalidatePath("/");
    return response;
  });

export const deleteVideoAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    const response = await deleteVideoUseCase(input);
    revalidateTag("home-guides");
    revalidatePath("/");
    return response;
  });

export const updateVideoAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      id: z.string(),
      title: z.string().min(3),
      link: z.string().url(),
      tag: z.string().min(3),
      scholarshipId: z.string().optional(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await updateVideoUseCase(input);
    revalidateTag("home-guides");
    revalidatePath("/");
  });
