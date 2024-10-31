"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderButton } from "@/components/loader-button";
import { useServerAction } from "zsa-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { signInAction } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Container from "@/components/container";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Too short"),
});
export default function SignIn() {
  const { execute, isPending, error } = useServerAction(signInAction, {});

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {},
  });

  function onSubmit(values) {
    execute(values);
  }

  return (
    <Container>
      <h1 className="mb-6 header text-2xl text-center">Sign in</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Enter your email"
                    type="email"
                  />
                </FormControl>
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
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Enter your password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Oops!, we couldn&apos;t log you in</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <LoaderButton
            isLoading={isPending}
            className="w-full mt-4"
            type="submit"
          >
            Sign In
          </LoaderButton>
        </form>
      </Form>
      <div className="flex justify-end py-2">
        <Button variant="link" className="ml-auto">
          <Link href={"/sign-in/forgot-password"}>Forgot password?</Link>
        </Button>
      </div>
    </Container>
  );
}
