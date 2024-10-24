import { capitalizeStringArray, isValidURL } from "@/lib/utils";

export default function VideoCard({ title, link, tag }) {
  const tagsList = capitalizeStringArray(tag, ",", true);
  return (
    <div>
      {isValidURL(link) ? (
        <iframe
          src={link}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="rounded-sm aspect-video w-full"
        ></iframe>
      ) : (
        ""
      )}

      <h3 className="text-xl header py-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tagsList?.map((t, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-primary-lig rounded-sm text-black text-sm"
          >
            {t}
          </span>
        ))}
      </div>
      {/* {!edit ? (
        <div className="flex justify-end gap-8 w-full pt-4">
          <VideoDeleteButton
            variant="link"
            tobedeltedId={{ id: id }}
            page={page}
          >
            Delete
          </VideoDeleteButton>
          <LoaderButton variant="outline">
            <Link href={`guides/${id}?page=${page}`}>Edit</Link>
          </LoaderButton>
        </div>
      ) : (
        ""
      )} */}
    </div>
  );
}
