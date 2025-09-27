"use client";
//handles the display of todo details
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { NewTodo } from "@/app/todo/page";
import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../../fetchTodos";
// import { useNavigate } from "react-router-dom";

function TodoDetailPage() {
  //   return <TodoDetail/>
  const params = useParams();
  const id = Number(params.id);

  const router = useRouter();
  const { data } = useQuery<NewTodo[]>({
    queryKey: ["todos"],
    queryFn: ()=>fetchTodos(),
  });
  // collect the todos
  const todo = data?.find((t) => t.id === id);

  if (!todo) {
    return <p>Todo not found</p>;
  }
  return (
    <>
      <div className="p-4" role="region" aria-labelledby="todo-detail-heading">
        <h2 id="todo-detail-heading" className="text-xl font-bold mb-4">
          Todo Detail
        </h2>

        <div
          className="bg-white shadow p-4 rounded-md space-y-2"
          role="article"
          aria-label="Todo item details"
        >
          {/* ID */}
          <p>
            <strong aria-hidden="true">ID:</strong>
            <span aria-label={`Todo ID: ${todo.id}`}>{todo.id}</span>
          </p>

          {/* Title */}
          <p>
            <strong aria-hidden="true">Title:</strong>
            <span aria-label={`Title: ${todo.title}`}>{todo.title}</span>
          </p>

          {/* Status (with emoji accessibility) */}
          <p>
            <strong aria-hidden="true">Status:</strong>{" "}
            <span aria-label={todo.completed ? "Completed" : "Not Completed"}>
              {todo!.completed ? "✅ Completed" : "❌ Not Completed"}
            </span>
          </p>

          {/* User */}
          <p>
            <strong aria-hidden="true">User:</strong>
            <span aria-label={`Assigned to User ${todo.userId}`}>
              User #{todo!.userId}
            </span>
          </p>
        </div>

        {/* Button with navigation context */}
        <button
          onClick={() => router.back()}
          className="btn btn-accent mt-4"
          aria-label="Go back to previous page"
        >
          Go Back
        </button>
      </div>
    </>
  );
}

export default TodoDetailPage;
