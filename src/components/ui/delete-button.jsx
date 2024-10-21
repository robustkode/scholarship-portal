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
import { Trash } from "lucide-react";

export function DeleteButton({
  action,
  tobedeltedID,
  successMessage,
  title,
  description,
  label = "Delete",
  type = "submit",
}) {
  //! useBlogParam
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isPending, error } = useServerAction(action, {
    onSuccess() {
      toast({
        title: "Success",
        description: successMessage,
      });
    },
    //! on error close alert dialoag and show not found error
    onError({ err }) {
      toast({
        title: "Uh oh",
        variant: "destructive",
        description: "Something went wrong firing this dude." + err?.message,
      });
    },
    onFinish() {
      setIsOpen(false);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"link"} className={cn("w-fit")} type={type}>
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton
            isLoading={isPending}
            onClick={() => {
              execute(tobedeltedID);
            }}
          >
            {label}
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
