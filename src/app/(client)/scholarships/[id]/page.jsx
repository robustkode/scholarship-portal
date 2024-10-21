import Container from "@/components/container";
import ShareContent from "@/components/share-content";
import { Button } from "@/components/ui/button";
import { isValidURL } from "@/lib/utils";
import { fetchScholarshipUseCase } from "@/use-cases/scholarships";
import { format } from "date-fns";
import { Globe } from "lucide-react";
import { Sprout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";
import { cache } from "@/lib/cache";

export const dynamic = "force-static";
//! how to add tag  here
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
  //! use safe params
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <ScholarshipSusPense params={params} />
      </Suspense>
    </main>
  );
}

const isEmpty = (field) => {
  if (!field) return true;
  const regex = /<\w+>(.+?)<\/\w+>/;
  const match = field.match(regex);
  if (!match) return true;
  return false;
};
async function ScholarshipSusPense({ params }) {
  const scholarship = await cachedScholarship(params);
  if (!scholarship) notFound();
  const {
    about,
    benefits,
    eligibility,
    documents,
    howApply,
    otherFields,
    applyLink,
    currency,
    coverImage,
  } = scholarship;
  const dangerousContents = [
    { label: "About", value: about },
    { label: "Benefits", value: benefits },
    { label: "Eligibility", value: eligibility },
    { label: "Documents", value: documents },
    { label: "How to apply", value: howApply },
    { label: "", value: otherFields },
  ];

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
            <Button className="mt-4 w-fit" variant={"secondary"}>
              <Link href={applyLink}>Apply</Link>
            </Button>
          </div>
          <div className="bg-white w-80 flex flex-col gap-4 rounded-sm px-4 py-4 ">
            <div className="flex items-center gap-8 border-b w-full pb-2">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary-lig rounded-full">
                <Sprout className="icon-lg text-primary" />
              </div>

              <div className="flex flex-col">
                <p className="text-primary-dark text-bold text-xl">
                  {`${currency}${scholarship.tution}` || "No data"}
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
                  {scholarship.country || "No data"}
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
      <section>
        <Container as="div" className="flex flex-col">
          {coverImage && isValidURL(coverImage) ? (
            <Image
              src={coverImage}
              height={100}
              width={100}
              alt="scholarship coverimage"
            />
          ) : (
            ""
          )}

          <div className="flex flex-col">
            {dangerousContents.map((content, i) =>
              !isEmpty(content.value) ? (
                <div className="" key={i}>
                  <h3 className="section-header text-primary">
                    {content.label}
                  </h3>
                  <div
                    className="prose prose-lg"
                    dangerouslySetInnerHTML={{ __html: content.value }}
                  ></div>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </Container>
      </section>
      <ShareContent label={"scholarship"} />
    </>
  );
}
