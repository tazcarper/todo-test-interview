"use client";

import React, { useState } from "react";
import { Plus, Lightbulb, RefreshCw, ArrowUpDown, Filter } from "lucide-react";
import { Todo, SampleTodo } from "../types/todo";
import TodoItem from "../components/ToDoItem";
import {
  addTodo,
  toggleTodoCompletion,
  deleteTodo,
  fetchRandomTodo,
  sortTodos,
} from "../utils/todoUtils";

export default function TodoList() {
  // List of Todos
  const [todos, setTodos] = useState<Todo[]>([]);
  // Add todo input field value
  const [newTodo, setNewTodo] = useState("");
  // Sorting state
  const [sortAscending, setSortAscending] = useState(true);
  // Show completed state
  const [showCompleted, setShowCompleted] = useState(true);
  // Show uncompleted state
  const [showUncompleted, setShowUncompleted] = useState(true);
  // Current suggested todo object
  const [suggestedTodo, setSuggestedTodo] = useState<SampleTodo | null>(null);

  // Question 1
  // Make "addTodo" work as intended.
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const todoText = newTodo.trim();

    const updatedTodoList = addTodo(todos, todoText);

    setTodos((prev) => [...prev, updatedTodoList]);
    resetInputs();
  };

  // Question 2
  // Make "toggleTodoCompletion" work as intended.
  // id: Id of todo object currently toggled
  const handleToggleTodo = (id: string) => {
    const updatedTodoList = toggleTodoCompletion(todos, id);
    setTodos((prev) => [...prev, updatedTodoList]);
  };

  // Question 3
  // Make deleteTodo work as intended.
  // id: Id of todo object to be deleted
  const handleDeleteTodo = (id: string) => {
    const updatedTodoList = deleteTodo(todos, id);
    setTodos((prev) => [...prev, updatedTodoList]);
  };

  // Question 4
  // Sort the rendered todos in ascending or descending order
  // Use the sortAscending useState hook
  const handleSort = () => {
    const updatedTodoList = sortTodos(todos, sortAscending);
    setTodos((prevTodos) => sortTodos(prevTodos, updatedTodoList));
  };

  // Question 5
  // Filtered the todo list based on todos that are marked as completed
  // Use the showCompleted useState hook
  const handleCompletedFilter = () => {};

  // Question 6
  // Filtered the todo list based on todos that are marked as uncompleted
  // Use the showUncompleted useState hook
  const handleUncompletedFilter = () => {};

  // Question 7
  // Create the fetch random todo function to return a new todo suggestion object
  const handleFetchRandomTodo = async () => {
    try {
      const newSuggestedTodo = await fetchRandomTodo(suggestedTodo, todos);
      setSuggestedTodo(newSuggestedTodo);
    } catch (error) {
      console.error("Error fetching random todo:", error);
    }
  };

  const resetInputs = () => {
    setNewTodo("");
    // setNewSubtask("");
    // setEditingTodoId(null);
  };

  const renderTodo = (todo: Todo, depth: number = 0) => (
    <React.Fragment key={todo.id}>
      <TodoItem
        id={todo.id}
        todo={todo}
        depth={depth}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
      />
    </React.Fragment>
  );

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-base-100 shadow-xl rounded-box p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Todo Listt</h1>

        <form onSubmit={(e) => handleAddTodo(e)} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a new todo..."
            className="input input-bordered flex-1"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            data-testid="addTodo"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </form>

        {suggestedTodo && (
          <div className="alert alert-info mb-6">
            <Lightbulb className="w-5 h-5" />
            <span>Suggested todo: {suggestedTodo.text}</span>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  handleAddTodo(e, suggestedTodo.text);
                  handleFetchRandomTodo();
                }}
                className="btn btn-sm btn-ghost"
                data-testid="addSuggested"
              >
                Add
              </button>
              <button
                onClick={handleFetchRandomTodo}
                className="btn btn-sm btn-ghost"
                aria-label="Suggest another todo"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Sort and Filter Buttons */}
        <div className="flex justify-between mb-4">
          <button onClick={handleSort} className="btn btn-sm">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Sort by {sortAscending ? "Newest" : "Oldest"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleCompletedFilter}
              className={`btn btn-sm ${
                showCompleted ? "btn-primary" : "btn-outline"
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showCompleted ? "Hide Completed" : "Show Completed"}
            </button>
            <button
              onClick={handleUncompletedFilter}
              className={`btn btn-sm ${
                showUncompleted ? "btn-primary" : "btn-outline"
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showUncompleted ? "Hide Uncompleted" : "Show Uncompleted"}
            </button>
          </div>
        </div>

        {/* Render TODOS List*/}
        <div className="space-y-2">{todos.map((todo) => renderTodo(todo))}</div>

        {todos.length > 0 && (
          <div className="text-sm text-base-content/60 text-center mt-4">
            {} of {todos.length} tasks completed
          </div>
        )}
      </div>
    </div>
  );
}
