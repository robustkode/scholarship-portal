import Container from "@/components/container";
import BlogCard from "./blog-card";
import { fetchBlogs } from "@/data-access/blogs";
import { cache, nCache } from "@/lib/cache";
import Link from "next/link";
import { Suspense } from "react";
import ScholarshipCard from "@/components/scholarship-card";
import { fetchScholarships } from "@/data-access/scholarships";
import { ScholarshipSkeleton } from "@/components/loading/scholarship-skeleton";

const cachedPopulars = cache(
  async () => {
    return await fetchScholarships();
  },
  ["home-populars"],
  { revalidate: 2, tag: ["home-populars"] } //edit this one hour
);

export default async function PopularCountries() {
  return (
    <section className="bg-gray-100 pb-6 ">
      <Container>
        <h3 className="section-header">High paying scholarships</h3>
        <Suspense
          fallback={
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {[...Array(6)].map((_, i) => (
                <ScholarshipSkeleton key={i} className="mb-8" />
              ))}
            </div>
          }
        >
          <CountriesSuspense />
        </Suspense>
      </Container>
    </section>
  );
}

async function CountriesSuspense() {
  const scholarships = await cachedPopulars();
  if (!scholarships) {
    return (
      <div>
        <h4 className="text-center py-2">No scholarships yet!</h4>
      </div>
    );
  }

  return (
    // <div className="flex flex-wrap gap-8 justify-start">
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
      {scholarships.map((b) => (
        <ScholarshipCard {...b} key={b.id} />
      ))}
    </div>
  );
}

// async function PayingsSuspense() {
//   const scholarships = await cachedRecents();
//   // if (!scholarships) {
//   //   return <p>No scholarships yet!</p>;
//   // }
//   return (
//     // <div className="flex flex-wrap gap-8 justify-center">
//     //   {scholarships.map((b) => (
//     //     <div key={b.id} className="min-w-64">
//     //     </div>
//     //   ))}
//     // </div>
//     <p>oops</p>
//   );
// }
