import { getChangedPopulars } from "@/util";
import { assertAdmin, assertModerator, isModerator } from "./authorization";
import { NotFoundError, PublicError } from "./errors";
import {
  addPopular,
  deletePopular,
  fetchPopular,
  fetchPopulars,
  updatePopulars,
} from "@/data-access/countries";
import { count, inArray, sql } from "drizzle-orm";
import { popularCountries } from "@/db/schema/index.bak";

export async function addPopularUseCase(input) {
  await assertModerator();
  return await addPopular(input);
}

export async function deletePopularUseCase({ id }) {
  await assertModerator();
  const country = fetchPopular(id);
  if (!country) {
    throw new NotFoundError("No Country by this id");
  }
  await deletePopular(id);
}

export async function reOrderPopularsUseCase(input) {
  await assertModerator();
  //fetch all populars
  const populars = await fetchPopulars();

  //figure out what to be changed
  let toBechanged;
  try {
    toBechanged = getChangedPopulars(populars, input.countries);
    console.log(toBechanged, input, populars);
  } catch (_) {
    throw new PublicError("Something went wrong.");
  }

  if (!toBechanged.length) {
    throw new PublicError("Noting to change!");
  }

  await updatePopulars(toBechanged);
}
