import { MetadataRoute } from "next";
import { BASE_URL } from "./config";

export default async function sitemap() {
  //   let allBlogs, allScholarships;
  const allBlogs = await getBlogsMeta();
  const allScholarships = await getScholarshipsMeta();
  const allGuides = await getGuidesMeta();
  try {
    await Promise.all([allBlogs, allScholarships, allGuides]);
  } catch (e) {
    throw new Error("Error encountered generating sitemap" + e.message);
  }

  const home = {
    url: BASE_URL,
    lastModified: new Date().toString(),
  };

  //blogs page
  const blogsPage = {
    url: `${BASE_URL}/blogs`,
    lastModified: new Date().toString(),
  };

  //scholarships page
  const scholarshippage = {
    url: `${BASE_URL}/scholarships`,
    lastModified: new Date().toString(),
  };

  //blogs
  const blogs = allBlogs.map((blog) => ({
    url: `${BASE_URL}/blogs/${blog.id}/`,
    lastModified: blog.createdAt,
  }));

  //scholarships
  const scholarships = allScholarships.map((scholarship) => ({
    url: `${BASE_URL}/scholarships/${scholarship.id}`,
    lastModified: scholarship.createdAt,
  }));

  //guides
  const guides = allGuides.map((guides) => ({
    url: `${BASE_URL}/guides/${guides.id}`,
    lastModified: guides.createdAt,
  }));

  return [home, ...blogs, ...scholarships];
}
