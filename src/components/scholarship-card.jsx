import { capitalizeStringArray } from "@/lib/utils";
import { capitalize } from "lodash";
import { Clock } from "lucide-react";
import { MoveRight } from "lucide-react";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Locate } from "lucide-react";
import { Button } from "./ui/button";

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
  const degrees = capitalizeStringArray(degree);
  const countries = capitalizeStringArray(country);
  return (
    // <div className=" basis-64 max-w-96 text-center text-start flex flex-col gap-4 bg-gray-100 rounded-sm shrink grow">
    //   <Link href={`/scholarships/${id}`}>
    //     <div className="bg-primary px-6 py-4 rounded-t-sm">
    //       <p className="text-3xl text-primary-foreground">
    //         {currency}
    //         <span className="font-bold">{tution}</span>
    //       </p>
    //       <p className="text-gray-300">{countries}</p>
    //     </div>
    //     <div className="flex flex-col gap-4 px-6 pb-6 pt-2">
    //       <div className="flex flex-col gap-1">
    //         <h4 className="text-muted">{name}</h4>
    //         <h4 className="font-bold text-lg">{university}</h4>
    //       </div>
    //       <div className="flex flex-col gap-1">
    //         <div className="flex gap-4">
    //           <GraduationCap className="w-[28px] h-[28px] text-primary" />
    //           <span>{degrees ? degrees : "No data"}</span>
    //         </div>
    //         <div className="flex items-center gap-4 ">
    //           <Clock className="icon-lg text-primary" />
    //           <span>{deadline ? deadline : "No data"}</span>
    //         </div>
    //       </div>
    //       <div className="ml-auto">
    //         <Link
    //           href={`/scholarships/${id}`}
    //           className="text-xs text-secondary font-light flex items-center gap-1"
    //         >
    //           Explore <MoveRight className="text-secondary/80 w-4" />
    //         </Link>
    //       </div>
    //     </div>
    //   </Link>
    // </div>
    <Card>
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
                  <h4 className="text-xl header">{deadline}</h4>
                ) : (
                  <p className="text-xl font-bold">Any time</p>
                )}
              </div>
            </div>
            <div className="px-4 py-3 flex flex-col gap-3 pb-6">
              <div>
                <h3 className="font-bold mb-1">{name}</h3>
                <h4>{university}</h4>
              </div>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-light text-muted">
                    Locations
                  </span>
                  <div className="flex gap-2 items-center">
                    <Locate className="icon-lg text-primary" />
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
              <Button variant="link" className="ml-auto">
                <Link
                  href={`/scholarships/${id}`}
                  className="flex items-center gap-1"
                >
                  <span>Read more about eligibility </span>{" "}
                  <MoveRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
