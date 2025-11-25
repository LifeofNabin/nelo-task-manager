import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { getTasks, createTask, deleteTask, toggleTaskStatus } from './utils/taskStorage';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  const handleCreateTask = (taskData) => {
    const newTask = createTask(taskData);
    setTasks(prev => [...prev, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    const success = deleteTask(taskId);
    if (success) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const handleToggleStatus = (taskId) => {
    const updated = toggleTaskStatus(taskId);
    if (updated) {
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <span className="text-4xl mr-3">🥬</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NELO Task Manager</h1>
              <p className="text-sm text-gray-600">Fresh vegetables & task management</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <TaskForm onSubmit={handleCreateTask} />
        <TaskList 
          tasks={tasks}
          onDelete={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />
      </main>
    </div>
  );
}

export default App;