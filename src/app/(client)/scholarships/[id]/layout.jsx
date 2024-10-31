import Container from "@/components/container";
import { applicationName, BASE_URL, SITE_NAME } from "@/config";

export const metadata = {
  openGraph: {
    type: "website",
  },
};

export default function ScholarshipLayout({ children }) {
  return <>{children}</>;
}
