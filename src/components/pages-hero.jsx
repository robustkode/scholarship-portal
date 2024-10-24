import React from "react";
import Container from "./container";

export default function PagesHero({ header, description }) {
  return (
    <section className="bg-primary text-primary-foreground py-6">
      <Container as="div" className="bg-primary text-primary-foreground py-6">
        <h2 className="font-header font-bold md:text-4xl sm:text-2xl text-xl pb-4">
          {header}
        </h2>
        <h1 className="max-w-[700px]">{description}</h1>
      </Container>
    </section>
  );
}
