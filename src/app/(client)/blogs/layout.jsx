import Container from "@/components/container";
import {
  applicationName,
  BASE_URL,
  BLOG_OPENGRAPH_IMAGE_URL,
  SITE_NAME,
} from "@/config";

export const metadata = {
  description:
    "Explore valuable articles on finding scholarships and achieving academic success for Ethiopian students to enhance their educational journey.",
  title: "Blog",
  keywords: ["scholarships", "ethiopia", "students", "blog"],

  openGraph: {
    images: [
      {
        url: BLOG_OPENGRAPH_IMAGE_URL,
        width: 1200,
        height: 680,
        alt: `${SITE_NAME} blogs`,
      },
    ],
  },
};

export default function BlogLayout({ children }) {
  return <> {children};</>;
}
