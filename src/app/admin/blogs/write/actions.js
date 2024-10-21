"use server";

import * as z from "zod";
import { randomUUID } from "crypto";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase";
import { createBlogUseCase } from "@/use-cases/blogs";
import { authenticatedAction, shapeErrors } from "@/lib/safe-actions";
import { uploadImageUseCase } from "@/use-cases/file";
import { BLOG_IMAGE_DIR } from "@/config";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";

const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

const imgSchema = z.union([
  z.instanceof(File).refine((file) => {
    if (file instanceof File) {
      const isImage = file.type.startsWith("image/");
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isValidExtension = allowedExtensions.includes(fileExtension);
      const isNonEmpty = file.size > 0;

      if (isImage && isValidExtension && isNonEmpty) {
        return true;
      }
    }

    return false;
  }),
  z.string(),
]);

const blogSchema = z.object({
  title: z.string().min(3, { message: "Too short" }),
  content: z.string().min(3, { message: "too short" }),
  tags: z.string(),
  img: imgSchema,
});

export async function writeBlogAction(prevState, formData) {
  const values = Object.fromEntries(formData);
  const result = blogSchema.safeParse(values);
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;
  const images = Object.keys(data)
    .filter((key) => key.includes("img"))
    .map((key) => {
      return { name: key, file: data[key] };
    });

  const promises = Array.from(images).map((img) => {
    return uploadImage(img);
  });

  const urls = await Promise.all(promises);

  const blogData = Object.assign({}, data, Object.assign({}, ...urls));

  //# adjust images
  try {
    await createBlogUseCase(blogData);
    return;
  } catch (error) {
    return shapeErrors({ err: error });
  }

  //update the database
}

async function uploadImage({ name, file }) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { [name]: name };
  // if (typeof file == "string") {
  //   return { name, url: null };
  // }
  // //await new Promise((resolve) => setTimeout(resolve, 1000));
  // try {
  //   const fileName = randomUUID();
  //   const ext = file.name.split(".").slice(-1)[0];
  //   const fileRef = ref(storage, `blogs/${fileName}.${ext}`);
  //   //
  //   // throw new Error();
  //   const buffer = new Uint8Array(file);
  //   const uploadResult = await uploadBytes(fileRef, buffer);
  //   const url = await getDownloadURL(uploadResult.ref);
  //   return { name, url };
  // } catch (error) {
  //   console.log(error, "error");
  //   return { name, url: null };
  // }
}

export const createBlogAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      title: z.string().min(3, { message: "Too short" }),
      content: z.string().min(3, { message: "too short" }),
      tags: z.string().optional(),
      coverImage: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    const id = await createBlogUseCase({
      ...input,
      coverImage: input.coverImage,
      userId: ctx.user.id,
    });

    revalidateTag("latest-blogs");
    revalidatePath("/");
    redirect(`/blogs/${id}`);
  });
