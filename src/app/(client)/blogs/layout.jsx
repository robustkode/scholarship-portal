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
  return (
    <div className="bg-gray-100">
      <Container as="div" className="grid grid-cols-1 md:grid-cols-4 md:gap-8">
        <div className="md:col-span-3 order-2 md:order-1">{children}</div>
        <div className="bg-primary-lig rounded-sm md:my-8 mt-8 flex justify-center items-center h-32 md:h-auto w-[100%]  order-1 md:order-2">
          Some content
        </div>
      </Container>
    </div>
  );
}
