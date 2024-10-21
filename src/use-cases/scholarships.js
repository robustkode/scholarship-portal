import { createBlog, fetchBlog, fetchBlogs } from "@/data-access/blogs";
import { AuthenticationError, NotFoundError } from "./errors";
import { assertAuthenticated, getCurrentUser } from "@/lib/session";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import {
  createScholarship,
  deleteScholarship,
  fetchFilteredScholarships,
  fetchScholarship,
  fetchScholarshipImage,
  fetchScholarships,
  updateScholarship,
} from "@/data-access/scholarships";
import { createUUID } from "@/util/uuid";
import { MAX_UPLOAD_IMAGE_SIZE, MAX_UPLOAD_IMAGE_SIZE_IN_MB } from "@/config";
import { uploadFileToBucket } from "@/lib/files";
import { scholarships } from "@/db/schema/index.bak";
import { assertModerator } from "./authorization";

export async function createScholarshipUseCase(values) {
  await assertModerator();
  return await createScholarship(values);
}

export async function fetchScholarshipUseCase(id) {
  return await fetchScholarship(id);
}

export async function updateScholarshipUseCase(id, values) {
  await assertModerator();
  //! check if the file exist before updating
  // but since check in fetchBlofCoverImageusecase and not used this in other place wwe can skip

  await updateScholarship(id, values);
}

export async function fetchScholarshipsUseCase() {
  const scholarship = await fetchScholarships();
  return scholarship;
}

export async function fetchScholarshipsCardUseCase() {
  //edit to return only required fields
  const scholarship = await fetchScholarships();
  return scholarship;
}

export async function uploadScholarshipImageUseCase(file) {
  await assertModerator();
  if (!file.type.startsWith("image/")) {
    throw new PublicError("File should be an image.");
  }
  if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new PublicError(
      `File size should be less than ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB.`
    );
  }
  const imageId = createUUID();
  const scholarshipImageKey = `scholarships/images/${imageId}`;
  await uploadFileToBucket(file, scholarshipImageKey);
  return imageId;
}

// export async function updateScholarshipImageUseCase(oldImg, file) {
//   //await assertModerator()
//   let update = false;
//   let url = "";
//   //! have methode to check image
//   if (typeof file === "object") {
//     const imageId = createUUID();
//     const scholarshipImageKey = `scholarships/images/${imageId}`;
//     url = await uploadFileToBucketT(file, scholarshipImageKey);
//     update = true;

//     if (oldImg) {
//       try {
//         await deleteFileFromBucketT(oldImg);
//       } catch (_) {}
//     }
//   }

//   if ((file === "") & oldImg) {
//     await deleteFileFromBucketT(oldImg);
//     url = "";
//     update = true;
//   }

//   return { url, update };
// }

export async function fetchCoverImageUseCase(id) {
  const image = await fetchScholarshipImage(id);
  if (image === null || image === undefined) {
    throw new NotFoundError();
  }

  return image;
}

export async function deleteScholarshipUseCase(id) {
  await assertModerator();
  const sch = await fetchScholarship(id);
  if (!sch) throw new NotFoundError();

  //! if its failed store it in a database
  if (sch.coverImage) {
    try {
      //! use fetchScholarshipCoverImage or other method

      await deleteFileFromBucketT(sch.coverImage);
    } catch (_) {}
  }
  await deleteScholarship(id);
}

//! EDIT
async function deleteFileFromBucketT(f) {
  return await new Promise((resolve) => {
    resolve("uploaded-url");
  });
}

export async function fetchFilteredScholarshipsUseCase(filter_params) {
  return await fetchFilteredScholarships(filter_params);
}
