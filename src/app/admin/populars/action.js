"use server";
import { authenticatedAction } from "@/lib/safe-actions";
import {
  addPopularUseCase,
  deletePopularUseCase,
  reOrderPopularsUseCase,
} from "@/use-cases/countries";
import { createModeratorTokenUseCase } from "@/use-cases/users";
import {
  addVideoUseCase,
  deleteVideoUseCase,
  updateVideoUseCase,
} from "@/use-cases/videos";
import { revalidatePath, revalidateTag } from "next/cache";
import * as z from "zod";

export const addPopularAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      country: z.string().min(2),
    })
  )
  .handler(async ({ input, ctx }) => {
    const response = await addPopularUseCase(input);
    revalidateTag("home-populars");
    revalidatePath("/");
    return response;
  });

export const deletePopularAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await deletePopularUseCase(input);
  });

export const reOrderPopularAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      countries: z.array(
        z.object({
          id: z.string(),
          rank: z.number().transform((r) => parseInt(r)),
        })
      ),
    })
  )
  .handler(async ({ input, ctx }) => {
    await reOrderPopularsUseCase(input);
  });

//   export const updatePopularsAction = authenticatedAction
//   .createServerAction()
//   .input(
//     z.object({
//       countries: z.array(),
//     })
//   )
//   .handler(async ({ input, ctx }) => {
//     return await updatePopularsUseCase(input);
//   });
