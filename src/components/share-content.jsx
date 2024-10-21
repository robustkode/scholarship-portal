import { Facebook } from "lucide-react";
import Link from "next/link";
import Container from "./container";
import { Twitter } from "lucide-react";
import { Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShareContent({ label, link }) {
  return (
    <div className="border-t  border-primary-lig py-4 mt-4">
      <p className={cn("hader text-lg pb-2", "text-primary")}>
        Share this {label}
      </p>
      <div className="flex gap-6">
        <div>
          <Link href={"https://facebook.com?share=" + link}>
            <Facebook className="icon-lg text-primary" />
          </Link>
        </div>
        <div>
          <Link href={"https://facebook.com" + link}>
            <Twitter className="icon-lg text-primary" />
          </Link>
        </div>
        <div>
          <Link href={"https://facebook.com" + link}>
            <Instagram className="icon-lg text-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
}
