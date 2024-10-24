"use client";
import Link from "next/link";
import Container from "./container";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminNavbar({ params }) {
  const pathname = usePathname();
  let activeRoute = pathname.split("/")[2];

  return (
    <nav className="bg-primary-lig py-4 mb-4">
      <Container as="div">
        <ul className="flex flex-wrap items-center justify-center gap-6 text-primary-drk">
          <li
            className={cn({
              "text-primary border-b-2": activeRoute === "",
            })}
          >
            <Link href={"/admin"}>Stat</Link>
          </li>
          <li
            className={cn({
              "text-primary border-b-2": activeRoute === "scholarships",
            })}
          >
            <Link href={"/admin/scholarships"}>Scholarships</Link>
          </li>

          <li
            className={cn({
              "text-primary border-b-2": activeRoute === "blogs",
            })}
          >
            <Link href={"/admin/blogs"}>Blogs</Link>
          </li>

          <li
            className={cn({
              "text-primary border-b-2": activeRoute === "moderators",
            })}
          >
            <Link href={"/admin/moderators"}>Moderators</Link>
          </li>
          <li
            className={cn({
              "text-primary border-b-2": activeRoute === "guides",
            })}
          >
            <Link href={"/admin/guides"}>Guides</Link>
          </li>
          <li
            className={cn({
              "text-primary border-b-2": activeRoute === "populars",
            })}
          >
            <Link href={"/admin/populars"}>Populars</Link>
          </li>
        </ul>
      </Container>
    </nav>
  );
}
