"use client";

import { FaPlus } from "react-icons/fa6";
import React, { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { NewTodo } from "../todo/page";

export const local_todos_key = "addedTodos";

export function getTodosFromLocalStorage() {
  return JSON.parse(localStorage.getItem(local_todos_key) || "[]") as NewTodo[];
}



function TodoForm() {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");

  // Get current logged-in user session
  const { data: session } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newTodo.trim()) {
      alert("Todo cannot be empty!");
      return;
    }

    if (!session?.user?.id) {
      console.error("User not logged in!");
      return;
    }

    try {
      // Send todo to your backend API
      const res = await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTodo,
          userId: session.user.id, // attach the logged-in user's id
        }),
      });

      if (!res.ok) throw new Error("Failed to add new todo");

      const savedTodo: NewTodo = await res.json();

      // Update personal todos cache so UI refreshes instantly
      queryClient.setQueryData(["todos"], (oldTodos: NewTodo[] = []) => [
        savedTodo,
        ...oldTodos,
      ]);

      // Clear input and close modal
      setNewTodo("");
      modalRef.current?.close();
    } catch (err) {
      console.error(err);
      alert("Failed to add todo. Try again.");
    }
  }

  return (
    <>
      {/* Button to open modal */}
      <div className="flex justify-center items-center">
        <p className="inline text-center text-lg">Add new todo: </p>
        <button
          className="btn bg-[#37cdbe] cursor-pointer ml-2"
          onClick={() => modalRef.current?.showModal()}
        >
          <FaPlus />
        </button>
      </div>

      {/* Modal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl mb-6">Add a new Task</h2>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter new todo here..."
              className="input input-accent mb-2 w-[100%]"
              required
            />
            <button type="submit" className="btn btn-accent mt-4">
              Submit
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
}

export default TodoForm;
