// src/components/TaskList.jsx
import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onEdit, onDelete, onToggleStatus }) => {
  
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Tasks Found</h3>
        <p className="text-gray-500">Create a new task or adjust your filters!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Showing {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </h2>
      </div>
      
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

export default TaskList;