import { db } from "@/db";
import crypto from "crypto";

export async function generateRandomToken(length) {
  const buf = await new Promise((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });

  return buf.toString("hex").slice(0, length);
}

export async function createTransaction(cb) {
  await db.transaction(cb);
}
