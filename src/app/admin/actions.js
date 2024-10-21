"use server";
import { BLOG_IMAGE_DIR, SCHOLARSHIP_IMAGE_DIR } from "@/config";
import { authenticatedAction } from "@/lib/safe-actions";
import { getImageUploadURLUseCase } from "@/use-cases/file";
import * as z from "zod";

export const getPresignedPostUrlAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      dir: z.enum(["sch", "blg"]),
      contentType: z.string(),
    })
  )
  .handler(async ({ input: { dir, contentType } }) => {
    let directory;
    if (dir === "sch") {
      directory = SCHOLARSHIP_IMAGE_DIR;
    } else {
      directory = BLOG_IMAGE_DIR;
    }
    return await getImageUploadURLUseCase(directory, contentType);
  });
