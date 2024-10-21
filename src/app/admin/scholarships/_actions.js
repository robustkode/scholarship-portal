"use server";

import { authenticatedAction } from "@/lib/safe-actions";
import { deleteScholarshipUseCase } from "@/use-cases/scholarships";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const deleteScholarshipAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      schId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    await deleteScholarshipUseCase(input.schId);
    revalidateTag("home-recent-scholarships");
    revalidatePath("/");
    redirect("/scholarships");
  });
