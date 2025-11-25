// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Filter from './components/Filter';
import Search from './components/Search';
import { getTasks, createTask, deleteTask, toggleTaskStatus, updateTask } from './utils/taskStorage';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks on component mount
  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
    setFilteredTasks(loadedTasks);
  }, []);

  // Apply filters and search whenever tasks, filter, or search query changes
  useEffect(() => {
    let result = [...tasks];
    
    // Apply filter first
    if (currentFilter !== 'all') {
      if (currentFilter === 'completed' || currentFilter === 'pending') {
        // Filter by status
        result = result.filter(task => task.status === currentFilter);
      } else if (['high', 'medium', 'low'].includes(currentFilter)) {
        // Filter by priority
        result = result.filter(task => task.priority === currentFilter);
      }
    }
    
    // Then apply search (case-insensitive, partial substring matching)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, currentFilter, searchQuery]);

  // Handle task creation
  const handleCreateTask = (taskData) => {
    const newTask = createTask(taskData);
    setTasks(prev => [...prev, newTask]);
  };

  // Handle task update
  const handleUpdateTask = (taskData) => {
    if (editingTask) {
      const updated = updateTask(editingTask.id, taskData);
      if (updated) {
        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
        setEditingTask(null);
      }
    }
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    const success = deleteTask(taskId);
    if (success) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  // Handle status toggle
  const handleToggleStatus = (taskId) => {
    const updated = toggleTaskStatus(taskId);
    if (updated) {
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    }
  };

  // Handle edit
  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Handle search - useCallback to prevent unnecessary re-renders
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Handle filter change
  const handleFilterChange = (filterId) => {
    setCurrentFilter(filterId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Task Form */}
        <TaskForm 
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          editingTask={editingTask}
          onCancel={handleCancelEdit}
        />

        {/* Search Component */}
        <Search onSearch={handleSearch} />

        {/* Filter Component */}
        <Filter 
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Task List */}
        <TaskList 
          tasks={filteredTasks}
          onEdit={handleEdit}
          onDelete={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />
      </main>
    </div>
  );
}

export default App;