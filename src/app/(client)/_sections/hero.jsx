"use client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNTRIES } from "@/config";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Hero() {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  const filteredOptions = useMemo(() => {
    return COUNTRIES.filter((c) =>
      c.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleClickOutside = (e) => {
    if (e.target.closest(".dropdown") === null) {
      setIsDropdownOpen(false);
    }
  };

  const handleSearchButton = () => {
    if (!filteredOptions.length) {
      setInputValue("");
      inputRef.current.focus();
      return;
    } else if (!inputValue) {
      filurl.searchParams.append("country", "all");
      router.push(filurl.toString());
    } else {
      const country = filteredOptions[0];
      filurl.searchParams.append("country", country);
      router.push(filurl.toString());
    }
  };

  const handleOptionSelect = (option) => {
    setInputValue(option.label);
    setIsDropdownOpen(false);

    const filurl = new URL("/scholarships", window.location.origin);
    filurl.searchParams.append("countries", option.value);
    router.push(filurl.toString());
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section id="hero" className="">
      <div className="overlay"></div>
      <Container className="py-4  md:py-4 lg:py-4 relative z-30 text-primary-foreground">
        <div className="flex flex-col gap-6 h-[460px] justify-center">
          <h3 className="sm:text-xl  hidden sm:block">
            Discover interestiing scholarship opportunities
          </h3>
          <h1 className="sm:text-2xl md:text-4xl text-xl font-bold text-white line-relaxed">
            Explore our curated collection of the best scholarships for
            Ethiopians, complete with video guides to help you navigate the
            application process{" "}
          </h1>
          <div className="flex gap-4 items-center  relative mt-6">
            <div className="max-w-96 w-full dropdown">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                placeholder="Select a country where you want to study"
                className="max-w-96 w-full placeholder:text-gray-400"
              />
              {isDropdownOpen && (
                <ul className="absolute border mt-1 bg-white rounded shadow-lg max-h-80 max-w-96 overflow-auto  text-start px-4 top-12 w-full py-2">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <li
                        key={option.value}
                        onClick={() => handleOptionSelect(option)}
                        className="p-2 cursor-pointer hover:bg-gray-200 text-foreground"
                      >
                        {option.label}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500 text-center">
                      No options found
                    </li>
                  )}
                </ul>
              )}
            </div>

            <Button className="" onClick={handleSearchButton}>
              <Link href="/" className="hidden sm:block">
                Search
              </Link>
              <Search className="icon-lg sm:hidden" />
            </Button>

            <Button
              variant="outline"
              className="ml-6 text-secondary border-secondary hover:bg-secondary hover:text-secondary-foreground hidden md:block"
            >
              <Link href={"/scholarships"}>Explore videos</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
