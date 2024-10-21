"use client";
import Container from "@/components/container";
import VideoForm from "../_components/create-video";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import VideoCard from "@/components/video-card";

const fetchVideo = (guideId) => {
  return apiClient.get("/guides/" + guideId);
};

export default function EditGuide({}) {
  const { guideId } = useParams();
  const { page } = useSearchParams();
  const { data, error, isPending } = useQuery({
    queryKey: ["video", guideId],
    queryFn: () => fetchVideo(guideId),
  });

  if (data === "") notFound();
  return (
    <main>
      <div>{JSON.stringify(data)}</div>
      <Container>
        {isPending ? (
          <div>Loading...</div>
        ) : error ? (
          <div>stg went wrong</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            <section>
              <VideoCard {...data} edit={true} />
            </section>
            <VideoForm data={data} page={page} />
          </div>
        )}
      </Container>
    </main>
  );
}
