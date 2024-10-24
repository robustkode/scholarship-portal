"use client";
import { LoaderButton } from "@/components/loader-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useServerAction } from "zsa-react";
import { addVideoAction, updateVideoAction } from "../action";
import { useToast } from "@/hooks/use-toast";
import { memo } from "react";
import { queryClient } from "@/lib/react-query";
import { isArray } from "lodash";

const videoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "Too short" }),
  link: z.string().url({ message: "Enter a valid url" }),
  tag: z.string().min(3, { message: "Too short" }),
  scholarshipId: z.string().optional(),
});
export default function VideoForm({ data, page, setCollapsed }) {
  const { toast } = useToast();
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(videoSchema),
    defaultValues: data
      ? {
          title: data.title,
          link: data.link,
          tag: data.tag,
          scholarshipId: data.scholarshipId || "",
          id: data.id,
        }
      : {},
  });
  const { execute, isPending, error } = useServerAction(
    data ? updateVideoAction : addVideoAction,
    {
      onError({ err }) {
        toast({
          title: "Something went wrong",
          title: err.message,
          variant: "destructive",
        });
      },
      onSuccess() {
        form.reset();
        setCollapsed(false);
        toast({
          title: data
            ? "Video updated successfuly."
            : "Video created successfuly.",
        });
      },
    }
  );

  const onSubmit = async (values) => {
    const a = await execute(values);
    if (data) {
      if (page) {
        queryClient.invalidateQueries(["videos", page]);
      }
      queryClient.invalidateQueries(["video", data.id]);
    } else if (isArray(a) && a[0]) {
      queryClient.setQueryData(["videos"], (old) => {
        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              data: [a[0], ...old.pages[0].data],
            },
            ...old.pages.slice(1),
          ],
        };
      });
    }
  };
  return (
    <section className="w-96 shrink">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="link"
            className="my-8"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            className="my-8"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tag"
            className="my-8"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="scholarshipId"
            className="my-8"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Scholarship ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoaderButton
            isLoading={isPending}
            type="submit"
            className="ml-auto mt-8"
          >
            {data ? "Update video" : "Add video"}
          </LoaderButton>
        </form>
      </Form>
    </section>
  );
}
