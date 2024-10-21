import { Youtube } from "lucide-react";
import Container from "./container";
import { Twitter } from "lucide-react";
import { Instagram } from "lucide-react";
import { Button } from "./ui/button";

export default async function Footer() {
  return (
    <footer className="bg-primary-drk text-primary-foreground">
      <Container as="div">
        <div className="grid sm:grid-cols-4 sm:justify-items-center items-center py-4 gap-y-2">
          <h1 className="text-lg font-bold font-oswald whitespace-nowrap">
            Hermy-Academy
          </h1>
          <div>
            <div className="flex gap-2 items-center">
              <Button as="div" variant="link" className="px-1">
                <Youtube className="w-[30px] h-[30px] text-primary-lig cursor-pointer hover:text-primary" />
              </Button>
              <Button as="div" variant="link" className="px-1">
                <Twitter className="icon-lg text-primary-lig cursor-pointer hover:text-primary" />
              </Button>
              <Button as="div" variant="link" className="px-1">
                <Instagram className="icon-lg text-primary-lig cursor-pointer hover:text-primary" />
              </Button>
            </div>
          </div>
          <p className="text-muted sm:col-span-2">
            &copy;copyright Hermy-Academy 2024
          </p>
        </div>
      </Container>
    </footer>
  );
}
