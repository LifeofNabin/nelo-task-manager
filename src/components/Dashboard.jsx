import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import Filter from "./Filter";
import Search from "./Search";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const addTask = task => setTasks(prev => [...prev, task]);
  const deleteTask = id => { if(window.confirm("Delete?")) setTasks(prev => prev.filter(t=>t.id!==id)); };
  const toggleStatus = id => { setTasks(prev => prev.map(t=>t.id===id?{...t,status:t.status==="Pending"?"Completed":"Pending"}:t)); };
  const editTask = updatedTask => setTasks(prev => prev.map(t=>t.id===updatedTask.id?updatedTask:t));

  useEffect(()=>{
    const interval = setInterval(()=>{
      const pending = tasks.filter(t=>t.status==="Pending");
      if(pending.length) console.log("Mock Email:", pending);
    }, 1200000);
    return ()=>clearInterval(interval);
  }, [tasks]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <TaskForm addTask={addTask} />
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <Filter filter={filter} setFilter={setFilter}/>
            <Search search={search} setSearch={setSearch}/>
          </div>
          <TaskList tasks={tasks} filter={filter} search={search} editTask={editTask} deleteTask={deleteTask} toggleStatus={toggleStatus}/>
        </div>
      </div>
    </div>
  );
}
