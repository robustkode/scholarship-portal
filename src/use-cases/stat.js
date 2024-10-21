import { fetchScholarshipsCount } from "@/data-access/scholarships";
import { assertAdmin, assertModerator } from "./authorization";
import { fetchBlogsCount } from "@/data-access/blogs";
import { fetchPopularsCount } from "@/data-access/countries";
import { fetchModeratorsCount } from "@/data-access/users";
import { fetchGuidesCount } from "@/data-access/videos";

export async function fetchStatUseCase() {
  await assertModerator();
  const schsCount = await fetchScholarshipsCount();
  const blogsCount = await fetchBlogsCount();
  const popularsCount = await fetchPopularsCount();
  const moderatorsCount = await fetchModeratorsCount();
  const guidesCount = await fetchGuidesCount();

  return { blogsCount, schsCount, popularsCount, moderatorsCount, guidesCount };
}
