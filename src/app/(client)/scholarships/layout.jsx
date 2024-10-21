import Container from "@/components/container";
import FilterContextProvider from "./_context";
import { SCHOLARSHIP_OPENGRAPH_IMAGE_URL, SITE_NAME } from "@/config";

export const metadata = {
  description: "Filter scholarships based on your need.",
  title: "Scholarships",
  keywords: ["scholarships", "ethiopia", "students", "blog"],

  openGraph: {
    images: [
      {
        url: SCHOLARSHIP_OPENGRAPH_IMAGE_URL,
        width: 1200,
        height: 680,
        alt: `${SITE_NAME} scholarships`,
      },
    ],
  },
};

export default function ScholarshipLayout({ children }) {
  return <FilterContextProvider>{children}</FilterContextProvider>;
}
