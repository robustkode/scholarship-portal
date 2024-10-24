import Container from "@/components/container";
import VideoCard from "@/components/video-card";
import { fetchVideos } from "@/data-access/videos";
import { cache } from "@/lib/cache";
import { Suspense } from "react";

const cachedGuides = cache(
  async () => {
    return await fetchVideos(1, 6);
  },
  ["home-guides"],
  { revalidate: 3600, tag: ["home-guides"] }
);

export default async function Guides() {
  return (
    <Container className={"py-8"}>
      <h3 className="section-header">Guiding Videos</h3>
      <Suspense fallback={<div>Loading...</div>}>
        <GuidesSuspense />
      </Suspense>
    </Container>
  );
}

async function GuidesSuspense() {
  const videos = await cachedGuides();

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:grid-cols-3">
      {videos.data?.map((d) => (
        <div key={d.id}>
          <VideoCard {...d} />
        </div>
      ))}
    </div>
  );
}
