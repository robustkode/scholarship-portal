import { DeleteButton } from "@/components/ui/delete-button";
import { deletePopularAction } from "../action";
import { queryClient } from "@/lib/react-query";

export default function PopularDeleteButton({ tobedeltedId }) {
  const handleDelete = async (id) => {
    await deletePopularAction(id);
    queryClient.invalidateQueries(["populars"]);
  };
  return (
    <DeleteButton
      action={handleDelete}
      tobedeltedID={tobedeltedId}
      successMessage="Successfuly deleted the Country"
      title="Delete a popular "
      description=" Are you sure you want to delete this video? All your members will no
            longer be able to view the group information and all data will be
            removed from our system."
      label={<span className="text-sm">Delete</span>}
    />
  );
}
