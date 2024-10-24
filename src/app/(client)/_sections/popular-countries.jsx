import Container from "@/components/container";
import { Skeleton } from "@/components/ui/skeleton";
import { COUNTRIES } from "@/config";
import { fetchPopulars } from "@/data-access/countries";
import { cache } from "@/lib/cache";
import { capitalize } from "lodash";
import Link from "next/link";
import { Suspense } from "react";

const CachedPopulars = cache(
  async () => {
    return await fetchPopulars(6);
  },
  ["home-popular-scholarships"],
  { revalidate: 60 * 60, tags: ["home-popular-scholarships"] }
);

const getLabel = (name) => {
  const n = COUNTRIES.find((c) => c.value === name);
  return n ? n.label : name;
};

export default async function PopularCountries() {
  return (
    <section className="bg-primary-lig">
      <Container className={"py-12"}>
        <h3 className="section-header">Popular Countries</h3>

        <Suspense
          fallback={
            <div className="flex flex-wrap gap-8 mt-12">
              {[...Array(8)].map((_, i) => (
                <div className=" basis-48 shrink grow " key={i}>
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          }
        >
          <PopularCountriesSuspense />
        </Suspense>
      </Container>
    </section>
  );
}

async function PopularCountriesSuspense() {
  const countries = await CachedPopulars();

  if (!countries) {
    return (
      <div>
        <h4 className="text-center py-2">No popular countries yet</h4>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-8">
      {countries.map((c, i) => (
        <Link href={"/scholarships?countries=" + c} key={i}>
          <div className="px-8 py-4 shadow-md bg-gray-100/70 text-primary-drk hover:underline border-l-4 border-secondary">
            <h4>{getLabel(c.country)}</h4>
          </div>
        </Link>
      ))}
    </div>
  );
}
