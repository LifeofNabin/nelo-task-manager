import { useState } from "react";

export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!title || !description || !dueDate) return alert("Please fill all fields");
    addTask({ title, description, priority, dueDate, status: "Pending", id: Date.now() });
    setTitle(""); setDescription(""); setPriority("Medium"); setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border rounded">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2"/>
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2"/>
      <select value={priority} onChange={e => setPriority(e.target.value)} className="border p-2">
        <option>High</option><option>Medium</option><option>Low</option>
      </select>
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="border p-2"/>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Task</button>
    </form>
  );
}
