"use client";

import TipTap from "@/components/tiptap";
import { Button } from "@/components/ui/button";
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
import { useForm, handleSubmit } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import DropImage from "../../_components/drop-image";
import { useToast } from "@/hooks/use-toast";
import { createBlogAction, writeBlogAction } from "../write/actions";
import { useServerAction } from "zsa-react";
import { LoaderButton } from "@/components/loader-button";
import { DeleteBlogButton } from "./delete-blog-button";
import { updateBlogAction } from "../[blogId]/action";
import Container from "@/components/container";
import { compare } from "@/util";
import { queryClient } from "@/lib/react-query";
import { getPresignedPostUrlAction } from "../../actions";
import { FILE_BASE_URL } from "@/config";
import { uploadImage } from "@/lib/utils";

const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "Too short" }),
  content: z.string().min(3, { message: "too short" }),
  tags: z.string().optional(),
});

export default function BlogForm({ data, page }) {
  const [file, setFile] = useState(data?.coverImage || null);
  const { toast } = useToast();
  const form = useForm({
    mode: "onchange",
    resolver: zodResolver(blogSchema),
    defaultValues: data
      ? {
          title: data.title,
          content: data.content,
          tags: data.tags,
          id: data.id,
        }
      : {},
  });

  const { execute, isPending, error } = useServerAction(
    data ? updateBlogAction : createBlogAction,
    {
      onError({ err }) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
        });
      },
    }
  );

  const { execute: getUrl, error: imageUrlError } = useServerAction(
    getPresignedPostUrlAction,
    {
      onError({ err }) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
        });
      },
    }
  );
  async function onSubmit(values) {
    const formData = new FormData();

    const urlRes = await uploadImage(getUrl, file, toast);

    let valuesWithImage = {
      ...values,
      coverImage: data ? (urlRes ? urlRes : data.coverImage) : urlRes,
    };
    // let valuesWithImage = { ...values, coverImage: formData };
    if (data) {
      const { addedItems: tags, removedItems: rTags } = compare(
        data.tags,
        values.tags
      );
      valuesWithImage = { ...valuesWithImage, tags, rTags };
      await execute(valuesWithImage);
      if (page) {
        queryClient.invalidateQueries(["blogs", page]);
      }
      queryClient.invalidateQueries(["blog", data.id]);
    } else {
      await execute(valuesWithImage);
      try {
        queryClient.setQueryData(["blogs"], (old) => {
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
      } catch (_) {}
    }
  }

  return (
    <main className="my-12">
      <Container>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DropImage img={file} setImg={setFile} />
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
              name="tags"
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
              name="content"
              className="my-8"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TipTap
                      content={field.value}
                      onChange={field.onChange}
                      height={700}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end flex-wrap mt-6 gap-4">
              {data && (
                <DeleteBlogButton type="button">Delete</DeleteBlogButton>
              )}
              <LoaderButton type="submit" isLoading={isPending}>
                {data ? "Update blog" : "Post blog"}
              </LoaderButton>
            </div>
          </form>
        </Form>
      </Container>
    </main>
  );
}
