import { PublicError } from "@/use-cases/errors";
import { fetchStatUseCase } from "@/use-cases/stat";

export const GET = async (req) => {
  try {
    const stat = await fetchStatUseCase();
    return new Response(JSON.stringify(stat));
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
