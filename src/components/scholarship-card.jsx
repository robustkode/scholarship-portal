import { capitalizeStringArray } from "@/lib/utils";
import { capitalize } from "lodash";
import { Clock } from "lucide-react";
import { MoveRight } from "lucide-react";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function ScholarshipCard({
  tution,
  country,
  name,
  university,
  degree,
  deadline,
  id,
}) {
  const degrees = capitalizeStringArray(degree);
  const countries = capitalizeStringArray(country);
  return (
    <div className=" basis-64 max-w-96 text-center text-start flex flex-col gap-4 bg-gray-100 rounded-sm shadow-md shrink grow">
      <Link href={`/scholarships/${id}`}>
        <div className="bg-primary px-6 py-4 rounded-t-sm">
          <p className="text-3xl text-primary-foreground">${tution}</p>
          <p className="text-gray-300">{countries}</p>
        </div>
        <div className="flex flex-col gap-4 px-6 pb-6 pt-2">
          <div className="flex flex-col gap-1">
            <h4 className="text-muted">{name}</h4>
            <h4 className="font-bold text-lg">{university}</h4>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-4">
              <GraduationCap className="w-[28px] h-[28px] text-primary" />
              <span>{degrees ? degrees : "No data"}</span>
            </div>
            <div className="flex items-center gap-4 ">
              <Clock className="icon-lg text-primary" />
              <span>{deadline ? deadline : "No data"}</span>
            </div>
          </div>
          <div className="ml-auto">
            <Link
              href={`/scholarships/${id}`}
              className="text-xs text-secondary font-light flex items-center gap-1"
            >
              Explore <MoveRight className="text-secondary/80 w-4" />
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
}
