import { assertAuthenticated } from "@/lib/session";
import { PublicError } from "./errors";
import { createUUID } from "@/util/uuid";
import { getPresignedPostUrl, uploadFileToBucket } from "@/lib/files";
import { assertModerator } from "./authorization";

export async function uploadImageUseCase(file, dir) {
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
  const imageKey = dir + imageId;
  await uploadFileToBucket(file, imageKey);
  return imageId;
}

export async function updateImageUseCase(oldImg, file, dir) {
  await assertModerator();
  let update = false;
  let url = "";
  //! have methode to check image
  if (typeof file === "object") {
    const imageId = createUUID();
    const imageKey = dir + imageId;
    url = await uploadFileToBucketT(file, imageKey);
    update = true;

    if (oldImg) {
      try {
        await deleteFileFromBucketT(oldImg);
      } catch (_) {}
    }
  }

  if ((file === "") & oldImg) {
    await deleteFileFromBucketT(oldImg);
    url = "";
    update = true;
  }

  return { url, update };
}

export async function getImageUploadURLUseCase(dir, contentType) {
  await assertModerator();
  const imageId = createUUID();
  const fileName = dir + imageId;
  return getPresignedPostUrl(fileName, contentType);
}

async function uploadFileToBucketT(f, _) {
  return await new Promise((resolve) => {
    resolve("uploaded-url");
  });
}

export async function deleteFileFromBucketT(f) {
  return await new Promise((resolve) => {
    resolve("uploaded-url");
  });
}
