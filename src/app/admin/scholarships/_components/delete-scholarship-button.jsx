"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DoorOpen } from "lucide-react";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { cn } from "@/lib/utils";
import { LoaderButton } from "@/components/loader-button";
import { useToast } from "@/hooks/use-toast";
import { useScholarshipIdParam } from "../util";
import { deleteScholarshipAction } from "../_actions";
import { Trash } from "lucide-react";

export function DeleteScholarshipButton({ schId }) {
  //const schId = useScholarshipIdParam();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isPending, error } = useServerAction(
    deleteScholarshipAction,
    {
      onSuccess() {
        toast({
          title: "Success",
          description: "You left this group.",
        });
      },
      //! on error close alert dialoag and show not found error
      onError({ err }) {
        toast({
          title: "Uh oh",
          variant: "destructive",
          description:
            "Something went wrong delete scholarship." + err?.message,
        });
      },
    }
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"link"} className={cn("w-fit")} type="button">
          Delete Scholarship
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Group</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this group? All your members will no
            longer be able to view the group information and all data will be
            removed from our system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton
            isLoading={isPending}
            onClick={() => {
              execute({ schId });
            }}
            type="button"
          >
            Delete Scholarship
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
