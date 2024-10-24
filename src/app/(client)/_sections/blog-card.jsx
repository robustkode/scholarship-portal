import { capitalizeStringArray } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function BlogCard({
  id,
  title,
  tags,
  content,
  coverImage,
}) {
  const tagsList = capitalizeStringArray(tags, ",", true) || [];
  return (
    <div className="bg-gray-100 px-6 py-6 rounded-sm shadow-sm">
      <Link href={"/blogs/" + id}>
        <div>
          <h4 className="text-xl pb-2 text-header font-bold">{title}</h4>
          <div className="flex gap-4 flex-wrap">
            {tagsList.map((t, i) => (
              <div key={i} className="px-2  bg-primary-lig rounded-sm">
                <p className="">t</p>
              </div>
            ))}
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="line-clamp-3"
          ></div>
          <p className="text-primary mt-1 text-sm">Read more</p>
        </div>
      </Link>
    </div>
  );
}
