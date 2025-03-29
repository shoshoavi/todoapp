import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoForm from '../components/TodoForm';

describe('TodoForm Component', () => {
  test('renders input field and button', () => {
    render(<TodoForm addTodo={() => {}} />);
    
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    expect(inputElement).toBeInTheDocument();
    
    const buttonElement = screen.getByText('Add');
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls addTodo when form is submitted with text', () => {
    const mockAddTodo = jest.fn();
    render(<TodoForm addTodo={mockAddTodo} />);
    
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const buttonElement = screen.getByText('Add');
    
    // Type in the input
    fireEvent.change(inputElement, { target: { value: 'Test Todo' } });
    
    // Submit the form
    fireEvent.click(buttonElement);
    
    // Check if addTodo was called with the correct text
    expect(mockAddTodo).toHaveBeenCalledWith('Test Todo');
    
    // Check if input was cleared
    expect(inputElement.value).toBe('');
  });

  test('does not call addTodo when form is submitted with empty text', () => {
    const mockAddTodo = jest.fn();
    render(<TodoForm addTodo={mockAddTodo} />);
    
    const buttonElement = screen.getByText('Add');
    
    // Submit the form without typing anything
    fireEvent.click(buttonElement);
    
    // Check that addTodo was not called
    expect(mockAddTodo).not.toHaveBeenCalled();
  });
}); 