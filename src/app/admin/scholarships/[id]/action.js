"use server";

import * as z from "zod";
import { randomUUID } from "crypto";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase";
import { createBlogUseCase } from "@/use-cases/blogs";
import {
  createScholarshipUseCase,
  fetchCoverImageUseCase,
  updateScholarshipImageUseCase,
  updateScholarshipUseCase,
} from "@/use-cases/scholarships";
import { authenticatedAction, shapeErrors } from "@/lib/safe-actions";
import { uploadScholarshipImageUseCase } from "@/use-cases/scholarships";
import { redirect } from "next/navigation";
import { updateImageUseCase } from "@/use-cases/file";
import { SCHOLARSHIP_IMAGE_DIR } from "@/config";
import { revalidatePath, revalidateTag } from "next/cache";

const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

const ScholarshipSchema = z.object({
  name: z.string().min(3, { message: "Too short" }),
  University: z.string().min(3, { message: "too short" }),
  country: z.string().min(3, { message: "too short" }).optional(),
  tution: z.string().min(3, { message: "too short" }),
  openTime: z.number().optional(),
  deadline: z.number(),
  about: z.string().min(3, { message: "Too short" }),
  eligibility: z.string().min(3, { message: "Too short" }),
  documents: z.string(),
  benefits: z.string(),
  howApply: z.string(),
  applyLink: z.string().min(3, { message: "Too short" }),
  otherFields: z.string().optional(),
  coverImage: z.instanceof(File),
});

export const updateScholarshipAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      id: z.string(),
      name: z.string().min(3),
      university: z.string().min(3),
      tution: z.number(),
      openTime: z.number(),
      deadline: z.number(),
      about: z.string().min(3),
      eligibility: z.string().min(3),
      documents: z.string(),
      benefits: z.string(),
      howApply: z.string(),
      applyLink: z.union([z.string().length(0), z.string().url()]),
      otherFields: z.string().optional(),
      coverImage: z.union([z.instanceof(FormData), z.string()]),
      tags: z.array(z.string()),
      degrees: z.array(z.enum(["bh", "ms", "ph", "ot"])),
      countries: z.array(z.string()),
      rTags: z.array(z.string()),
      rDegrees: z.array(z.string()),
      rCountries: z.array(z.string()),
    })
  )
  .handler(async ({ input, ctx }) => {
    const file = input.coverImage.get("file");
    const oldImage = await fetchCoverImageUseCase(input.id);
    const { url, update } = await updateImageUseCase(
      oldImage,
      file,
      SCHOLARSHIP_IMAGE_DIR
    );
    let values = {};
    if (update) {
      values = { ...input, coverImage: url };
    } else {
      values = { ...input };
      delete values.coverImage;
    }
    delete values.id;

    values["userId"] = ctx.user.id;
    await updateScholarshipUseCase(input.id, values);
    // revalidateTag("home-recent-scholarships");
    // revalidatePath("/");
    revalidatePath("/scholarships/" + input.id);
    redirect("/scholarships/" + input.id);
  });
