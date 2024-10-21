import { DEFAULT_OPENGRAPH_IMAGE_URL, SITE_NAME } from "@/config";

export const metadata = {
  description: "Video guides tohelp tou find and apply to scholarships.",
  title: "Guiding videos",
  keywords: ["scholarships", "ethiopia", "students", "videos", "guides"],

  openGraph: {
    images: [
      {
        url: DEFAULT_OPENGRAPH_IMAGE_URL,
        width: 1200,
        height: 680,
        alt: `${SITE_NAME} scholarships`,
      },
    ],
  },
};

export default function GuideLayout({ children }) {
  return <>{children}</>;
}
