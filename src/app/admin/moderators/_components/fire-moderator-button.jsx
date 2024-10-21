import { DeleteButton } from "@/components/ui/delete-button";
import { fireModeratorAction } from "../action";
import { queryClient } from "@/lib/react-query";

export default function FireModeratorButton({ tobefired }) {
  const handleFire = async () => {
    await fireModeratorAction(tobefired);
    queryClient.invalidateQueries(["moderators"]);
  };
  return (
    <DeleteButton
      action={handleFire}
      tobedeltedID={tobefired}
      successMessage="Successfuly fired this bitch"
      title="Fire A moderator"
      description=" Are you sure you want to delete this group? All your members will no
            longer be able to view the group information and all data will be
            removed from our system."
      label="Fire"
    />
  );
}
