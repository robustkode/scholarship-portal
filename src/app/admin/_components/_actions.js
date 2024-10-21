import { authenticatedAction } from "@/lib/safe-actions";
import * as z from "zod";

export const uploadImageAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      scholarshipId: z.number(),
      fileWrapper: z.instanceof(FormData),
    })
  )
  .handler(async ({ input }) => {
    const file = input.fileWrapper.get("file");
    await uploadScholarshipImageUseCase({ input: { scholarshipId, file } });
    //revalidatePath(`/dashboard/groups/${input.groupId}/settings`);
  });
