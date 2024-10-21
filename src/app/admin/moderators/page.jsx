"use client";
import Container from "@/components/container";
import { LoaderButton } from "@/components/loader-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import FireModeratorButton from "./_components/fire-moderator-button";
import { createModeratorTokenAction } from "./action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/error-message";

const schema = z.object({
  email: z.string().email(),
});

const fetchModerators = async () => {
  return await apiClient.get("/moderators");
};

export default function Moderators() {
  const [toggled, setToggled] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const { data, error, isError, isPending, refetch } = useQuery({
    queryKey: ["moderators"],
    queryFn: fetchModerators,
  });

  const { execute, isPending: isCreatePending } = useServerAction(
    createModeratorTokenAction,
    {
      onError({ err }) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
        });
      },
      onSuccess() {
        toast({
          title: "Token created and sent sucessfully",
          variant: "success",
        });
      },
    }
  );

  const onSubmit = (values) => {
    //console.log(values);
    execute(values);
  };

  return (
    <main>
      <Container className="" as="div">
        {!toggled ? (
          <div className="flex justify-end">
            <Button
              onClick={() => setToggled(true)}
              variant="link"
              className="ml-auto"
            >
              Invite new moderator
            </Button>
          </div>
        ) : (
          ""
        )}

        {toggled ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex justify-center gap-4 flex-wrap"
            >
              <FormField
                control={form.control}
                name="email"
                className="my-8"
                render={({ field }) => (
                  <FormItem className="basis-48 shrink">
                    <FormControl>
                      <Input {...field} placeholder="Enter email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <LoaderButton isLoading={isCreatePending}>
                  Send token
                </LoaderButton>
                <Button
                  onClick={() => {
                    form.reset();
                    setToggled(false);
                  }}
                  variant="outline"
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          ""
        )}
        <section>
          {isPending ? (
            <div className="flex flex-wrap gap-8">
              {[...Array(4)].map((_, i) => (
                <div className="flex gap-6 items-center justify-center" key={i}>
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-10 w-20" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <ErrorMessage message={error.message} retry={refetch} />
          ) : !data.length ? (
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl">No moderators yet!</h2>
              <Button
                className="w-fit"
                onClick={() => {
                  form.reset();
                  setToggled(true);
                }}
              >
                Invite a moderator
              </Button>
            </div>
          ) : (
            <ul className="flex flex-wrap gap-8 justify-center">
              {data.map((d) => (
                <li
                  className="flex items-center bg-gray-100 px-4 py-2 rounded-sm basis-64 justify-between"
                  key={d.id}
                >
                  <p>{d.email}</p>
                  <FireModeratorButton tobefired={{ email: d.email }} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </Container>
    </main>
  );
}
