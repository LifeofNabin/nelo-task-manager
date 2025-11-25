// src/components/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Filter from './Filter';
import Search from './Search';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  toggleTaskStatus,
  getPendingTasks 
} from '../utils/taskStorage';

const Dashboard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [emailLogs, setEmailLogs] = useState([]);

  // Load tasks on component mount
  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
    setFilteredTasks(loadedTasks);
  }, []);

  // Email notification function (simulated cron job)
  const sendEmailNotifications = useCallback(() => {
    const pendingTasks = getPendingTasks();
    
    if (pendingTasks.length > 0) {
      const timestamp = new Date().toLocaleString();
      const logMessage = `[${timestamp}] Email sent: ${pendingTasks.length} pending task(s) notification`;
      
      console.log('=== TASK EMAIL NOTIFICATION ===');
      console.log(`Time: ${timestamp}`);
      console.log(`Pending Tasks: ${pendingTasks.length}`);
      pendingTasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title} (Due: ${task.dueDate})`);
      });
      console.log('================================');
      
      setEmailLogs(prev => [...prev, logMessage].slice(-5)); // Keep last 5 logs
    }
  }, []);

  // Set up email automation (every 20 minutes)
  useEffect(() => {
    // Send immediately on mount
    sendEmailNotifications();
    
    // Set interval for 20 minutes (1200000 ms)
    // For demo purposes, using 20 seconds instead
    const interval = setInterval(() => {
      sendEmailNotifications();
    }, 20000); // Change to 1200000 for 20 minutes in production
    
    return () => clearInterval(interval);
  }, [sendEmailNotifications]);

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
    
    // Apply search (case-insensitive, partial substring matching)
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

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Get user info
  const getUserEmail = () => {
    const user = sessionStorage.getItem('nelo_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.email;
    }
    return 'User';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-4xl mr-3">🥬</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NELO Task Manager</h1>
                <p className="text-sm text-gray-600">Fresh approach to task management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-800">{getUserEmail()}</p>
              </div>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Task Form */}
        <TaskForm 
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          editingTask={editingTask}
          onCancel={handleCancelEdit}
        />

        {/* Search */}
        <Search onSearch={handleSearch} />

        {/* Filter */}
        <Filter 
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />

        {/* Email Notification Logs */}
        {emailLogs.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              📧 Email Notification Logs (Last 5)
            </h3>
            <div className="space-y-1">
              {emailLogs.map((log, index) => (
                <p key={index} className="text-xs text-blue-700 font-mono">{log}</p>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-2 italic">
              * Automated notifications run every 20 seconds (demo mode)
            </p>
          </div>
        )}

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
};

export default Dashboard;