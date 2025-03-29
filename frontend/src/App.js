import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import ColorSettings from './components/ColorSettings';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showColorSettings, setShowColorSettings] = useState(false);
  const [colorPrefs, setColorPrefs] = useState({
    high: '#f44336',
    medium: '#ff9800',
    low: '#8bc34a'
  });

  useEffect(() => {
    Promise.all([fetchTodos(), fetchColorPreferences()]);
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/todos');
      
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchColorPreferences = async () => {
    try {
      const response = await fetch('http://localhost:5000/preferences/colors');
      
      if (!response.ok) {
        throw new Error('Failed to fetch color preferences');
      }
      
      const data = await response.json();
      setColorPrefs(data);
    } catch (err) {
      console.error('Error fetching color preferences:', err);
      // Fall back to defaults (already set in state)
    }
  };

  const updateColorPreferences = async (newColors) => {
    try {
      const response = await fetch('http://localhost:5000/preferences/colors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newColors)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update color preferences');
      }
      
      setColorPrefs(newColors);
    } catch (err) {
      setError(err.message);
    }
  };

  const addTodo = async (text, notes = '', priority = 'medium') => {
    try {
      console.log('Adding todo:', { text, notes, priority });
      
      const response = await fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, notes, priority })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to add todo: ${errorData.error || response.statusText}`);
      }
      
      const newTodo = await response.json();
      console.log('New todo added:', newTodo);
      setTodos([newTodo, ...todos]);
    } catch (err) {
      console.error('Error in addTodo:', err);
      setError(err.message);
    }
  };

  const toggleComplete = async (id) => {
    try {
      console.log('Toggling completion for todo id:', id);
      
      const response = await fetch(`http://localhost:5000/todos/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Toggle response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update todo: ${errorText || response.statusText}`);
      }
      
      const updatedTodo = await response.json();
      console.log('Todo updated successfully:', updatedTodo);
      
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      setError(null);
    } catch (err) {
      console.error('Error in toggleComplete:', err);
      setError(err.message);
    }
  };

  const updateNotes = async (id, notes) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update notes');
      }
      
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePriority = async (id, priority) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}/priority`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priority })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update priority');
      }
      
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const reorderTodos = async (orderedIds) => {
    try {
      const response = await fetch('http://localhost:5000/todos/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderedIds })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reorder todos');
      }
      
      const updatedTodos = await response.json();
      setTodos(updatedTodos);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
        <button 
          className="color-settings-btn"
          onClick={() => setShowColorSettings(!showColorSettings)}
        >
          {showColorSettings ? 'Hide Color Settings' : 'Customize Colors'}
        </button>
      </header>
      
      {showColorSettings && (
        <ColorSettings 
          colorPrefs={colorPrefs} 
          updateColorPreferences={updateColorPreferences}
        />
      )}
      
      <TodoForm addTodo={addTodo} />
      
      {loading ? (
        <p>Loading todos...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : (
        <TodoList 
          todos={todos} 
          onToggleComplete={toggleComplete}
          onUpdateNotes={updateNotes}
          onUpdatePriority={updatePriority}
          onDelete={deleteTodo}
          onReorder={reorderTodos}
          colorPrefs={colorPrefs}
        />
      )}
    </div>
  );
}

export default App; 