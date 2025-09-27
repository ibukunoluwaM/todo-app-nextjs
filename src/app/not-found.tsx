//error 404 page
"use client";
import React from "react";
import { useRouter } from "next/navigation";

function ErrorPage() {
    const router = useRouter();
  return (
    <>
      <div
        className="min-h-screen flex flex-col justify-center items-center text-center p-4"
        role="alert"
        aria-live="assertive"
      >
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p id="error-message">
          Oops! Seems like the page you are looking for doesn't exist.
        </p>
        <button
          onClick={()=> router.push("/")}
          className="btn btn-accent mt-4"
          aria-label="Return to home page"
          aria-describedby="error-message"
        >
          Return to Home
        </button>
      </div>
    </>
  );
}

export default ErrorPage;
