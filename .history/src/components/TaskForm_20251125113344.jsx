import { useState } from "react";

export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if(!title || !description || !dueDate) return alert("Fill all required fields");
    addTask({ title, description, priority, dueDate, status:"Pending", id: Date.now() });
    setTitle(""); setDescription(""); setPriority("Medium"); setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow flex flex-col gap-2 w-full md:w-80">
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="border p-2"/>
      <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} className="border p-2"/>
      <select value={priority} onChange={e=>setPriority(e.target.value)} className="border p-2">
        <option>High</option><option>Medium</option><option>Low</option>
      </select>
      <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="border p-2"/>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">Add Task</button>
    </form>
  );
}
