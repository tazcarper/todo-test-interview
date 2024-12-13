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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [suggestedTodo, setSuggestedTodo] = useState<SampleTodo | null>(null);

  const sortAscending = undefined;
  const showCompleted = undefined;
  const showUncompleted = undefined;

  const handleFetchRandomTodo = async () => {
    try {
      const newSuggestedTodo = await fetchRandomTodo(suggestedTodo, todos);
      setSuggestedTodo(newSuggestedTodo);
    } catch (error) {
      console.error("Error fetching random todo:", error);
    }
  };

  const handleAddTodo = (e: React.FormEvent, text: string = newTodo) => {
    e.preventDefault();
    // addTodo(todos, text);
  };

  const handleToggleTodo = (id: string) => {
    // toggleTodoCompletion()
  };

  const handleDeleteTodo = (id: string) => {
    // deleteTodo()
  };

  const handleSort = () => {};

  const handleCompletedFilter = () => {};

  const handleUncompletedFilter = () => {};

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
