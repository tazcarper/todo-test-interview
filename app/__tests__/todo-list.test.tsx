import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoList from "../page";
import * as todoUtils from "../utils/todoUtils";

// Mock the localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: function (key: string) {
      return store[key] || null;
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock the fetchRandomTodo function
jest.mock("../utils/todoUtils", () => ({
  ...jest.requireActual("../utils/todoUtils"),
  fetchRandomTodo: jest
    .fn()
    .mockResolvedValue({ id: 1, text: "Mocked todo", category: "Test" }),
}));

describe("TodoList Component", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test("renders TodoList component", () => {
    render(<TodoList />);
    expect(screen.getByText("Advanced Todo List")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Add a new todo...")
    ).toBeInTheDocument();
  });

  test("adds a new todo", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(input, { target: { value: "New test todo" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("New test todo")).toBeInTheDocument();
    });
  });

  test("toggles a todo", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(input, { target: { value: "Toggle test todo" } });
    fireEvent.click(addButton);

    const todoCheckbox = screen.getByRole("checkbox");
    fireEvent.click(todoCheckbox);

    await waitFor(() => {
      expect(todoCheckbox).toBeChecked();
    });
  });

  test("deletes a todo", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(input, { target: { value: "Delete test todo" } });
    fireEvent.click(addButton);

    const deleteButton = screen.getByLabelText("Delete todo");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Delete test todo")).not.toBeInTheDocument();
    });
  });

  test("filters todos", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(input, { target: { value: "Completed todo" } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: "Uncompleted todo" } });
    fireEvent.click(addButton);

    const todoCheckboxes = screen.getAllByRole("checkbox");
    fireEvent.click(todoCheckboxes[0]);

    const hideCompletedButton = screen.getByRole("button", {
      name: "Hide Completed",
    });
    fireEvent.click(hideCompletedButton);

    await waitFor(() => {
      expect(screen.queryByText("Completed todo")).not.toBeInTheDocument();
      expect(screen.getByText("Uncompleted todo")).toBeInTheDocument();
    });
  });

  test("sorts todos", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(input, { target: { value: "First todo" } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: "Second todo" } });
    fireEvent.click(addButton);

    const sortButton = screen.getByRole("button", { name: /Sort by/i });
    fireEvent.click(sortButton);

    const todos = screen.getAllByRole("checkbox");
    await waitFor(() => {
      expect(todos[0].nextSibling).toHaveTextContent("Second todo");
      expect(todos[1].nextSibling).toHaveTextContent("First todo");
    });
  });
});

describe("TodoUtils", () => {
  test("addTodo adds a new todo", () => {
    const initialTodos = [];
    const newTodos = todoUtils.addTodo(initialTodos, "Test todo");
    expect(newTodos).toHaveLength(1);
    expect(newTodos[0].text).toBe("Test todo");
    expect(newTodos[0].completed).toBe(false);
  });

  test("toggleTodoCompletion toggles todo status", () => {
    const initialTodos = [
      {
        id: "1",
        text: "Test todo",
        completed: false,
        subtodos: [],
        timestamp: Date.now(),
      },
    ];
    const updatedTodos = todoUtils.toggleTodoCompletion(initialTodos, "1");
    expect(updatedTodos[0].completed).toBe(true);
  });

  test("deleteTodo removes a todo", () => {
    const initialTodos = [
      {
        id: "1",
        text: "Test todo",
        completed: false,
        subtodos: [],
        timestamp: Date.now(),
      },
    ];
    const updatedTodos = todoUtils.deleteTodo(initialTodos, "1");
    expect(updatedTodos).toHaveLength(0);
  });

  test("calculateDepth returns correct depth", () => {
    const todo = {
      id: "1",
      text: "Parent",
      completed: false,
      subtodos: [
        {
          id: "2",
          text: "Child",
          completed: false,
          subtodos: [
            {
              id: "3",
              text: "Grandchild",
              completed: false,
              subtodos: [],
              timestamp: Date.now(),
            },
          ],
          timestamp: Date.now(),
        },
      ],
      timestamp: Date.now(),
    };
    const depth = todoUtils.calculateDepth(todo);
    expect(depth).toBe(3);
  });
});
