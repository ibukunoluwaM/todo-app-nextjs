"use client"
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import FilterBar from "../components/filterBar";
import TodoList from "../components/todoList";
import TodoForm from "../components/todoForm";
import { fetchTodos } from "../fetchTodos";
import { redirect } from "next/navigation";
import UserGreeting from "../../../username";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions/authOptions";
import { prisma } from "../../../lib/prisma";
export type NewTodo = {
  userId: string;
  id: number;
  title: string;
  completed: boolean;
};


// export async function getServerSideProps(context: any) {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   // Fetch the logged-in user's details from the DB
//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: { username: true }, // only get name
//   });

//   return {
//     props: { userName: user?.username || "User" },
//   };
// }

function TodosPage() {
  const { data: session, status } = useSession();
  const [confirmLogOut, setConfirmLogout] = useState(false);
  const [isLogOutLoading, setIsLogOutLoading] = useState(false);
  const [filteredstatus, setFilteredstatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

    // If not logged in, redirect
  if (status === "unauthenticated") {
    redirect("/login");
  }


  const { data, isLoading, isFetching, error } = useQuery<NewTodo[], Error>({
    queryKey: ["todos", session?.user?.id ],
    queryFn: ()=>fetchTodos(session?.user?.id),
     enabled: !!session?.user?.id,
  });

  const filteredTodos: NewTodo[] = data
    ? data.filter((todo: NewTodo) => {
        const statusMatch =
          filteredstatus === "all" ||
          (filteredstatus === "completed" && todo.completed) ||
          (filteredstatus === "uncompleted" && !todo.completed);

        const searchMatch = todo.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        return statusMatch && searchMatch;
      })
    : [];

  function handleLogOut() {
    signOut({ callbackUrl: "/login", redirect: true });
    setIsLogOutLoading(true);
  }

// console.log("User ID:", session?.user?.id);
// console.log("Sessio user:", session?.user?.name);
  return (
    <div className="relative">
      <button
        className="btn btn-soft btn-accent fixed top-0 right-0 cursor-pointer"
        onClick={() => setConfirmLogout(true)}
      >
        Log out
      </button>
      <FilterBar
        filteredstatus={filteredstatus}
        setFilteredstatus={setFilteredstatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <TodoForm />

<UserGreeting/>
      <TodoList data={filteredTodos} isLoading={isLoading}  error={error} />

      {confirmLogOut && (
        <div className="bg-white/10 backdrop-blur-[2px] fixed inset-0 flex justify-center items-center z-[20]">
          <div className="w-[500px] bg-gray-100 p-8 rounded-lg">
            <p>Are you sure you want to log out of this application?</p>
            <div className="mt-2 flex gap-3">
              <button
                className="flex-1 btn btn-outline btn-accent"
                onClick={handleLogOut}
              >
                Yes
              </button>
              <button
                className="flex-1 btn btn-outline btn-error"
                onClick={() => setConfirmLogout(false)}
              >
                No
              </button>
            </div>

            {isLogOutLoading && (
              <div className="text-center mt-4">
                <span className="loading loading-dots loading-xl"></span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TodosPage;
