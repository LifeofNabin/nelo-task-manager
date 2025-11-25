export default function TaskItem({ task, editTask, deleteTask, toggleStatus }) {
  return (
    <div className="flex justify-between p-3 border rounded mb-2">
      <div>
        <h3 className={`font-bold ${task.status==="Completed" ? "line-through" : ""}`}>{task.title}</h3>
        <p>{task.description}</p>
        <span className="px-2 py-1 rounded bg-gray-200 mr-2">{task.priority}</span>
        <span>{task.dueDate}</span>
      </div>
      <div className="flex gap-2">
        <button onClick={()=>toggleStatus(task.id)} className="bg-green-200 p-1 rounded">{task.status==="Pending"?"Complete":"Undo"}</button>
        <button onClick={()=>editTask({...task, title: prompt("Edit title", task.title)})} className="bg-yellow-200 p-1 rounded">Edit</button>
        <button onClick={()=>deleteTask(task.id)} className="bg-red-200 p-1 rounded">Delete</button>
      </div>
    </div>
  );
}
