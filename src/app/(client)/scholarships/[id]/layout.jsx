import Container from "@/components/container";
import { applicationName, BASE_URL, SITE_NAME } from "@/config";

export const metadata = {
  openGraph: {
    type: "website",
  },
};

export default function ScholarshipLayout({ children }) {
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
