import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the fetch function to avoid actual API calls
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    fetch.mockReset();
  });

  test('renders app title', async () => {
    // Mock successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ id: 1, text: 'Test Todo', completed: false }])
    });
    
    // Render the component (act is imported automatically with newer versions)
    render(<App />);
    
    const titleElement = screen.getByText('Todo App');
    expect(titleElement).toBeInTheDocument();
  });

  test('shows loading state initially', async () => {
    // Mock a pending promise that doesn't resolve immediately
    fetch.mockImplementationOnce(() => new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: async () => ([])
        });
      }, 100);
    }));
    
    render(<App />);
    
    // Check for loading state
    const loadingElement = screen.getByText('Loading todos...');
    expect(loadingElement).toBeInTheDocument();
  });

  test('shows error when fetch fails', async () => {
    // Mock failed fetch
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    
    render(<App />);
    
    // Wait for the error to appear
    await waitFor(() => {
      const errorElement = screen.getByText(/Error: Failed to fetch/);
      expect(errorElement).toBeInTheDocument();
    });
  });
}); 