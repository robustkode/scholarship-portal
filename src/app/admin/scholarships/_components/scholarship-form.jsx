"use client";

import TipTap from "@/components/tiptap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, handleSubmit } from "react-hook-form";
import * as z from "zod";
import { useMemo, useState } from "react";
import DropImage from "../../_components/drop-image";
import { useToast } from "@/hooks/use-toast";
import { useFormStatus, useFormState } from "react-dom";
import Container from "@/components/container";
import { createScholarshipAction } from "../create/action";
import { useServerAction } from "zsa-react";
import { updateScholarshipAction } from "../[id]/action";
import { DeleteScholarshipButton } from "./delete-scholarship-button";
import { SeedDb } from "../_actions";
import { LoaderButton } from "@/components/loader-button";
import { compare, test } from "@/util";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { COUNTRIES, CURRUNCIES, DEGREES } from "@/config";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, getTime } from "date-fns";
import { X } from "lucide-react";

const ScholarshipSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Too short" }),
  university: z.string().optional(),
  tution: z.coerce.number(),
  currency: z.string(),
  openTime: z.union([
    z
      .string()
      .length(0)
      .transform((t) => 0),
    z.date().transform((time) => getTime(time)),
  ]),
  deadline: z.union([
    z
      .string()
      .length(0)
      .transform((t) => 0),
    z.date().transform((time) => getTime(time)),
  ]),

  about: z.string().min(3, { message: "Too short" }),
  eligibility: z.string().min(3, { message: "Too short" }),
  documents: z.string(),
  benefits: z.string(),
  howApply: z.string(),
  applyLink: z.union([z.string().length(0), z.string().url()]),
  otherFields: z.string().optional(),
  tags: z
    .string()
    .optional()
    .transform((t) => {
      return t ? t.split(",") : [];
    }),
  degrees: z
    .string()
    .min(1, "Select at lease one degree")
    .transform((d) => d.split(",")),
  countries: z
    .string()
    .min(1, "Select at least one host")
    .transform((t) => t.split(",")),
});

