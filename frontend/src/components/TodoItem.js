import React, { useState } from 'react';

function TodoItem({ todo, onToggleComplete, onUpdateNotes, onUpdatePriority, onDelete, colorPrefs, position }) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(todo.notes || '');

  const handleToggle = () => {
    onToggleComplete(todo.id);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleSubmitNotes = () => {
    onUpdateNotes(todo.id, notes);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitNotes();
    }
  };

  const handlePriorityChange = (e) => {
    onUpdatePriority(todo.id, e.target.value);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo.id);
    }
  };

  // Get the color for the current priority from props
  const getPriorityColor = () => {
    if (colorPrefs && todo.priority) {
      return colorPrefs[todo.priority] || getPriorityDefaultColor();
    }
    return getPriorityDefaultColor();
  };

  // Fallback colors if colorPrefs is not available
  const getPriorityDefaultColor = () => {
    const defaultColors = {
      low: '#8bc34a',
      medium: '#ff9800',
      high: '#f44336'
    };
    return defaultColors[todo.priority] || defaultColors.medium;
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`} style={{ borderLeftColor: getPriorityColor() }}>
      <div className="todo-position">{position}</div>
      <div className="todo-priority-indicator" style={{ backgroundColor: getPriorityColor() }}></div>
      <div className="todo-content">
        <button 
          type="button"
          className={`todo-toggle ${todo.completed ? 'completed' : ''}`}
          onClick={handleToggle}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.completed ? '✓' : ' '}
        </button>
        
        <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
          {todo.text}
        </span>

        <div className="todo-actions">
          <select 
            className="todo-priority-select"
            value={todo.priority}
            onChange={handlePriorityChange}
            aria-label="Set priority"
            style={{ 
              borderColor: getPriorityColor(),
              color: getPriorityColor()
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          
          <button 
            type="button"
            className="todo-notes-btn"
            onClick={() => setIsEditing(!isEditing)}
            aria-label={isEditing ? "Hide notes" : "Show notes"}
          >
            {isEditing ? "Hide Notes" : "Notes"}
          </button>
          
          <button 
            type="button"
            className="todo-delete-btn"
            onClick={handleDelete}
            aria-label="Delete todo"
          >
            Delete
          </button>
        </div>
      </div>
      
      {isEditing && (
        <div className="todo-notes-container">
          <textarea
            className="todo-notes"
            value={notes}
            onChange={handleNotesChange}
            onKeyDown={handleKeyDown}
            placeholder="Add notes here..."
            rows={3}
          />
          <button 
            type="button"
            className="todo-notes-save"
            onClick={handleSubmitNotes}
          >
            Save Notes
          </button>
        </div>
      )}
    </li>
  );
}

export default TodoItem; 