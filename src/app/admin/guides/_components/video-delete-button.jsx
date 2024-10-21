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
      description=" Are you sure you want to delete this video? All your members will no
            longer be able to view the group information and all data will be
            removed from our system."
      label="Delete"
    />
  );
}
