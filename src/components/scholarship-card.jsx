import { capitalizeStringArray, getLabel } from "@/lib/utils";
import { capitalize } from "lodash";
import { Clock } from "lucide-react";
import { MoveRight } from "lucide-react";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { COUNTRIES, DEGREES } from "@/config";
import { useMemo } from "react";

//! change the design
export default function ScholarshipCard({
  tution,
  country,
  name,
  university,
  degree,
  deadline,
  id,
  currency,
}) {
  const degrees = useMemo(() => {
    try {
      const degreesList = degree.split(",");
      if (degreesList.length === 4) {
        return "All degrees, Others";
      } else if (degreesList.lenght === 3 && !degreesList.includes("ot")) {
        return "All degrees";
      }
      return getLabel(degree, DEGREES);
    } catch (_) {
      return degree;
    }
  }, [degree]);
  const countries = useMemo(() => {
    return getLabel(country, COUNTRIES);
  }, [country]);
  return (
    <Card className={""}>
      <CardContent className="p-0">
        <Link href={"/scholarships/" + id}>
          <div className="flex flex-col text-foreground">
            <div className="flex justify-between bg-primary py-3 px-4 rounded-t-md text-primary-foreground">
              <div className="flex flex-col">
                <span className="text-sm font-thin text-primary-lig">
                  Grant
                </span>
                {tution > 0 ? (
                  <h4 className="text-xl">
                    {currency}{" "}
                    <span className="text-primary-foreground font-bold">
                      {tution}
                    </span>
                  </h4>
                ) : (
                  <p className="text-xl header">Various benefits</p>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-thin text-primary-lig">
                  Deadline
                </span>
                {deadline ? (
                  <h4 className="text-xl text-primary-foreground font-bold">
                    {format(deadline, "PP")}
                  </h4>
                ) : (
                  <p className="text-xl text-primary-foreground font-boldfont-bold">
                    Any time
                  </p>
                )}
              </div>
            </div>
            <div className="px-4 py-3 flex flex-col gap-3 pb-6">
              <div>
                <h3 className="font-bold mb-1">{name}</h3>
                <h4>{university}</h4>
              </div>
              <div className="flex justify-between flex-wrap gap-x-4 gap-y-3">
                <div className="flex flex-col">
                  <span className="text-sm font-light text-muted">
                    Locations
                  </span>
                  <div className="flex gap-2 items-center">
                    <MapPin className="icon-lg text-primary" />
                    {countries ? (
                      <span>{countries}</span>
                    ) : (
                      <span>Multiple locations</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-light text-muted">Levels</span>
                  <div className="flex gap-2 items-center">
                    <GraduationCap className="icon-lg text-primary" />
                    {countries ? (
                      <span>{degrees}</span>
                    ) : (
                      <span>All levels</span>
                    )}
                  </div>
                </div>
              </div>
              <div className=" flex gap-2 text-primary border-b-[1px] border-primary/50 text-sm items-center ml-auto">
                <span>Read more about eligibility </span>{" "}
                <MoveRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
