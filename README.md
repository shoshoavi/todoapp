# Todo App

A full-stack Todo application with modern features and a clean UI.

## Features

- Add, edit, and delete tasks
- Add notes to tasks
- Priority levels (low, medium, high) with color indicators
- Drag and drop functionality for reordering tasks
- Custom color preferences for priority levels
- Position numbering for tasks
- Automatic sorting by priority

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: SQLite with Sequelize ORM

## Installation

1. Clone this repository:
```
git clone https://github.com/shoshoavi/todoapp.git
cd todoapp
```

2. Install dependencies:
```
npm install
```

3. Start the application:
```
npm start
```

This will start both the backend server (on port 5000) and the frontend development server (on port 3000).

## API Endpoints

- `GET /todos` - Get all todos
- `POST /todos` - Create a new todo
- `PUT /todos/:id/toggle` - Toggle completion status
- `PUT /todos/:id/notes` - Update notes
- `PUT /todos/:id/priority` - Update priority
- `DELETE /todos/:id` - Delete a todo
- `PUT /todos/reorder` - Reorder todos
- `GET /preferences/colors` - Get color preferences
- `PUT /preferences/colors` - Update color preferences

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Add new tasks using the form at the top
3. Click the checkmark to toggle completion
4. Use the dropdown to change priority
5. Click "Notes" to add additional information
6. Drag and drop to reorder tasks
7. Click "Color Settings" to customize priority colors

## License

MIT 