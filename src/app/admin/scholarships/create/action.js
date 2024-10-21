"use server";

import * as z from "zod";
import { randomUUID } from "crypto";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase";
import { createBlogUseCase } from "@/use-cases/blogs";
import { createScholarshipUseCase } from "@/use-cases/scholarships";
import { authenticatedAction, shapeErrors } from "@/lib/safe-actions";
import { uploadScholarshipImageUseCase } from "@/use-cases/scholarships";
import { redirect } from "next/navigation";
import { uploadImageUseCase } from "@/use-cases/file";
import { DEGREES, SCHOLARSHIP_IMAGE_DIR } from "@/config";
import { country } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";

const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

const ScholarshipSchema = z.object({
  name: z.string().min(3),
  University: z.string().optional(),
  country: z.string(z.string()),
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
  coverImage: z.instanceof(File),
});

export const createScholarshipAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(3),
      university: z.string().min(3),
      tution: z.number(),
      openTime: z.number().optional(),
      deadline: z.number(),
      about: z.string().min(3),
      eligibility: z.string().min(3),
      documents: z.string(),
      benefits: z.string(),
      howApply: z.string(),
      applyLink: z.union([z.string().length(0), z.string().url()]),
      otherFields: z.string().optional(),
      coverImage: z.instanceof(FormData),
      countries: z.string(),
      tags: z.array(z.string()),
      degrees: z.array(z.enum(["bh", "ms", "ph", "ot"])),
      countries: z.array(z.string()),
    })
  )
  .handler(async ({ input, ctx }) => {
    const file = input.coverImage.get("file");
    //const url = await uploadImageUseCase(file, SCHOLARSHIP_IMAGE_DIR);
    const url = "";
    const id = await createScholarshipUseCase({
      ...input,
      coverImage: "mnm",
      userId: ctx.user.id,
    });
    // console.log({
    //   ...input,
    //   coverImage: "mnm",
    //   userId: ctx.user.id,
    // });
    revalidateTag("home-recent-scholarships");
    revalidatePath("/");
    redirect("/scholarships/" + id);
    //revalidatePath(`/dashboard/groups/${input.groupId}/settings`);
  });
