"use client";
import { COUNTRIES, DEGREES } from "@/config";
import { useSearchParams } from "next/navigation";
import React, { createContext, useContext, useReducer } from "react";
import _ from "lodash";
const FilterContext = createContext(null);

// const DEGREE_FILTERS = {
//   id: "degree",
//   options: [
//     { value: "bachelor", label: "Bachelor" },
//     { value: "masters", label: "Masters" },
//     { value: "phd", label: "PHD" },
//     { value: "others", label: "Others" },
//   ],
// };

const filterReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_FILTER":
      const { category, value } = action.payload;
      const isFilterApplied = state[category].includes(value);
      if (
        isFilterApplied &&
        category === "degree" &&
        state.degree.length === 1
      ) {
        return {
          ...state,
          [category]: [...DEGREES],
          page: 1,
          update: true,
        };
      }
      return {
        ...state,
        [category]: isFilterApplied
          ? state[category].filter((v) => !_.isEqual(v, value))
          : [...state[category], value],
        page: 1,
        update: true,
      };
    case "TOGGLE_FILTER_ALL":
      if (action.payload.full) {
        return state;
      }
      return {
        ...state,
        degree: [...DEGREES],
        page: 1,
        update: true,
      };

    case "TOGGLE_SORT":
      return {
        ...state,
        sort: action.payload.value,
        page: 1,
        update: true,
      };
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload.page,
        update: false,
      };

    default:
      return state;
  }
};
export default function FilterContextProvider({ children }) {
  const searchParams = useSearchParams();
  const deg = searchParams.getAll("degrees");
  const ctry = searchParams.getAll("countries");
  const srt = searchParams.get("sort");
  const pg =
    parseInt(searchParams.get("page")) > 0
      ? parseInt(searchParams.get("page"))
      : 1;

  const [filter, dispatch] = useReducer(filterReducer, {
    degree: deg.length
      ? DEGREES.filter((d) => deg.includes(d.value))
      : [...DEGREES],
    country: COUNTRIES.filter((c) => ctry.includes(c.value)),
    sort: srt || "asc",
    page: pg,
    updated: true,
  });
  return (
    <FilterContext.Provider value={{ filter, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("Context must be used with in a FilterContextProvider");
  }
  return context;
}
