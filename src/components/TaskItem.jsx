// src/components/TaskItem.jsx
import React, { useState } from 'react';

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return task.status === 'pending' && due < today;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 border-l-4 transition-all hover:shadow-lg ${
      task.status === 'completed' 
        ? 'border-green-500 opacity-75' 
        : isOverdue() 
        ? 'border-red-500' 
        : 'border-blue-500'
    }`}>
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`text-xl font-semibold mb-1 ${
            task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
          }`}>
            {task.title}
          </h3>
          
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            getPriorityColor(task.priority)
          }`}>
            {task.priority.toUpperCase()}
          </span>
        </div>

        <div className="ml-3">
          {task.status === 'completed' ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Completed
            </span>
          ) : (
            <span className={`${isOverdue() ? 'bg-red-500' : 'bg-orange-500'} text-white px-3 py-1 rounded-full text-sm font-medium`}>
              {isOverdue() ? 'Overdue' : 'Pending'}
            </span>
          )}
        </div>
      </div>

      <p className={`text-gray-700 mb-4 ${
        task.status === 'completed' ? 'line-through text-gray-500' : ''
      }`}>
        {task.description}
      </p>

      <div className="mb-4">
        <span className="text-sm text-gray-600">
          📅 Due: <span className={isOverdue() ? 'text-red-600 font-semibold' : 'font-medium'}>
            {formatDate(task.dueDate)}
          </span>
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onToggleStatus(task.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            task.status === 'completed'
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {task.status === 'completed' ? '↩ Mark Pending' : '✓ Mark Complete'}
        </button>

        <button
          onClick={() => onEdit(task)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          ✏ Edit
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            🗑 Delete
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                onDelete(task.id);
                setShowDeleteConfirm(false);
              }}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-medium transition-colors"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;