"use client";
import { getTodosFromLocalStorage } from "./components/todoForm";
import type { NewTodo } from "./todo/page";

export let merged: NewTodo[];

export async function fetchTodos(userId?: string) {


  

  // Always fetch JSONPlaceholder todos (public)
  const placeholderRes = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (!placeholderRes.ok) {
    throw new Error("Failed to fetch placeholder todos");
  }
  const todoFromServer: NewTodo[] = await placeholderRes.json();

  
  // Get local todos, deleted todos, and edited todos from localStorage
  const localTodos: NewTodo[] = getTodosFromLocalStorage();
  const deletedIds: number[] = JSON.parse(localStorage.getItem("deletedTodos") || "[]");
  const editedTodos: NewTodo[] = JSON.parse(localStorage.getItem("editedTodos") || "[]");

  // to get user todo
    let userTodos: NewTodo[] = [];
  if (userId) {
    const userRes = await fetch("/api/todo");
    if (userRes.ok) userTodos = await userRes.json();
  }
  // Merge todos (local, edited, user, placeholder)
  merged = [
    ...localTodos,
    ...editedTodos.filter(
      (editedTodo) =>
        !deletedIds.includes(editedTodo.id) &&
        !localTodos.some((localTodo) => localTodo.id === editedTodo.id)
    ),
    ...userTodos.filter(
      (userTodo) =>
        !deletedIds.includes(userTodo.id) &&
        !localTodos.some((localTodo) => localTodo.id === userTodo.id) &&
        !editedTodos.some((editedTodo) => editedTodo.id === userTodo.id)
    ),
    ...todoFromServer.filter(
      (serverTodo) =>
        !deletedIds.includes(serverTodo.id) &&
        !localTodos.some((localTodo) => localTodo.id === serverTodo.id) &&
        !editedTodos.some((editedTodo) => editedTodo.id === serverTodo.id) &&
        !userTodos.some((userTodo) => userTodo.id === serverTodo.id)
    ),
  ];

  return merged;
}
