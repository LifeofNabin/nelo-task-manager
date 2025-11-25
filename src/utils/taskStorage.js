// src/utils/taskStorage.js
const TASKS_KEY = 'nelo_tasks';

export const getTasks = () => {
  try {
    const tasks = localStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const createTask = (taskData) => {
  const tasks = getTasks();
  const newTask = {
    id: Date.now().toString(),
    ...taskData,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const updateTask = (id, updates) => {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === id);
  
  if (index === -1) return null;
  
  tasks[index] = { ...tasks[index], ...updates };
  saveTasks(tasks);
  return tasks[index];
};

export const deleteTask = (id) => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  
  if (filteredTasks.length === tasks.length) return false;
  
  saveTasks(filteredTasks);
  return true;
};

export const toggleTaskStatus = (id) => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  
  if (!task) return null;
  
  const newStatus = task.status === 'completed' ? 'pending' : 'completed';
  return updateTask(id, { status: newStatus });
};

export const getPendingTasks = () => {
  const tasks = getTasks();
  return tasks.filter(task => task.status === 'pending');
};