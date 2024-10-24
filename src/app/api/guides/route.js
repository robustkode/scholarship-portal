import { fetchVideos } from "@/data-access/videos";
import { PublicError } from "@/use-cases/errors";
import { useSearchParams } from "next/navigation";
import * as z from "zod";
const schema = z.object({
  page: z.coerce.number(),
});

const PAGE_SIZE = 10;
export const GET = async (req) => {
  try {
    const page = req.nextUrl.searchParams.get("pageParam");
    const safePage = schema.parse({ page });
    const videos = await fetchVideos(safePage, PAGE_SIZE);
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
