import Link from "next/link";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";

export default function BlogCard({ title, content, id, page, edit = false }) {
  return (
    <div className="flex flex-col bg-gray-200 border-l-4 border-primary px-6 py-4 shadow-md relative">
      {edit ? (
        <div className="right-4 top-4 absolute bg-secondary rounded-full text-secondary-foreground">
          <Button
            variant="ghost"
            className="p-2 hover:bg-primary-lig rounded-full"
          >
            <Link href={`/admin/blogs/${id}?page=${page}`}>
              <Pencil className="icon-lg" />
            </Link>
          </Button>
        </div>
      ) : (
        ""
      )}

      <Link href={`/blogs/${id}`}>
        <p className="header text-xl py-1">{title}</p>
        <div
          className="line-clamp-2"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        <p className="underline text-secondary pt-2 text-sm">Read more</p>
      </Link>
    </div>
  );
}
