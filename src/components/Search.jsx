// src/components/Search.jsx
import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounce search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 800);

  // Effect to trigger search when debounced value changes
  useEffect(() => {
    setIsSearching(false);
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  // Handle input change
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    onSearch('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Search Tasks</h3>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 text-xl">🔍</span>
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search tasks by title or description..."
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute inset-y-0 right-12 flex items-center">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <span className="text-xl">✕</span>
          </button>
        )}
      </div>
      
      {/* Search info */}
      {debouncedSearchTerm && (
        <p className="text-sm text-gray-600 mt-2">
          Searching for: <span className="font-semibold">"{debouncedSearchTerm}"</span>
        </p>
      )}
    </div>
  );
};

export default Search;