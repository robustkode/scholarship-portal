import Container from "@/components/container";
import { ScholarshipSkeleton } from "@/components/loading/scholarship-skeleton";
import ScholarshipCard from "@/components/scholarship-card";
import VideoCard from "@/components/video-card";
import { fetchScholarships } from "@/data-access/scholarships";
import { fetchVideos } from "@/data-access/videos";
import { cache } from "@/lib/cache";
import { Suspense } from "react";

const cachedRecents = cache(
  async () => {
    return await fetchScholarships();
  },
  ["home-recent-scholarships"],
  { revalidate: 2, tag: ["home-recent-scholarships", "scholarships"] } //edit this one hour
);

export default async function Recents() {
  return (
    <Container className={"my-12"}>
      <h3 className="section-header">Recent scholarships</h3>
      <Suspense
        fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {[...Array(6)].map((_, i) => (
              <ScholarshipSkeleton key={i} className="mb-8" />
            ))}
          </div>
        }
      >
        <RecentsSuspense />
      </Suspense>
    </Container>
  );
}

async function RecentsSuspense() {
  const scholarships = await cachedRecents();
  if (!scholarships) {
    return <p>No scholarships yet!</p>;
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
      {scholarships.map((b) => (
        <ScholarshipCard {...b} key={b.id} />
      ))}
    </div>
  );
}
