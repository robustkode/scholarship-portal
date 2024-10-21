"use client";
import Link from "next/link";
import Container from "./container";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AlignLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Youtube } from "lucide-react";

export default function Navbar() {
  const [toggleNav, setToggleNav] = useState(false);
  const pathname = usePathname();
  let activeRoute = pathname.split("/")[1];

  useEffect(() => {
    document.addEventListener("mousedown", handClickOutside);
    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, []);

  const handClickOutside = (event) => {
    if (!event.target.closest(".small-nav-link")) {
      setToggleNav(false);
    }
  };

  const handleToggleNav = (event) => {
    setToggleNav(!toggleNav);
    event.stopPropagation();
  };

  return (
    <header>
      <Container as="div" className="py-4">
        <div className="flex w-full items-center">
          {!toggleNav ? (
            <AlignLeft
              className="sm:hidden mr-2"
              onClick={(event) => handleToggleNav(event)}
            />
          ) : (
            <X
              className="icon-lg mr-2 sm:hidden"
              onClick={(event) => handleToggleNav(event)}
            />
          )}
          <Link href="/" className="sm:pr-16 pr-2 flex items-center">
            <h1 className="sm:text-2xl text-lg header whitespace-nowrap">
              Hermy-Academy
            </h1>
          </Link>

          <Button className="ml-auto sm:hidden text-red-500 bg-primary-lig/60 px-4 rounded-md py-0">
            <Link href={"/guides"}>
              <Youtube className="icon-lg" />
            </Link>
          </Button>

          <nav className="w-full hidden sm:block pt-2">
            <ul className="flex gap-8 items-center  h-8 small-nav-link">
              <li
                className={cn(
                  {
                    "text-primary border-b-2 border-primary":
                      activeRoute === "",
                  },
                  "h-8 w-fit"
                )}
              >
                <Link href="/">Home</Link>
              </li>
              <li
                className={cn(
                  {
                    "text-primary border-b-2 border-primary":
                      activeRoute === "scholarships",
                  },
                  "h-8 w-fit"
                )}
              >
                <Link href="/scholarships">Scholarships</Link>
              </li>
              <li
                className={cn(
                  {
                    "text-primary border-b-2 border-primary":
                      activeRoute === "blogs",
                  },
                  "h-8 w-fit"
                )}
              >
                <Link href="/blogs">Blog</Link>
              </li>

              <li className="ml-auto sm:block hidden">
                <Button variant="outline">
                  <Link href="/guides">Guides</Link>
                </Button>
              </li>
            </ul>
          </nav>
          {toggleNav && (
            <nav
              className="md:hidden absolute top-16 left-0 bg-gray-900/80 h-[100vh] w-[100vw]"
              onClick={() => setToggleNav(false)}
            >
              <ul className="flex flex-col  gap-2 h-8 bg-background pl-5 pt-4  h-[100vh] w-48 border-t-2 border-primary ">
                <li
                  className={cn(
                    {
                      "text-primary": activeRoute === "",
                    },
                    "h-8 w-fit small-nav-link"
                  )}
                >
                  <Link href="/" className="small-nav-link">
                    Home
                  </Link>
                </li>
                <li
                  className={cn(
                    {
                      "text-primary": activeRoute === "scholarships",
                    },
                    "h-8 w-fit"
                  )}
                >
                  <Link href="/scholarships" className="small-nav-link">
                    Scholarships
                  </Link>
                </li>
                <li
                  className={cn(
                    {
                      "text-primary": activeRoute === "blogs",
                    },
                    "h-8 w-fit"
                  )}
                >
                  <Link href="/blogs" className="small-nav-link">
                    Blog
                  </Link>
                </li>

                <li>
                  <Button variant="outline" className="small-nav-link">
                    <Link href="/guides">Guides</Link>
                  </Button>
                </li>
              </ul>
              <ul></ul>
            </nav>
          )}
        </div>
      </Container>
    </header>
  );
}
