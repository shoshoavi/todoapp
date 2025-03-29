import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../components/TodoList';

describe('TodoList Component', () => {
  test('renders message when no todos', () => {
    render(<TodoList todos={[]} />);
    
    const messageElement = screen.getByText('No todos yet. Add one above!');
    expect(messageElement).toBeInTheDocument();
  });

  test('renders todos when provided', () => {
    const todos = [
      { id: 1, text: 'Test Todo 1', completed: false },
      { id: 2, text: 'Test Todo 2', completed: true }
    ];
    
    render(<TodoList todos={todos} />);
    
    const todo1Element = screen.getByText('Test Todo 1');
    expect(todo1Element).toBeInTheDocument();
    
    const todo2Element = screen.getByText('Test Todo 2');
    expect(todo2Element).toBeInTheDocument();
    
    // Check that the container is a list
    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();
    expect(listElement).toHaveClass('todo-list');
    
    // Check that we have 2 list items
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });
}); 