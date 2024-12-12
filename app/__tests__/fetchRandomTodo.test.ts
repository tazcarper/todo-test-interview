import { fetchRandomTodo } from '../utils/todoUtils';
import { Todo, SampleTodo } from '../types/todo';

// Mock the global fetch function
global.fetch = jest.fn();

// Sample data for our tests
const sampleTodos: SampleTodo[] = [
  { id: 1, text: "Learn Jest", category: "Work" },
  { id: 2, text: "Write tests", category: "Work" },
  { id: 3, text: "Run tests", category: "Work" },
  { id: 4, text: "Debug tests", category: "Work" },
  { id: 5, text: "Celebrate success", category: "Personal" },
];

describe('fetchRandomTodo', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock the fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ todos: sampleTodos }),
    });
  });

  it('should fetch a random todo', async () => {
    const result = await fetchRandomTodo(null, []);
    expect(sampleTodos).toContainEqual(result);
  });

  it('should not return a duplicate of the existing suggestion', async () => {
    const existingSuggestion = sampleTodos[0];
    const result = await fetchRandomTodo(existingSuggestion, []);
    expect(result).not.toEqual(existingSuggestion);
  });

  it('should not return a todo that already exists in the current todos', async () => {
    const currentTodos: Todo[] = [
      { id: '1', text: sampleTodos[0].text, completed: false, subtodos: [], timestamp: Date.now() },
    ];
    const result = await fetchRandomTodo(null, currentTodos);
    expect(result.text).not.toBe(sampleTodos[0].text);
  });

  it('should throw an error when no new todos are available', async () => {
    const currentTodos: Todo[] = sampleTodos.map(todo => ({
      id: todo.id.toString(),
      text: todo.text,
      completed: false,
      subtodos: [],
      timestamp: Date.now(),
    }));

    await expect(fetchRandomTodo(null, currentTodos)).rejects.toThrow('No new todos available');
  });

  it('should return different todos on subsequent calls (refresh functionality)', async () => {
    const firstResult = await fetchRandomTodo(null, []);
    const secondResult = await fetchRandomTodo(firstResult, []);
    expect(firstResult).not.toEqual(secondResult);
  });

  it('should handle fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
    await expect(fetchRandomTodo(null, [])).rejects.toThrow('Fetch failed');
  });

  it('should handle invalid response data', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ todos: null }),
    });
    await expect(fetchRandomTodo(null, [])).rejects.toThrow('Invalid or empty todos data');
  });
});

