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
import { deleteBlogAction } from "../_actions";
import { useParams } from "next/navigation";

export function DeleteBlogButton({ type = "submit" }) {
  const { blogId } = useParams();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isPending, error } = useServerAction(deleteBlogAction, {
    onSuccess() {
      toast({
        title: "Success",
        description: "You left this group.",
      });
    },
    onError({ err }) {
      setIsOpen(false);
      toast({
        title: "Uh oh",
        variant: "destructive",
        description: "Something went wrong delete scholarship." + err?.message,
      });
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"link"} className={cn("w-fit")} type={type}>
          Delete blog
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
              execute({ blogId });
            }}
          >
            Delete Blog
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
