#### Welcome to the TODO app! This project is partially built, and it’s your task to complete the implementation. Follow these steps to get started:

##### Setup:

Clone the repository and install dependencies:

```
npm install
Run the application using:
npm run dev
```

Open the app in your browser. If you see the TODO application interface, you’re ready to start!

#### Your Task:

The application allows users to:

- Add TODO items
- Delete TODO items
- Filter TODO items
- Sort TODO items
- Use a suggested TODO feature

Your job is to implement the state management and ensure all these functionalities work as intended.

#### Additional Notes:

CSS Frameworks: The app uses Tailwind CSS and DaisyUI for styling and components.

Testing: Ensure all the Jest tests pass by matching the provided solution as closely as possible.

#### Testing:

Ensure all Jest tests pass by matching the provided solution. Run the tests using:

`npm test`

Get started and show off your skills!

### !! Hold !!

##### Complete previous tasks and then move to here

#### Advanced Feature: Subtasks

Once the basic functionality is complete, take on this advanced challenge:

#### Subtasks Functionality:

- Add the ability for users to create subtasks under a TODO item.
  - Subtasks can have unlimited nesting (i.e., subtasks of subtasks).
- Display subtasks indented below their parent TODO item.
- When a parent TODO or subtask is marked as completed, all its child
  subtasks should also be marked as completed.

#### Example:

###### TODO: Clean the kitchen

- Clean the oven
  - Clean the racks
- Clean the stove top
  - Soak with soapy water
    - Wipe off
      - Throw paper towel away
  - Sprinkle baking soda
    - Wipe off
- Clean the sink
- Wipe the countertops
- Clean the floors
  - Vacuum
  - Mop
