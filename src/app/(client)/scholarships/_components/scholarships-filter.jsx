"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { COUNTRIES, DEGREES } from "@/config";
import { country } from "@/db/schema";
import { useDebouncedVal } from "@/hooks/use-debounded";
import { useSearchParams } from "next/navigation";
import { memo, useEffect, useReducer, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { CountrySelector } from "../country-selector";
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { MinusIcon } from "lucide-react";
import { FilterIcon } from "lucide-react";
import { useFilterContext } from "../_context";

// const DEGREES = ["bachelor", "masters", "phd", "others"];

const SORT_OPTIONS = {
  id: "sort",
  options: [
    { name: "Tution: Low to High", value: "asc" },
    { name: "Tution: High to Low", value: "desc" },
  ],
};

const DEGREE_FILTERS = {
  id: "degree",
  options: [
    { value: "bachelor", label: "Bachelor" },
    { value: "masters", label: "Masters" },
    { value: "phd", label: "PHD" },
    { value: "others", label: "Others" },
  ],
};

const COUNTRIES_FILTER = {
  id: "country",
  options: [
    { value: "germany", label: "Germany" },
    { value: "uk", label: "UK" },
    { value: "france", label: "France" },
    { value: "england", label: "England" },
    { value: "europe", label: "europe" },
  ],
};

function Filter() {
  return (
    <>
      <div className="hidden md:block">
        <Main />
      </div>

      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              Filters <FilterIcon className="icon-md" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="pt-2">
            <div className="mx-auto w-full max-w-sm overflow-y-scroll h-[80vh] px-2 ">
              <div className="overflow-y-scroll">
                <div className="flex gap-8 items-center fixed bg-background w-inherit z-10">
                  <DrawerClose asChild>
                    <Button className="w-fit px-0" variant="link">
                      <X className="icon-lg" />
                    </Button>
                  </DrawerClose>
                  <h4 className="header ">Filtters</h4>
                </div>
                <div className="mt-12">
                  <Main />
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

function Main() {
  const { filter, dispatch } = useFilterContext();

  return (
    <div className="flex flex-col w-full">
      <Accordion
        type="multiple"
        className="animate-none max-w-96"
        defaultValue={["country", "degree"]}
      >
        <AccordionItem value="sort">
          <AccordionTrigger>
            <h4 className="header text-lg">Sort</h4>
          </AccordionTrigger>
          <AccordionContent className="animate-none">
            <div className="pb-6">
              <RadioGroup
                defaultValue={filter.sort}
                onValueChange={(val) => {
                  dispatch({
                    type: "TOGGLE_SORT",
                    payload: { value: val },
                  });
                }}
              >
                {SORT_OPTIONS.options.map((c) => (
                  <div key={c.value} className="flex gap-2">
                    <RadioGroupItem
                      id={c.value}
                      value={c.value}
                      // checked={filter.sort === c.value}
                    />
                    <Label htmlFor={c.value}>{c.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="country">
          <AccordionTrigger>
            <h4 className="header text-lg">Country</h4>
          </AccordionTrigger>
          <AccordionContent className="animate-none">
            <div className="py-">
              <ul className="flex gap-2 py-2 flex-wrap">
                {filter.country.map((c, i) => (
                  <li
                    className="px-2 py-1.5 bg-primary-lig w-fit rounded-sm flex  gap-2 items-center cursor-pointer"
                    key={c.value}
                  >
                    <Checkbox
                      id={`c-${c.value}`}
                      checked={filter.country.includes(c)}
                      onCheckedChange={() => {
                        dispatch({
                          type: "TOGGLE_FILTER",
                          payload: { category: "country", value: c },
                        });
                      }}
                      className="sr-only"
                    />
                    <X
                      className="icon-md text-secondary"
                      onClick={() => {
                        dispatch({
                          type: "TOGGLE_FILTER",
                          payload: { category: "country", value: c },
                        });
                      }}
                    />
                    <Label htmlFor={`c-${c.value}`}>{c.label}</Label>
                  </li>
                ))}
              </ul>
            </div>
            <Command className="rounded-sm border shadow-md">
              <CommandInput placeholder="Select a country" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Countries">
                  {COUNTRIES.map((c, i) => (
                    <>
                      <CommandItem key={c.value} className="flex gap-2 pb-1">
                        <Checkbox
                          id={`c-${i}`}
                          checked={filter.country.includes(c)}
                          className="sr-only"
                        />
                        <div className="w-4">
                          {filter.country.includes(c) ? (
                            <Check className="text-secondary icon-md" />
                          ) : (
                            ""
                          )}
                        </div>
                        <span
                          htmlFor={`c-${i}`}
                          onClick={() => {
                            dispatch({
                              type: "TOGGLE_FILTER",
                              payload: { category: "country", value: c },
                            });
                          }}
                          className="cursor-pointer text-md w-full"
                        >
                          {c.label}
                        </span>
                      </CommandItem>
                    </>
                  ))}
                  <CommandItem>
                    <PersonIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <CommandShortcut>⌘P</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="degree" last={true}>
          <AccordionTrigger>
            <h4 className="header text-lg">Degrees</h4>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-3">
              <ul className="flex flex-col gap-2">
                <li className="flex gap-2">
                  <Checkbox
                    id={`d-all`}
                    checked={
                      filter.degree.length === DEGREES.length ||
                      filter.degree.length === 0
                    }
                    onCheckedChange={() => {
                      dispatch({
                        type: "TOGGLE_FILTER_ALL",
                        payload: {
                          full: filter.degree.length === DEGREES.length,
                        },
                      });
                    }}
                  />
                  <Label htmlFor={`d-all`}>All</Label>
                </li>
                {DEGREES.map((d) => (
                  <li key={d.value} className="flex gap-2">
                    <Checkbox
                      id={`d-${d.value}`}
                      checked={filter.degree.includes(d)}
                      onCheckedChange={() => {
                        dispatch({
                          type: "TOGGLE_FILTER",
                          payload: { category: "degree", value: d },
                        });
                      }}
                    />
                    <Label htmlFor={`d-${d.value}`}>{d.label}</Label>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default memo(Filter);
