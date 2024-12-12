"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Lightbulb,
  RefreshCw,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { Todo, SampleTodo } from "./types/todo";
import {
  addTodo,
  toggleTodoCompletion,
  deleteTodo,
  fetchRandomTodo,
  sortTodos,
} from "./utils/todoUtils";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [suggestedTodo, setSuggestedTodo] = useState<SampleTodo | null>(null);

  const [newSubtask, setNewSubtask] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showUncompleted, setShowUncompleted] = useState(true);

  const handleFetchRandomTodo = async () => {
    try {
      const newSuggestedTodo = await fetchRandomTodo(suggestedTodo);
      setSuggestedTodo(newSuggestedTodo);
    } catch (error) {
      console.error("Error fetching random todo:", error);
    }
  };

  const handleAddTodo = (
    e: React.FormEvent,
    text: string = newTodo,
    parentId?: string
  ) => {
    e.preventDefault();
    if (text.trim()) {
      setTodos((prevTodos) => addTodo(prevTodos, text.trim(), parentId));
      setNewTodo("");
      setNewSubtask("");
    }
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prevTodos) => toggleTodoCompletion(prevTodos, id));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prevTodos) => deleteTodo(prevTodos, id));
  };

  const handleSort = () => {
    setSortAscending((prev) => !prev);
    setTodos((prevTodos) => sortTodos(prevTodos, !sortAscending));
  };

  const handleCompletedFilter = () => {
    setShowCompleted((prev) => !prev);
  };

  const handleUncompletedFilter = () => {
    setShowUncompleted((prev) => !prev);
  };

  const renderTodo = (todo: Todo, depth: number = 0) => (
    <div
      key={todo.id}
      className={`flex flex-col gap-2 p-4 bg-base-200 rounded-box mb-2 ${
        depth > 0 ? "ml-4" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => handleToggleTodo(todo.id)}
          className="checkbox checkbox-primary"
        />
        <span
          className={`flex-1 ${
            todo.completed ? "line-through opacity-60" : ""
          }`}
        >
          {todo.text}
        </span>
        <span className="text-sm text-base-content/60">
          {new Date(todo.timestamp).toLocaleString()}
        </span>
        <button
          onClick={() => handleDeleteTodo(todo.id)}
          className="btn btn-ghost btn-sm"
          aria-label="Delete todo"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const filteredTodos = todos.filter(
    (todo) =>
      (showCompleted && todo.completed) || (showUncompleted && !todo.completed)
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

        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center text-base-content/60 py-4">
              No todos to display based on current filters.
            </div>
          ) : (
            filteredTodos.map((todo) => renderTodo(todo))
          )}
        </div>

        {todos.length > 0 && (
          <div className="text-sm text-base-content/60 text-center mt-4">
            {todos.filter((t) => t.completed).length} of {todos.length} tasks
            completed
          </div>
        )}
      </div>
    </div>
  );
}
