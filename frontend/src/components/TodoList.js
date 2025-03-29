import React, { useState } from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, onToggleComplete, onUpdateNotes, onUpdatePriority, onDelete, onReorder, colorPrefs }) {
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  if (todos.length === 0) {
    return <p>No todos yet. Add one above!</p>;
  }

  const handleDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    
    // For Firefox compatibility
    if (e.dataTransfer.setDragImage) {
      const dragElement = document.getElementById(`todo-${id}`);
      if (dragElement) {
        // Create a slightly transparent clone of the element
        const rect = dragElement.getBoundingClientRect();
        const ghostElement = dragElement.cloneNode(true);
        
        ghostElement.style.position = 'absolute';
        ghostElement.style.top = '-1000px';
        ghostElement.style.opacity = '0.7';
        ghostElement.style.width = `${rect.width}px`;
        
        document.body.appendChild(ghostElement);
        e.dataTransfer.setDragImage(ghostElement, 0, 0);
        
        // Clean up the ghost element after drag starts
        setTimeout(() => {
          document.body.removeChild(ghostElement);
        }, 0);
      }
    }
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(id);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    setDragOverId(null);
    
    if (dragId === targetId) {
      return;
    }

    // Get the current order of todos
    const todoIds = todos.map(todo => todo.id);
    
    // Find the positions
    const sourceIndex = todoIds.indexOf(dragId);
    const targetIndex = todoIds.indexOf(targetId);
    
    // Reorder the array
    const reordered = [...todoIds];
    reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, dragId);
    
    // Call the reorder function with the new order
    onReorder(reordered);
  };

  // Helper function to get default colors
  const getDefaultColor = (priority) => {
    const defaultColors = {
      low: '#8bc34a',
      medium: '#ff9800',
      high: '#f44336'
    };
    return defaultColors[priority] || defaultColors.medium;
  };

  // Group todos by priority
  const priorityGroups = {
    high: todos.filter(todo => todo.priority === 'high'),
    medium: todos.filter(todo => todo.priority === 'medium'),
    low: todos.filter(todo => todo.priority === 'low')
  };

  // Render todos by priority group
  const renderTodosByPriority = (priorityTodos, priorityLabel) => {
    if (priorityTodos.length === 0) return null;
    
    const priorityKey = priorityLabel.toLowerCase();
    const priorityColor = colorPrefs && colorPrefs[priorityKey] ? colorPrefs[priorityKey] : getDefaultColor(priorityKey);
    
    return (
      <div className="todo-priority-group" key={priorityLabel}>
        <h3 className="todo-priority-heading" style={{ 
          color: priorityColor
        }}>
          {priorityLabel} ({priorityTodos.length})
        </h3>
        {priorityTodos.map((todo, index) => (
          <div 
            id={`todo-${todo.id}`}
            key={todo.id}
            draggable
            onDragStart={(e) => handleDragStart(e, todo.id)}
            onDragOver={(e) => handleDragOver(e, todo.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, todo.id)}
            className={`todo-draggable ${dragOverId === todo.id ? 'drag-over' : ''}`}
          >
            <TodoItem 
              todo={todo} 
              onToggleComplete={onToggleComplete}
              onUpdateNotes={onUpdateNotes}
              onUpdatePriority={onUpdatePriority}
              onDelete={onDelete}
              colorPrefs={colorPrefs}
              position={index + 1}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="todo-list-container">
      <div className="todo-list-instructions">
        <p>Drag and drop items to reorder. Priority groups are sorted automatically.</p>
      </div>
      <ul className="todo-list">
        {renderTodosByPriority(priorityGroups.high, 'High')}
        {renderTodosByPriority(priorityGroups.medium, 'Medium')}
        {renderTodosByPriority(priorityGroups.low, 'Low')}
      </ul>
    </div>
  );
}

export default TodoList; 