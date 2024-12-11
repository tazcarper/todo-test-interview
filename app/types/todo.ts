export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  subtodos: Todo[];
  timestamp: number;
}

export interface SampleTodo {
  id: number;
  text: string;
  category: string;
}
