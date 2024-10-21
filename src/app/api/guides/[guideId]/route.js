import { fetchVideo } from "@/data-access/videos";
import { PublicError } from "@/use-cases/errors";

export const GET = async (req, { params }) => {
  try {
    const { guideId } = params;
    const video = await fetchVideo(guideId);
    return new Response(JSON.stringify(video));
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
