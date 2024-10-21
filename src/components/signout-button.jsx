import Link from "next/link";
import { Button } from "./ui/button";

export function SignOutButton() {
  return (
    <Button variant={"link"} asChild>
      <Link href={"/api/sign-out"}>Sign out</Link>
    </Button>
  );
}
