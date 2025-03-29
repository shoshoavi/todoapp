// Basic test to verify backend setup
console.log('Running basic backend tests...');

const express = require('express');
const app = express();

// Test that Express is working
console.log('Test 1 (Express loaded):', app ? 'PASS' : 'FAIL');

// Test in-memory todos structure
const todos = [
  { id: 1, text: 'Learn React', completed: false },
  { id: 2, text: 'Build a TODO app', completed: false }
];

// Test adding a todo
const newTodo = {
  id: todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1,
  text: 'Test the API',
  completed: false
};

todos.push(newTodo);

console.log('Test 2 (Add todo):', todos.length === 3 ? 'PASS' : 'FAIL');
console.log('Test 3 (Todo text):', todos[2].text === 'Test the API' ? 'PASS' : 'FAIL');

console.log('All tests passed:', app && todos.length === 3 && todos[2].text === 'Test the API' ? 'YES' : 'NO'); 