import React from "react";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoList from "../app/solution/page";
import * as todoUtils from "../utils/solution/todoUtils";

// Mock the localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock the fetchRandomTodo function
jest.mock("../utils/solution/todoUtils", () => ({
  ...jest.requireActual("../utils/solution/todoUtils"),
  fetchRandomTodo: jest
    .fn()
    .mockResolvedValue({ id: 1, text: "Mocked todo", category: "Test" }),
}));

describe("TodoList Component", () => {
  beforeEach(() => {
    localStorageMock.clear();
   
  });

  afterEach(() => {
    cleanup();
  })

  test("renders TodoList component", async () => {
    await act(async () => {
      render(<TodoList />);
    });
    expect(screen.getByText("Todo List")).toBeInTheDocument();

  });


  // When a user adds a todo, it should add it to the list
  test("adds a new todo", async () => {
    await act(async () => {
      render(<TodoList />);
    });
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByTestId("addTodo");

    await act(async () => {
      fireEvent.change(input, { target: { value: "New test todo" } });
      fireEvent.click(addButton);
    });

    expect(screen.getByText("New test todo")).toBeInTheDocument();
  });

  test("toggles a todo", async () => {
    await act(async () => {
      render(<TodoList />);
    });
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByTestId("addTodo");
  

    await act(async () => {
      fireEvent.change(input, { target: { value: "Toggle test todo" } });
      fireEvent.click(addButton);
    });

    const todoCheckbox = screen.getByRole("checkbox");
    
    await act(async () => {
      fireEvent.click(todoCheckbox);
    });

    expect(todoCheckbox).toBeChecked();
    expect(screen.queryByText("1 of 1 tasks completed")).toBeInTheDocument();
  });

  test("deletes a todo", async () => {
    await act(async () => {
      render(<TodoList />);
    });
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByTestId("addTodo");

    await act(async () => {
      fireEvent.change(input, { target: { value: "Delete test todo" } });
      fireEvent.click(addButton);
    });

    const deleteButton = screen.getByLabelText("Delete todo");
    
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(screen.queryByText("Delete test todo")).not.toBeInTheDocument();
  });

  test("filters todos", async () => {
    await act(async () => {
      render(<TodoList />);
    });
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByTestId("addTodo");


    await act(async () => {
      fireEvent.change(input, { target: { value: "Completed todo" } });
      fireEvent.click(addButton);
      fireEvent.change(input, { target: { value: "Uncompleted todo" } });
      fireEvent.click(addButton);
    });

    const todoCheckboxes = screen.getAllByRole("checkbox");
    
    await act(async () => {
      fireEvent.click(todoCheckboxes[0]);
    });

    const hideCompletedButton = screen.getByRole("button", {
      name: "Hide Completed",
    });
    
    await act(async () => {
      fireEvent.click(hideCompletedButton);
    });

    expect(screen.queryByText("Completed todo")).not.toBeInTheDocument();
    expect(screen.getByText("Uncompleted todo")).toBeInTheDocument();
  });

  test("sorts todos", async () => {
    await act(async () => {
      render(<TodoList />);
    });
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByTestId("addTodo");


    await act(async () => {
      fireEvent.change(input, { target: { value: "First todo" } });
      fireEvent.click(addButton);
      fireEvent.change(input, { target: { value: "Second todo" } });
      fireEvent.click(addButton);
    });

    const sortButton = screen.getByRole("button", { name: /Sort by/i });
    
    await act(async () => {
      fireEvent.click(sortButton);
    });

    const todos = screen.getAllByRole("checkbox");
    expect(todos[0].nextSibling).toHaveTextContent("Second todo");
    expect(todos[1].nextSibling).toHaveTextContent("First todo");
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


  test("adds a suggested todo", async () => {
    await act(async () => {
      render(<TodoList />);
    });

    // Wait for the suggested todo to appear
    await screen.findByText("Suggested todo: Mocked todo");

    const addSuggestedButton = screen.getByTestId("addSuggested");

    await act(async () => {
      fireEvent.click(addSuggestedButton);
    });

    // Check if the suggested todo has been added to the list
    expect(screen.getByText("Mocked todo")).toBeInTheDocument();

    // Check if a new suggestion is fetched after adding the previous one
    await screen.findByText("Suggested todo: Mocked todo");
  });
});

