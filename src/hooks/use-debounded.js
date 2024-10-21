import { useEffect, useState } from "react";

export const useDebouncedVal = (value, delay = 100) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      //#move it another place
      const c = value.country?.map((c) => c.value);
      const d = value.degree?.map((d) => d.value);
      setDebouncedValue({ ...value, country: c, degree: d });
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};
