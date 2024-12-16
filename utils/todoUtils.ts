import { Todo, SampleTodo } from "../types/todo";



/* 
Add a new todo to the end of the list

A Todo structure:

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  timestamp: number;
}
  
Should return an array of Todo objects.

  */
export const addTodo = (
  todos: Todo[],
  text: string,
): Todo[] => {
  return []

};


/* 

Marks a todo as complete or incomplete

Should return an array of Todo objects with updated completed todo.

*/


export const toggleTodoCompletion = (todos: Todo[], id: string): Todo[] => {


};


/* 
Should delete a specific todo in the list 

Should return a list of todos
*/
export const deleteTodo = (todos: Todo[], id: string): Todo[] => {
  
};



/* 
Should sort the todos based on when they were added. 

Should return a list of todos in sorted order
*/
export const sortTodos = (todos: Todo[], ascending: boolean): Todo[] => {

};





/* 

Endpoint: "/sample-todos.json"

Use the fetch method to get sample TODOs from the JSON.

Return the todo with this structure.

- Should not return the same suggestion as current suggestion
- Should not return a suggestion that is already a todo

interface SampleTodo {
  id: number;
  text: string;
  category: string;
}

*/


export const fetchRandomTodo = async (
  existingSuggestion: SampleTodo | null,
  currentTodos: Todo[]
): Promise<SampleTodo> => {

// Return a suggested Todo from the JSON

};