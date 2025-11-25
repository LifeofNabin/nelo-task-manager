export default function Search({ search, setSearch }) {
  return (
    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..." className="border p-2 rounded w-64"/>
  );
}
