// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Filter from './components/Filter';
import Search from './components/Search';
import EmailStatus from './components/EmailStatus';
import useTaskScheduler from './hooks/useTaskScheduler';
import { getTasks, createTask, deleteTask, toggleTaskStatus, updateTask } from './utils/taskStorage';
import './App.css';

function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Task management state
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // ✅ Email notification state
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);

  // Get user email from session
  const getUserEmail = () => {
    const user = sessionStorage.getItem('nelo_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.email;
    }
    return 'User';
  };

  // ✅ Task scheduler hook - sends emails every 20 minutes
  const { lastEmailSent, emailStatus, nextEmailIn } = useTaskScheduler(
    tasks,
    getUserEmail(),
    isLoggedIn && emailNotificationsEnabled
  );

  // Check if user is already logged in (session storage check)
  useEffect(() => {
    const checkAuth = () => {
      const user = sessionStorage.getItem('nelo_user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.loggedIn) {
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          sessionStorage.removeItem('nelo_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Load tasks when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      const loadedTasks = getTasks();
      setTasks(loadedTasks);
      setFilteredTasks(loadedTasks);
    }
  }, [isLoggedIn]);

  // Apply filters and search
  useEffect(() => {
    let result = [...tasks];
    
    // Apply filter
    if (currentFilter !== 'all') {
      if (currentFilter === 'completed' || currentFilter === 'pending') {
        result = result.filter(task => task.status === currentFilter);
      } else if (['high', 'medium', 'low'].includes(currentFilter)) {
        result = result.filter(task => task.priority === currentFilter);
      }
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, currentFilter, searchQuery]);

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('nelo_user');
    setIsLoggedIn(false);
    // Reset task state
    setTasks([]);
    setFilteredTasks([]);
    setCurrentFilter('all');
    setSearchQuery('');
    setEditingTask(null);
  };

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

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Handle filter change
  const handleFilterChange = (filterId) => {
    setCurrentFilter(filterId);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">🥬</div>
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
          <p className="text-white text-xl mt-4 font-semibold">Loading NELO...</p>
        </div>
      </div>
    );
  }

  // Show Login or Dashboard based on authentication
  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="min-h-screen bg-gray-100">
          {/* Header */}
          <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-4xl mr-3">🥬</span>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">NELO Task Manager</h1>
                    <p className="text-sm text-gray-600">Fresh vegetables & task management</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Logged in as</p>
                    <p className="font-semibold text-gray-800">{getUserEmail()}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
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

            {/* Email Status Component */}
            <EmailStatus 
              emailStatus={emailStatus}
              lastEmailSent={lastEmailSent}
              nextEmailIn={nextEmailIn}
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
      )}
    </div>
  );
}

export default App;
