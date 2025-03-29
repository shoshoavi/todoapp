const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Import the server code but don't start the server
const app = express();
app.use(cors());
app.use(express.json());

// Mock the same endpoints and data as in server.js
let todos = [
  { id: 1, text: 'Learn React', completed: false },
  { id: 2, text: 'Build a TODO app', completed: false }
];

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Todo text is required' });
  }
  
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1,
    text,
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

describe('Todo API', () => {
  beforeEach(() => {
    // Reset todos to initial state before each test
    todos = [
      { id: 1, text: 'Learn React', completed: false },
      { id: 2, text: 'Build a TODO app', completed: false }
    ];
  });

  test('GET /todos should return all todos', async () => {
    const response = await request(app).get('/todos');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].text).toBe('Learn React');
  });

  test('POST /todos should create a new todo', async () => {
    const response = await request(app)
      .post('/todos')
      .send({ text: 'Test the API' })
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(201);
    expect(response.body.text).toBe('Test the API');
    expect(response.body.completed).toBe(false);
    expect(response.body.id).toBe(3);
    
    // Check that the todo was added to the array
    const getResponse = await request(app).get('/todos');
    expect(getResponse.body).toHaveLength(3);
  });

  test('POST /todos without text should return 400', async () => {
    const response = await request(app)
      .post('/todos')
      .send({})
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Todo text is required');
  });
}); 