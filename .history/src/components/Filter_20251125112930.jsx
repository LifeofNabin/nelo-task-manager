export default function Filter({ filter, setFilter }) {
  return (
    <div className="flex gap-2">
      {["All","Pending","Completed","High","Medium","Low"].map(f => (
        <button key={f} className={`p-1 px-3 rounded ${filter===f?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setFilter(f)}>{f}</button>
      ))}
    </div>
  );
}
