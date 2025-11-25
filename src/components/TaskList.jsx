import TaskItem from "./TaskItem";
import useDebounce from "../hooks/useDebounce";

export default function TaskList({ tasks, filter, search, editTask, deleteTask, toggleStatus }) {
  const debouncedSearch = useDebounce(search, 500);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesFilter = filter === "All" || task.status === filter || task.priority === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {filteredTasks.length === 0 ? <p>No tasks found</p> : filteredTasks.map(task => (
        <TaskItem key={task.id} task={task} editTask={editTask} deleteTask={deleteTask} toggleStatus={toggleStatus} />
      ))}
    </div>
  );
}
