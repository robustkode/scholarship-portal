"use client";

export default function Error({ error, reset }) {
  return (
    <div className="grid place-items-center h-[90vh] text-center">
      <div>
        <h2 className="text-3xl">Something went wrong!</h2>
        <p>{error.name}</p>
        <p>{error.message}</p>
        <button onClick={() => reset()} className="text-primary underline">
          Try again
        </button>
      </div>
    </div>
  );
}
