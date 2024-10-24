import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NavigationCard({ id }) {
  return (
    <div className="flex gap-1 text-muted">
      <Link href={"/"} className="hover:text-primary">
        Home
      </Link>
      <ChevronRight />
      <Link href={"/blogs"} className="hover:text-primary text-muted">
        Blog
      </Link>
      <ChevronRight />
      <span className="text-foreground">{id}</span>
    </div>
  );
}
