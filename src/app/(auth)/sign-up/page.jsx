"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderButton } from "@/components/loader-button";
import { useServerAction } from "zsa-react";
import { signUpAction } from "./actions";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const signUpSchema = z.object({
  email: z.string().email("Use a real email"),
  password: z.string().min(6),
  token: z.string().min(10, { message: "Click the link your email" }),
});

export default function SignUp({ searchParams }) {
  const { toast } = useToast();
  const { execute, isPending } = useServerAction(signUpAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    },
  });
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      token: searchParams.token,
    },
  });

  const onSubmit = (values) => {
    execute(values);
  };

  return (
    <div>
      <h1 className="mb-6 text-center text-2xl">Sign up</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoaderButton className={"mt-8 w-full"} isLoading={isPending}>
            Sign up
          </LoaderButton>
        </form>
      </Form>
    </div>
  );
}
