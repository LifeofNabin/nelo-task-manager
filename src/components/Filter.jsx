// src/components/Filter.jsx
import React from 'react';

const Filter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Tasks', icon: '📋' },
    { id: 'completed', label: 'Completed', icon: '✅' },
    { id: 'pending', label: 'Pending', icon: '⏳' },
    { id: 'high', label: 'High Priority', icon: '🔴' },
    { id: 'medium', label: 'Medium Priority', icon: '🟡' },
    { id: 'low', label: 'Low Priority', icon: '🟢' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter Tasks</h3>
      
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentFilter === filter.id
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filter;