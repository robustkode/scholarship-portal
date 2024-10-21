import { TOKEN_LENGTH, TOKEN_TTL } from "@/config";
import { db } from "@/db";
import { resetTokens } from "@/db/schema";
import { generateRandomToken } from "./utils";
import { eq } from "drizzle-orm";

export async function createPasswordResetToken(userId) {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await db.delete(resetTokens).where(eq(resetTokens.userId, userId));
  await db.insert(resetTokens).values({
    userId,
    token,
    tokenExpiresAt,
  });

  return token;
}

export async function getPasswordResetToken(token) {
  const existingToken = await db.query.resetTokens.findFirst({
    where: eq(resetTokens.token, token),
  });

  return existingToken;
}


export async function deletePasswordResetToken(token, trx = db) {
  await trx.delete(resetTokens).where(eq(resetTokens.token, token));
}
