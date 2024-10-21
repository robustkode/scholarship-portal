"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="grid place-items-center h-[90vh]">
          <div>
            <h2 className="text-3xl">Something went wrong!</h2>
            <p>{error.name}</p>
            <p>{error.message}</p>
            <button onClick={() => reset()} className="text-primary underline">
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
