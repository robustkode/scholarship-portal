import Container from "@/components/container";
import ShareContent from "@/components/share-content";
import { Button } from "@/components/ui/button";
import { getLabel, isValidURL } from "@/lib/utils";
import { fetchScholarshipUseCase } from "@/use-cases/scholarships";
import { format } from "date-fns";
import { Globe } from "lucide-react";
import { Sprout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "../_components/loading";
import { cache } from "@/lib/cache";
import _ from "lodash";
import { COUNTRIES, DEGREES } from "@/config";
export const dynamic = "force-static";

const cachedScholarship = cache(async (params) => {
  return fetchScholarshipUseCase(params.id);
}, []);

export async function generateMetadata({ params }) {
  const blog = await cachedScholarship(params);
  if (!blog) notFound();
  const tags = blog.tags?.split(",") || [];

  const openGraph = blog.coverImage
    ? {
        images: [
          {
            url: blog.coverImage,
            width: 1200,
            height: 680,
            alt: blog.name + "picture",
          },
        ],
      }
    : {};

  return {
    title: blog.title,
    description: blog.title,
    keywords: ["scholarships", "ethiopia", "students", ...tags],
    ...openGraph,
  };
}

export default async function Scholarship({ params }) {
  return (
    <main>
      <div className="lg:col-span-4">
        <Suspense fallback={<Loading />}>
          <ScholarshipSusPense params={params} />
        </Suspense>
      </div>
    </main>
  );
}

async function ScholarshipSusPense({ params }) {
  const scholarship = await cachedScholarship(params);
  if (!scholarship) notFound();
  const { about, content, applyLink, currency, countries, degrees } =
    scholarship;
  const countriesName = getLabel(countries, COUNTRIES);

  return (
    <>
      <div className="bg-primary-lig py-8">
        <Container
          as="div"
          className="flex sm:justify-between flex-wrap gap-12"
        >
          <div className="flex flex-col justify-center">
            <h2 className="text-lg">{scholarship.university}</h2>
            <h1 className="text-3xl font-bold text-header">
              {scholarship.name}
            </h1>
            {applyLink ? (
              <Button className="mt-4 w-fit" variant={"secondary"}>
                <Link href={""}>Apply</Link>
              </Button>
            ) : (
              ""
            )}
          </div>
          <div className="bg-white w-80 flex flex-col gap-4 rounded-sm px-4 py-4 ">
            <div className="flex items-center gap-8 border-b w-full pb-2">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary-lig rounded-full">
                <Sprout className="icon-lg text-primary" />
              </div>

              <div className="flex flex-col">
                <p className="text-primary-dark text-bold text-xl">
                  {`${currency ? currency : "$"}${scholarship.tution}` ||
                    "No data"}
                </p>
                <p className="text-muted text-small">Grant</p>
              </div>
            </div>
            <div className="flex items-center gap-8 border-b w-full pb-2">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary-lig rounded-full">
                <Globe className="icon-lg text-primary" />
              </div>

              <div className="flex flex-col">
                <p className="text-primary-dark text-bold text-xl">
                  {countriesName || "Multiple countries"}
                </p>
                <p className="text-muted text-small">Country</p>
              </div>
            </div>
            <div className="flex items-center gap-8  w-full pb-2">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary-lig rounded-full">
                <Sprout className="icon-lg text-primary" />
              </div>

              <div className="flex flex-col">
                <p className="text-primary-dark text-bold text-xl">
                  {format(scholarship.deadline, "PPP") || "Not specified"}
                </p>
                <p className="text-muted text-small">Deadline</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container as="div" className={"grid lg:grid-cols-5 gap-8"}>
        <section className="flex flex-col py-12 lg:col-span-4">
          <div className="mb-2">{about}</div>
          <div className="">
            <div
              className="prose prose-lg"
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          </div>
        </section>
        <aside className="bg-primary-lig rounded-sm lg:my-8 mt-8 flex justify-center items-center h-32 lg:h-auto w-[100%]  order-1 md:order-2 mb-12">
          Ad
        </aside>
      </Container>

      <Container className={"pb-12"}>
        <ShareContent label={"scholarship"} />
      </Container>
    </>
  );
}
