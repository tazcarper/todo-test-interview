import React from "react";
import { Trash2, Plus } from "lucide-react";
import { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  depth: number;
  id: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  depth,
  onToggle,
  onDelete,
}) => {
  return (
    <div
      className={`flex flex-col gap-2 p-4 bg-base-200 rounded-box mb-2 ${
        depth > 0 ? "ml-4" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
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
          onClick={() => onDelete(todo.id)}
          className="btn btn-ghost btn-sm"
          aria-label="Delete todo"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