export default function ScholarshipForm({ data }) {
  const [coverImg, setImgCoverImg] = useState(data?.coverImage || null);
  const [selectedCountries, setSelectedCountries] = useState(
    data?.countries ? data.countries.split(",") : []
  );
  const [selectedDegrees, setSelectedDegrees] = useState(
    data?.degrees ? data.degrees.split(",") : []
  );
  // console.log(data, "data");
  const { toast } = useToast();
  const form = useForm({
    mode: "onchange",
    resolver: zodResolver(ScholarshipSchema),
    defaultValues: data
      ? {
          name: data.name,
          university: data.university,
          tution: data.tution,
          openTime: data.openTime == 0 ? "" : new Date(data.openTime),
          deadline: data.deadline == 0 ? "" : new Date(data.deadline),
          about: data.about,
          eligibility: data.eligibility,
          documents: data.documents,
          benefits: data.benefits,
          howApply: data.howApply,
          applyLink: data.applyLink,
          id: data.id,
          tags: data.tags || "",
          countries: data.countries || "",
          degrees: data.degrees || "",
          currency: data.currency || "",
        }
      : {
          tags: "",
          countries: "",
          degrees: "",
          currency: "$",
          openTime: "",
          deadline: "",
        },
  });

  const { execute, isPending, error } = useServerAction(
    data ? updateScholarshipAction : createScholarshipAction,
    {
      onError({ err }) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
        });
      },
      onSuccess() {
        toast({
          title: "Scholarship deleted successfully!",
          description: "Enjoy your session",
        });
      },
    }
  );
  const handleSetValue = (val, cat, setFun) => {
    const oldVal = form.getValues(cat);
    const oldValList = oldVal ? oldVal.split(",") : [];
    if (oldValList.includes(val)) {
      const newValList = oldValList.filter((v) => v !== val);
      form.setValue(cat, newValList.join(","));
      setFun([...newValList]);
    } else {
      oldValList.push(val);
      form.setValue(cat, oldValList.join(","));
      setFun([...oldValList]);
    }
  };

  function onSubmit(values) {
    const formData = new FormData();
    formData.append("file", coverImg);
    let valuesWithImage = { ...values, coverImage: formData };
    if (data) {
      const { addedItems: countries, removedItems: rCountries } = compare(
        data.countries,
        values.countries
      );
      const { addedItems: tags, removedItems: rTags } = compare(
        data.tags,
        values.tags
      );
      const { addedItems: degrees, removedItems: rDegrees } = compare(
        data.degrees,
        values.degrees
      );

      valuesWithImage = {
        ...valuesWithImage,
        countries,
        tags,
        degrees,
        rCountries,
        rDegrees,
        rTags,
      };
      execute(valuesWithImage);
      return;
    }

    execute(valuesWithImage);
  }

  return (
    <div className="py-12">
      <Container>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <DropImage img={coverImg} setImg={setImgCoverImg} />
            <div className="grid md:grid-cols-2 gap-x-8">
              <FormField
                control={form.control}
                name="name"
                className="my-8"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="university"
                className="my-8"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>University</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-x-8">
              <FormField
                control={form.control}
                name="countries"
                className="my-8"
                render={({ field }) => (
                  <FormItem className="flex flex-col my-4">
                    <FormLabel className="mb-2">Countries</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="justify-between"
                          >
                            <div className="flex gap-2 justify-start">
                              {selectedCountries.length
                                ? selectedCountries.map((val, i) => (
                                    <div
                                      key={i}
                                      className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                                      onClick={() =>
                                        handleSetValue(
                                          val,
                                          "countries",
                                          setSelectedCountries
                                        )
                                      }
                                    >
                                      {
                                        COUNTRIES.find((l) => l.value === val)
                                          ?.label
                                      }
                                    </div>
                                  ))
                                : "Select countries..."}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="">
                        <Command>
                          <CommandInput
                            placeholder="Search country..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                              {COUNTRIES.map((country) => (
                                <CommandItem
                                  value={country.label}
                                  key={country.value}
                                  onSelect={() =>
                                    handleSetValue(
                                      country.value,
                                      "countries",
                                      setSelectedCountries
                                    )
                                  }
                                >
                                  {country.label}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      selectedCountries.includes(country.value)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="degrees"
                className="my-8"
                render={({ field }) => (
                  <FormItem className="flex flex-col my-4">
                    <FormLabel className="mb-2">Degrees</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="justify-between"
                          >
                            <div className="flex gap-2 justify-start">
                              {selectedDegrees.length
                                ? selectedDegrees.map((val, i) => (
                                    <div
                                      key={i}
                                      className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                                      onClick={() =>
                                        handleSetValue(
                                          val,
                                          "degrees",
                                          setSelectedDegrees
                                        )
                                      }
                                    >
                                      {
                                        DEGREES.find((l) => l.value === val)
                                          ?.label
                                      }
                                    </div>
                                  ))
                                : "Select degrees..."}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="">
                        <Command>
                          <CommandList>
                            <CommandEmpty>No degree found.</CommandEmpty>
                            <CommandGroup>
                              {DEGREES.map((country) => (
                                <CommandItem
                                  value={country.label}
                                  key={country.value}
                                  onSelect={() =>
                                    handleSetValue(
                                      country.value,
                                      "degrees",
                                      setSelectedDegrees
                                    )
                                  }
                                >
                                  {country.label}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      selectedDegrees.includes(country.value)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-x-8">
              <FormField
                control={form.control}
                name="tution"
                className="my-8"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Tution</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                className="my-4"
                render={({ field }) => (
                  <FormItem className="mt-2 mb-4">
                    <FormLabel>Currency</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRUNCIES.map((c) => (
                          <SelectItem value={c.value} key={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-x-8">
              <FormField
                control={form.control}
                name="openTime"
                render={({ field }) => (
                  <div className="flex gap-2 items-end my-4">
                    <FormItem className="flex flex-col">
                      <FormLabel className="my-2">Open time</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal text-foreground",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date("2030-01-01") || date < new Date()
                            }
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                    {field.value ? (
                      <X
                        className="icon-lg text-secondary mb-2 cursor-pointer"
                        onClick={() => form.setValue("openTime", "")}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <div className="flex gap-2 items-end my-4">
                    <FormItem className="flex flex-col">
                      <FormLabel className="my-2">Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal text-foreground",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date("2030-01-01") || date < new Date()
                            }
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                    {field.value ? (
                      <X
                        className="icon-lg text-secondary mb-2 cursor-pointer"
                        onClick={() => form.setValue("deadline", "")}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-x-8">
              <FormField
                control={form.control}
                name="tags"
                className="my-8"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applyLink"
                className="my-8"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Apply link</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="about"
              className="pt-2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <TipTap content={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eligibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligibility</FormLabel>
                  <FormControl>
                    <TipTap content={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documents</FormLabel>
                  <FormControl>
                    <TipTap content={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <TipTap content={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="howApply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How to apply</FormLabel>
                  <FormControl>
                    <TipTap content={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherFields"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <TipTap content={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end flex-wrap mt-6">
              {data ? (
                <DeleteScholarshipButton schId={data.id}>
                  Delete
                </DeleteScholarshipButton>
              ) : (
                ""
              )}
              <LoaderButton type="submit" isLoading={isPending} className="">
                {data ? "Update scholarship" : "Post scholarship"}
              </LoaderButton>
            </div>
          </form>
        </Form>
      </Container>
    </div>
  );
}
