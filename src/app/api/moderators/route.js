import { PublicError } from "@/use-cases/errors";
import { fetchModeratorsUseCase } from "@/use-cases/users";

export const GET = async (req) => {
  try {
    const moderators = await fetchModeratorsUseCase();
    return new Response(JSON.stringify(moderators));
  } catch (error) {
    console.log(error, "error");
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
