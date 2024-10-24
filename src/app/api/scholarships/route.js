import {} from "@/use-cases/scholarships";
import { ScholarshipFilter } from "./utils";
import {
  fetchFilteredScholarships,
  fetchScholarships,
} from "@/data-access/scholarships";
import { SCHOLARSHIPS_PAGE_SIZE } from "@/config";
import { PublicError } from "@/use-cases/errors";
import * as z from "zod";

export const POST = async (req) => {
  try {
    const { body } = await req.json();
    const { country, degree, sort, page, updated } =
      ScholarshipFilter.parse(body);
    const scholarships = await fetchFilteredScholarships({
      country,
      degree,
      sort,
      page,
      updated,
      pageSize: SCHOLARSHIPS_PAGE_SIZE,
    });
    return new Response(JSON.stringify(scholarships));
  } catch (error) {
    const isAllowedError = error instanceof PublicError;
    return new Response(
      JSON.stringify({
        error: {
          message: isAllowedError
            ? error.message
            : "Server error, Something went wrong!",
        },
      }),
      { status: 500 }
    );
  }
};

const schema = z.object({
  page: z.coerce.number(),
});
const PAGE_SIZE = 10;
export const GET = async (req) => {
  try {
    const page = req.nextUrl.searchParams.get("pageParam");
    const safePage = schema.parse({ page });
    const videos = await fetchScholarships(PAGE_SIZE, "createdAt", safePage);
    return new Response(JSON.stringify(videos));
  } catch (error) {
    const isAllowedError = error instanceof PublicError;
    return new Response(
      JSON.stringify({
        error: {
          message: isAllowedError
            ? error.message
            : "Server error, Something went wrong!",
        },
      }),
      { status: 500 }
    );
  }
};
