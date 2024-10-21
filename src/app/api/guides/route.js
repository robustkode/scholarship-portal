import { fetchVideos } from "@/data-access/videos";
import { PublicError } from "@/use-cases/errors";
import { useSearchParams } from "next/navigation";

const PAGE_SIZE = 10;
export const GET = async (req) => {
  try {
    //! sanitize page
    const page = req.nextUrl.searchParams.get("pageParam");
    const videos = await fetchVideos(page, PAGE_SIZE);
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
