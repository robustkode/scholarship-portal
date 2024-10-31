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
      successMessage="Successfuly fired the moderator."
      title="Fire A moderator"
      description=" Are you sure you want to fire  this moderator? This action cannot be undone."
      label="Fire"
    />
  );
}
