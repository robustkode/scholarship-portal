import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function ErrorMessage({ message, className, retry = false }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center bg-red-100 p-8 rounded-sm gap-2 m-12",
        className
      )}
    >
      <h3 className="header text-3xl">Error</h3>
      <p>{message}</p>
      {retry ? (
        <Button variant="link" className="text-primary" onClick={() => retry()}>
          Try Again
        </Button>
      ) : (
        ""
      )}
    </div>
  );
}
