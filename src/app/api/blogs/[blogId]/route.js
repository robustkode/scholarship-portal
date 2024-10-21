import { fetchBlog } from "@/data-access/blogs";
import { PublicError } from "@/use-cases/errors";

export const GET = async (req, { params }) => {
  try {
    const id = params.blogId;
    const blog = await fetchBlog(id);
    return new Response(JSON.stringify(blog));
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
