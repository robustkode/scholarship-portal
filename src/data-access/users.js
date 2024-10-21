import { db } from "@/db";
import { accountTokens, accountTokenss, users } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import crypto from "crypto";
import { hashPassword } from "@/lib/utils";
import { moderatorRole, TOKEN_LENGTH, TOKEN_TTL } from "@/config";
import { generateRandomToken } from "./utils";
import { assertAdmin } from "@/use-cases/authorization";

export async function getUserByEmail(email) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user;
}

export async function updatePassword(userId, password, trx = db) {
  const salt = crypto.randomBytes(128).toString("base64");
  const hash = await hashPassword(password, salt);
  await trx
    .update(users)
    .set({
      passwordHash: hash,
      salt,
    })
    .where(eq(users.id, userId));
}

export async function createUser(email, password, role) {
  const salt = crypto.randomBytes(128).toString("base64");
  const passwordHash = await hashPassword(password, salt);
  await db
    .insert(users)
    .values({ email, salt, passwordHash, role, emailVerified: 1 });
}

// tokens

export async function getSignInTokenByEmail(email) {
  return await db.query.accountTokens.findFirst({
    where: eq(accountTokens.email, email),
  });
  // return { token: "dsafhjhajfhgafhghasdgfhaghfghasgdfhgsahfd", role: 2 };
}

export async function createModeratorToken(email) {
  await assertAdmin();
  const token = await generateRandomToken(TOKEN_LENGTH);
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await db.delete(accountTokens).where(eq(accountTokens.email, email));

  await db
    .insert(accountTokens)
    .values({
      email,
      token,
      role: moderatorRole,
      tokenExpiresAt,
    })
    .returning();

  return { token, email };
}

export async function deleteModerator(email) {
  await db.delete(users).where(eq(users.email, email));
}

export async function fetchModerators() {
  return await db.query.users.findMany({
    where: eq(users.role, moderatorRole),
  });
}

export async function fetchModeratorsCount() {
  const [{ count: c }] = await db
    .select({ count: count(users.id) })
    .from(users)
    .where(eq(users.role, moderatorRole));
  return c;
}
