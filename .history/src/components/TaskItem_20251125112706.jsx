export default function TaskItem({ task, editTask, deleteTask, toggleStatus }) {
  return (
    <div className="flex justify-between p-2 border rounded mb-2">
      <div>
        <h3 className={`font-bold ${task.status === "Completed" ? "line-through" : ""}`}>{task.title}</h3>
        <p>{task.description}</p>
        <span className="badge">{task.priority}</span> | <span>{task.dueDate}</span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => toggleStatus(task.id)}>{task.status === "Pending" ? "Complete" : "Undo"}</button>
        <button onClick={() => editTask(task)}>Edit</button>
        <button onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    </div>
  );
}
