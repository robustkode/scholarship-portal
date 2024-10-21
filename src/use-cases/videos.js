import {
  addVideo,
  deleteVideo,
  fetchVideo,
  updateVideo,
} from "@/data-access/videos";
import { assertModerator } from "./authorization";
import { NotFoundError } from "./errors";
import { fetchScholarship } from "@/data-access/scholarships";

export async function addVideoUseCase(input) {
  await assertModerator();
  return await addVideo(input);
}

export async function deleteVideoUseCase({ id }) {
  await assertModerator();
  const video = fetchVideo(id);
  if (!video) {
    throw new NotFoundError("No video by this id");
  }
  await deleteVideo(id);
}

export async function updateVideoUseCase(input) {
  await assertModerator();
  const video = fetchVideo(input.id);
  if (!video) {
    throw new NotFoundError("No video by this id");
  }

  if (input.scholarshipId) {
    const scholarship = fetchScholarship(input.scholarshipId);
    if (!scholarship)
      throw new NotFoundError("No scholarship by this" + input.scholarshipId);
  } else {
    delete input.scholarshipId;
  }

  await updateVideo(input);
}
