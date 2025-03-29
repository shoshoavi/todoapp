# Todo App

A simple full-stack TODO application with React frontend and Express backend.

## Features

- View all todos
- Add new todos
- Real-time updates

## Project Structure

- `backend/` - Express server 
- `frontend/` - React client

## Getting Started

### Backend

```bash
cd backend
npm install
npm start
```

The backend server will run on http://localhost:5000.

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend development server will run on http://localhost:3000.

### Running Both Together

To run both frontend and backend simultaneously:

```bash
npm install
npm run install:all
npm start
```

## Testing

This project includes tests for both frontend and backend.

### Running Standard Tests

To run all tests:

```bash
npm test
```

To run only backend tests:

```bash
npm run test:backend
```

To run only frontend tests:

```bash
npm run test:frontend
```

### Running Basic Tests

If you're having issues with the standard tests, you can run simpler basic tests:

```bash
npm run test:basic
```

These basic tests verify that the core functionality is working properly.

## API Endpoints

- `GET /todos` - Get all todos
- `POST /todos` - Create a new todo 