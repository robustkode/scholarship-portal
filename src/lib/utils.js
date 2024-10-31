import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FILE_BASE_URL, hashIterations } from "@/config";
import crypto from "crypto";
import { capitalize } from "lodash";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function verifyPassword(passwordHash, salt, plainTextPassword) {
  const hash = await hashPassword(plainTextPassword, salt);
  return passwordHash == hash;
}

export async function hashPassword(plainTextPassword, salt) {
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

export function getLabel(val, object) {
  try {
    const valList = val.split(",");
    const labelList = valList.map((v) => {
      return object.find((obj) => obj.value === v).label;
    });
    return labelList.join(", ");
  } catch (_) {
    return val;
  }
}
export function capitalizeStringArray(
  string,
  separator = ",",
  returnArray = false
) {
  if (!string || typeof string !== "string") {
    return undefined;
  }
  try {
    let l = string.split(separator);
    l = l.map((w) => {
      return capitalize(w);
    });
    if (returnArray) {
      return l;
    }
    return l.join(", ");
  } catch (_) {
    return "";
  }
}

export function isValidURL(urlString) {
  try {
    new URL(urlString);
    return true; // Valid URL
  } catch {
    return false; // Invalid URL
  }
}

export async function uploadImage(getUrl, file, toast) {
  if (!file || !file.type) {
    return;
  }
  try {
    const urlRes = await getUrl({
      dir: "blg",
      contentType: file.type,
    });
    const { url, fields } = urlRes[0];

    const data = {
      ...fields,
      "Content-Type": file.type,
      file,
    };
    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }

    await fetch(url, {
      method: "POST",
      body: formData,
      mode: "cors",
    });
    return (
      process.env.NEXT_PUBLIC_FILE_BASE_URL +
      urlRes[0]["fields"].bucket +
      "/" +
      urlRes[0]["fields"].key
    );
  } catch (err) {
    toast({
      title: "Something went wrong uploding image.",
      description: err.message,
      variant: "destructive",
    });
    return "";
  }
}
