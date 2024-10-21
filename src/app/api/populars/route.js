import { fetchPopulars } from "@/data-access/countries";
import { PublicError } from "@/use-cases/errors";

export const GET = async () => {
  try {
    //! sanitize page
    const populars = await fetchPopulars();
    return new Response(JSON.stringify(populars));
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
