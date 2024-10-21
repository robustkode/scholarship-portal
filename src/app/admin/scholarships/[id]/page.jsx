import { fetchScholarshipUseCase } from "@/use-cases/scholarships";
import { Suspense } from "react";
import ScholarshipForm from "../_components/scholarship-form";
import { notFound } from "next/navigation";
import { assertModerator } from "@/use-cases/authorization";

export default async function EditScholarship({ params }) {
  const { id } = params;
  return (
    <main className="bg-gray-100">
      <Suspense fallback={<div>Loading ...</div>}>
        <ScholarshipFormSuspense id={id} />
      </Suspense>
    </main>
  );
}

async function ScholarshipFormSuspense({ id }) {
  await assertModerator();
  const scholarship = await fetchScholarshipUseCase(id);
  if (!scholarship) notFound();
  return <ScholarshipForm data={scholarship} />;
}
