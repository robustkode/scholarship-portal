import { fetchBlogs } from "@/data-access/blogs";
import { PublicError } from "@/use-cases/errors";
import * as z from "zod";
const PAGE_SIZE = 10;
export const GET = async (req) => {
  try {
    let page = req.nextUrl.searchParams.get("pageParam");
    const safePage = schema.parse({ page });
    const blogs = await fetchBlogs(safePage, PAGE_SIZE);
    return new Response(JSON.stringify(blogs));
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
