import React, { useState } from 'react';

function TodoForm({ addTodo }) {
  const [text, setText] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('medium');
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (text.trim()) {
      addTodo(text, notes, priority);
      setText('');
      setNotes('');
      setPriority('medium');
      setShowNotes(false);
    }
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form-main">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo..."
          required
        />
        <select 
          className="todo-form-priority"
          value={priority}
          onChange={handlePriorityChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button 
          type="button" 
          className="notes-toggle"
          onClick={() => setShowNotes(!showNotes)}
        >
          {showNotes ? 'Hide Notes' : 'Add Notes'}
        </button>
        <button type="submit">Add</button>
      </div>

      {showNotes && (
        <div className="todo-form-notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes (optional)..."
            rows={3}
          />
        </div>
      )}
    </form>
  );
}

export default TodoForm; 