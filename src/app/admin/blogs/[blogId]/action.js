"use server";

import * as z from "zod";

import {
  fetchBlogCoverImageUseCase,
  updateBlogUseCase,
} from "@/use-cases/blogs";

import { updateImageUseCase } from "@/use-cases/file";
import { BLOG_IMAGE_DIR } from "@/config";
import { authenticatedAction } from "@/lib/safe-actions";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";

export const updateBlogAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      id: z.string(),
      title: z.string().min(3),
      content: z.string().min(3),
      tags: z.array(z.string()),
      rTags: z.array(z.string()),
      coverImage: z.instanceof(FormData),
    })
  )
  .handler(async ({ input, ctx }) => {
    const file = input.coverImage.get("file");
    const oldImage = await fetchBlogCoverImageUseCase(input.id);
    const { url, update } = await updateImageUseCase(
      oldImage,
      file,
      BLOG_IMAGE_DIR
    );
    let values = {};
    if (update) {
      values = { ...input, coverImage: url };
    } else {
      values = { ...input };
      delete values.coverImage;
    }
    delete values.id;

    await updateBlogUseCase(input.id, values);
    revalidateTag("latest-blogs");
    revalidatePath("/");
    redirect("/blogs/" + input.id);
  });
