"use server";

import { hashIterations } from "@/config";
import { db } from "@/db";
import { blogs, users } from "@/db/schema";
import { unauthenticatedAction } from "@/lib/safe-actions";
import * as z from "zod";
import crypto, { randomUUID } from "crypto";
import { rateLimitByKey } from "@/lib/limiter";
import { redirect } from "next/navigation";
import { signUpUseCase } from "@/use-cases/users";

async function hashPassword(plainTextPassword, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      hashIterations,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      }
    );
  });
}

export async function fail() {
  const salt = crypto.randomBytes(128).toString("base64");
  const hash = await hashPassword("123456", salt);
  await db.insert(users).values({
    email: "test@test.com",
    salt,
    passwordHash: hash,
  });
}

export async function seed() {
  await db.insert(blogs).values([
    {
      tags: JSON.stringify(["tech", "innovation"]),
      title: "The Future of Technology",
      content: "Exploring the advancements in tech.",
    },
    {
      tags: JSON.stringify(["health", "fitness"]),
      title: "The Benefits of Daily Exercise",
      content: "How daily exercise improves health.",
    },
    {
      tags: JSON.stringify(["cooking", "recipes"]),
      title: "Delicious Homemade Pasta",
      content: "A guide to making pasta from scratch.",
    },
    {
      tags: JSON.stringify(["travel", "adventure"]),
      title: "Top Destinations for 2024",
      content: "The best travel destinations for the coming year.",
    },
  ]);
}

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      token: z.string().min(10),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByKey({ key: input.email, limit: 3, window: 10000 });
    await signUpUseCase(input);
    redirect("/sign-in");
  });
