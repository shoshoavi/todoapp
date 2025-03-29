const express = require('express');
const cors = require('cors');
const { sequelize, Todo } = require('./models');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    try {
      // Skip verification for empty bodies or specific endpoints
      if (buf.length === 0 || 
          (req.method === 'PUT' && req.originalUrl.includes('/toggle'))) {
        return;
      }
      JSON.parse(buf);
    } catch (e) {
      console.error('Invalid JSON:', e.message);
      console.error('Received body:', buf.toString());
      res.status(400).json({ error: 'Invalid JSON: ' + e.message });
      throw new Error('Invalid JSON');
    }
  }
}));

// Sync database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });

// GET all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll({
      order: [['priority', 'DESC'], ['displayOrder', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// GET color preferences
app.get('/preferences/colors', async (req, res) => {
  try {
    // Get the first todo to extract color preferences
    // If no todos exist, return default colors
    const todo = await Todo.findOne();
    
    if (!todo) {
      return res.json({
        high: '#f44336',
        medium: '#ff9800',
        low: '#8bc34a'
      });
    }
    
    res.json({
      high: todo.highPriorityColor,
      medium: todo.mediumPriorityColor,
      low: todo.lowPriorityColor
    });
  } catch (err) {
    console.error('Error fetching color preferences:', err);
    res.status(500).json({ error: 'Failed to fetch color preferences' });
  }
});

// PUT to update color preferences
app.put('/preferences/colors', async (req, res) => {
  try {
    const { high, medium, low } = req.body;
    
    if (!high || !medium || !low) {
      return res.status(400).json({ error: 'All color values are required' });
    }
    
    // Update colors for all todos
    await Todo.update(
      {
        highPriorityColor: high,
        mediumPriorityColor: medium,
        lowPriorityColor: low
      },
      { where: {} } // Update all records
    );
    
    res.json({ high, medium, low });
  } catch (err) {
    console.error('Error updating color preferences:', err);
    res.status(500).json({ error: 'Failed to update color preferences' });
  }
});

// POST a new todo
app.post('/todos', async (req, res) => {
  try {
    console.log('Received POST request to /todos with body:', req.body);
    const { text, notes, priority = 'medium' } = req.body;
    
    if (!text) {
      console.log('Error: Todo text is required');
      return res.status(400).json({ error: 'Todo text is required' });
    }

    // Get the highest display order and add 1
    const maxOrderTodo = await Todo.findOne({
      order: [['displayOrder', 'DESC']]
    });
    const displayOrder = maxOrderTodo ? maxOrderTodo.displayOrder + 1 : 1;
    console.log('New display order:', displayOrder);
    
    const newTodo = await Todo.create({
      text,
      notes: notes || '',
      completed: false,
      priority,
      displayOrder
    });
    
    console.log('Successfully created new todo:', newTodo.toJSON());
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error creating todo:', err);
    console.error('Error details:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to create todo: ' + err.message });
  }
});

// PUT to update a todo's completion status
app.put('/todos/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    todo.completed = !todo.completed;
    await todo.save();
    
    console.log(`Todo ${id} completion toggled to: ${todo.completed}`);
    res.json(todo);
  } catch (err) {
    console.error('Error toggling todo completion:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// PUT to update a todo's notes
app.put('/todos/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const todo = await Todo.findByPk(id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    todo.notes = notes;
    await todo.save();
    
    res.json(todo);
  } catch (err) {
    console.error('Error updating todo notes:', err);
    res.status(500).json({ error: 'Failed to update notes' });
  }
});

// PUT to update a todo's priority
app.put('/todos/:id/priority', async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    
    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be low, medium, or high' });
    }
    
    const todo = await Todo.findByPk(id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    todo.priority = priority;
    await todo.save();
    
    res.json(todo);
  } catch (err) {
    console.error('Error updating todo priority:', err);
    res.status(500).json({ error: 'Failed to update priority' });
  }
});

// PUT to update a todo's display order
app.put('/todos/reorder', async (req, res) => {
  try {
    const { orderedIds } = req.body;
    
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array' });
    }
    
    // Update each todo's display order
    for (let i = 0; i < orderedIds.length; i++) {
      await Todo.update(
        { displayOrder: i + 1 },
        { where: { id: orderedIds[i] } }
      );
    }
    
    // Get all todos with updated order
    const todos = await Todo.findAll({
      order: [['priority', 'DESC'], ['displayOrder', 'ASC'], ['createdAt', 'DESC']]
    });
    
    res.json(todos);
  } catch (err) {
    console.error('Error reordering todos:', err);
    res.status(500).json({ error: 'Failed to reorder todos' });
  }
});

// DELETE a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    await todo.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 