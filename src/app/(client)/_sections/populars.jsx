import Container from "@/components/container";
import { cache } from "@/lib/cache";

import { Suspense } from "react";
import ScholarshipCard from "@/components/scholarship-card";
import { fetchScholarships } from "@/data-access/scholarships";
import { ScholarshipSkeleton } from "@/components/loading/scholarship-skeleton";

const cachedPopulars = cache(
  async () => {
    return await fetchScholarships();
  },
  ["home-populars"],
  { revalidate: 60 * 60, tag: ["home-populars"] } //edit this one hour
);

export default async function PopularScholarships() {
  return (
    <section className="bg-gray-100  py-12 ">
      <Container className="py-12">
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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
      {scholarships.map((b) => (
        <ScholarshipCard {...b} key={b.id} />
      ))}
    </div>
  );
}
