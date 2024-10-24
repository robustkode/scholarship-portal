"use client";

import Container from "@/components/container";
import { Settings } from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useState } from "react";
import Filter from "./_components/scholarships-filter";

import { country, scholarships } from "@/db/schema";
import { useDebouncedVal } from "@/hooks/use-debounded";
import { useSearchParams } from "next/navigation";
import { useEffect, useReducer } from "react";
import ScholarshipCard from "@/components/scholarship-card";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { useFilterContext } from "./_context";
import GroupPagination from "@/components/group-pagination";
import { ScholarshipSkeleton } from "@/components/loading/scholarship-skeleton";
import ErrorMessage from "@/components/error-message";
import PagesHero from "@/components/pages-hero";

const HERO = {
  header: "Find your ideal scholarships",
  description:
    " You can easily filter scholarships by country and education level to find the perfect opportunities tailored to your needs.",
};

const fetchFilteredScholarships = async (filters) => {
  return apiClient.post("/scholarships", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: filters,
  });
};

export default function Scholarships() {
  const { filter } = useFilterContext();
  const dval = useDebouncedVal(filter);

  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["scholarships", dval],
    queryFn: () => fetchFilteredScholarships(dval),
    placeholderData: keepPreviousData,
    //! change this
    staleTime: 60 * 60 * 60,
  });

  const totalCount = data ? data.totalCount : 0;

  useEffect(() => {
    // To avoid editing the URL while mounting
    if (dval) {
      const degreesQueryParams = new URLSearchParams();
      filter.degree.forEach((d) => {
        degreesQueryParams.append("degrees", d.value);
      });

      const countriesQueryParams = new URLSearchParams();
      filter.country.forEach((c) => {
        countriesQueryParams.append("countries", c.value);
      });

      let queryString = "";

      if (degreesQueryParams.toString()) {
        queryString += `?${degreesQueryParams}`;
      }

      if (countriesQueryParams.toString()) {
        queryString += (queryString ? "&" : "?") + countriesQueryParams;
      }

      queryString +=
        (queryString ? "&" : "?") + `sort=${filter.sort}&page=${filter.page}`;

      window.history.replaceState({}, "", queryString);
    }
  }, [dval]);

  return (
    <main className="mb-16">
      <PagesHero header={HERO.header} description={HERO.description} />
      <Container as="div" className="py-12">
        <div className="grid md:grid-cols-3 gap-4 w-full">
          <Filter />
          <div className="md:col-span-2 pb-16 bg-gray-100/40 rounded-sm">
            {data && data.scholarships?.length < totalCount ? (
              <div className="py-4">
                <GroupPagination totalPages={Math.ceil(totalCount / 3)} />
              </div>
            ) : (
              ""
            )}

            {isPending ? (
              <Container className="mt-8 flex flex-wrap gap-8 p-8">
                {[...Array(6)].map((_, i) => (
                  <ScholarshipSkeleton key={i} className="mb-8" />
                ))}
              </Container>
            ) : isError ? (
              <ErrorMessage message={error.message} retry={refetch} />
            ) : !data?.scholarships || !data.scholarships.length ? (
              <div className="flex flex-col  items-center bg-gray-200 mt-8 rounded-md py-6 gap-2 mx-6">
                <h3 className="font-bold text-2xl w-fit">No results found.</h3>
                <p>Try other filters</p>
              </div>
            ) : (
              <div className="px-6 py-12">
                <p className="section-header">{data.totalCount} scholarships</p>
                <div className="flex flex-wrap gap-6">
                  {data?.scholarships.map((sch) => (
                    <ScholarshipCard key={sch.id} {...sch} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
