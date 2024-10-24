import {
  createBlog,
  deleteBlog,
  fetchBlog,
  fetchBlogCoverImage,
  fetchBlogs,
  fetchBlogsCard,
  getBlogByTitle,
  updateBlog,
} from "@/data-access/blogs";
import { AuthenticationError, NotFoundError } from "./errors";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/db";
import { blogs, blogTags } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { deleteFileFromBucketT } from "./file";
import { assertModerator, isModerator } from "./authorization";

export async function createBlogUseCase(values) {
  await assertModerator();
  const { tags, ...rest } = values;
  const blog = await getBlogByTitle(values.title);
  if (blog) {
    throw new NotFoundError("A blog with similar title exists.");
  }
  const id = await createBlog(rest);
  let tagsArray;
  try {
    tagsArray = values.tags.split(",");
  } catch (_) {
    tagsArray = [];
  }

  try {
    if (tagsArray.length) {
      const filTags = tagsArray.map((t) => {
        return { tag: t, blogId: id };
      });
      await db.insert(blogTags).values([...filTags]);
    }
  } catch (error) {
    console.log(error);
  }
  return id;
}

export async function fetchBlogUseCase(id) {
  return await fetchBlog(id);
}

export async function updateBlogUseCase(id, values) {
  await assertModerator();
  //since check in fetchBlofCoverImageusecase and not used this in other place wwe can skip
  const { tags, rTags, ...rest } = values;
  await updateBlog(id, rest);

  try {
    //insert
    if (tags.length) {
      const filTags = tags.map((t) => {
        return { tag: t, blogId: id };
      });
      //! add ononconflict sch.id and tags.tag
      await db.insert(blogTags).values([...filTags]);
    }

    //remove
    if (rTags.length) {
      await db
        .delete(blogTags)
        .where(
          or(
            ...rTags.map((t) =>
              and(eq(blogTags.tag, t), eq(blogTags.blogId, id))
            )
          )
        );
    }
  } catch (error) {
    console.log(error);
  }
}

export async function fetchBlogsUseCase() {
  const blogs = await fetchBlogs();
  return blogs;
}

export async function fetchBlogCoverImageUseCase() {
  const blogs = await fetchBlogCoverImage();
  return blogs;
}

export async function deleteBlogUseCase(id) {
  await assertModerator();
  const blog = await fetchBlog(id);
  if (!blog) throw new NotFoundError();

  //! if its failed store it in a database
  if (blog.coverImage) {
    try {
      await deleteFileFromBucketT(blog.coverImage);
    } catch (_) {}
  }
  await deleteBlog(id);
}

export async function fetchBlogsCardUseCase() {
  const blogs = await fetchBlogsCard();
  return blogs;
}
