import { Todo, SampleTodo } from "../types/todo";

export const addTodo = (
  todos: Todo[],
  text: string,
  parentId?: string
): Todo[] => {
  const newTodo: Todo = {
    id: Date.now().toString(),
    text,
    completed: false,
    subtodos: [],
    timestamp: Date.now(),
  };

  if (!parentId) {
    return [...todos, newTodo];
  }

  return todos.map((todo) => {
    if (todo.id === parentId) {
      return { ...todo, subtodos: [...todo.subtodos, newTodo] };
    }
    if (todo.subtodos.length > 0) {
      return { ...todo, subtodos: addTodo(todo.subtodos, text, parentId) };
    }
    return todo;
  });
};

export const toggleTodoCompletion = (todos: Todo[], id: string): Todo[] => {
  return todos.map((todo) => {
    if (todo.id === id) {
      const newCompleted = !todo.completed;
      return {
        ...todo,
        completed: newCompleted,
        subtodos: toggleAllSubtodos(todo.subtodos, newCompleted),
      };
    }
    if (todo.subtodos.length > 0) {
      return { ...todo, subtodos: toggleTodoCompletion(todo.subtodos, id) };
    }
    return todo;
  });
};

const toggleAllSubtodos = (subtodos: Todo[], completed: boolean): Todo[] => {
  return subtodos.map((subtodo) => ({
    ...subtodo,
    completed,
    subtodos: toggleAllSubtodos(subtodo.subtodos, completed),
  }));
};

export const deleteTodo = (todos: Todo[], id: string): Todo[] => {
  return todos
    .filter((todo) => todo.id !== id)
    .map((todo) => {
      if (todo.subtodos.length > 0) {
        return { ...todo, subtodos: deleteTodo(todo.subtodos, id) };
      }
      return todo;
    });
};

export const calculateDepth = (todo: Todo): number => {
  if (todo.subtodos.length === 0) {
    return 1;
  }
  return 1 + Math.max(...todo.subtodos.map(calculateDepth));
};

export const fetchRandomTodo = async (
  existingSuggestion: SampleTodo | null,
  currentTodos: Todo[]
): Promise<SampleTodo> => {
  try {
    const response = await fetch("/sample-todos.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.todos || !Array.isArray(data.todos) || data.todos.length === 0) {
      throw new Error("Invalid or empty todos data");
    }
    
    const availableTodos = data.todos.filter((todo: SampleTodo) => 
      todo.text !== existingSuggestion?.text && 
      !currentTodos?.some(currentTodo => currentTodo.text === todo.text)
    );

    if (availableTodos.length === 0) {
      throw new Error("No new todos available");
    }

    const randomIndex = Math.floor(Math.random() * availableTodos.length);
    console.log(availableTodos[randomIndex])
    return availableTodos[randomIndex];
  } catch (error) {
    console.error("Error fetching random todo:", error);
    throw error;
  }
};

export const sortTodos = (todos: Todo[], ascending: boolean): Todo[] => {
  return [...todos]
    .sort((a, b) => {
      return ascending ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
    })
    .map((todo) => ({
      ...todo,
      subtodos: sortTodos(todo.subtodos, ascending),
    }));
};

export const filterTodos = (todos: Todo[], showCompleted: boolean): Todo[] => {
  return todos
    .filter((todo) => {
      if (showCompleted) {
        return todo.completed;
      } else {
        return !todo.completed || todo.subtodos.length > 0;
      }
    })
    .map((todo) => ({
      ...todo,
      subtodos: todo.subtodos,
    }));
};
