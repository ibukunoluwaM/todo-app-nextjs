"use client";

import { useRouter } from "next/navigation";

function GlobalError({ error }: { error: Error }) {
  const router = useRouter();
  return (
    <div className="h-[90vh] flex flex-col  justify-center items-center">
      <h1 id="error-heading" className="mt-6">
        Ooops my bad!
      </h1>
      <p id="error-heading">
        It&apos;s not even about you, there&apos;s an Error:
      </p>
      <pre aria-labelledby="error-heading">{error.message}</pre>
      <button
        className="btn btn-accent mt-4"
        onClick={() => router.push("/")}
        aria-label="Try again: Return to homepage"
      >
        Let&apos;s try fixing it again
      </button>
    </div>
  );
}

export default GlobalError;
