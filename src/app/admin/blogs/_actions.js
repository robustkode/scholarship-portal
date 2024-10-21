"use server";

import { authenticatedAction } from "@/lib/safe-actions";
import { deleteBlogUseCase } from "@/use-cases/blogs";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const deleteBlogAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      blogId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    await deleteBlogUseCase(input.blogId);
    revalidateTag("blogs");
    revalidatePath("/");
    revalidatePath("/blogs/" + input.blogId);
    redirect("/blogs");
  });
