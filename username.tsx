"use client";

import { useSession } from "next-auth/react";

export default  function UserGreeting() {
  const {data:session, status} =  useSession();

    if (status === "loading") {
    return <h1>Loading...</h1>; // skeleton/spinner
  }
    console.log("Session data:", session);

  if(!session) {
    return <p>Welcome, Guest 👋 Please log in.</p>;
  }

  return <h1>Welcome, {session.user?.name ?? "Guest"} 👋</h1>;
}