import { DeleteButton } from "@/components/ui/delete-button";
import { deleteVideoAction } from "../action";
import { queryClient } from "@/lib/react-query";

export default function VideoDeleteButton({ tobedeltedId, page }) {
  const handleDelete = async (id) => {
    await deleteVideoAction(id);
    queryClient.invalidateQueries(["videos", page]);
  };
  return (
    <DeleteButton
      action={handleDelete}
      tobedeltedID={tobedeltedId}
      successMessage="Successfuly deleted the video"
      title="Delete a Video"
      description=" Are you sure you want to delete? This action cannot be undone."
      label="Delete"
    />
  );
}
