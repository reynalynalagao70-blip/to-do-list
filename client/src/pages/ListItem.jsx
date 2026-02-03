import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

function ListItem() {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  const fetchLists = async () => {
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/get-list`, { credentials: "include" });
    const data = await res.json();
    if (data.success) setLists(data.list);
  };

  const addList = async () => {
    const listTitle = prompt("Enter list title:");
    if (!listTitle) return;
    await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/add-list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ listTitle }),
    });
    fetchLists();
  };

  useEffect(() => { fetchLists(); }, []);

  return (
    <>
      <Header />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">My To-Do Lists</h2>
          <button onClick={addList} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ New List</button>
        </div>
        <div className="grid gap-4">
          {lists.map((list) => (
            <div 
              key={list.id} 
              onClick={() => navigate(`/list/${list.id}`)}
              className="p-5 border-2 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <h3 className="text-xl font-bold">{list.title}</h3>
              <p className="text-sm text-gray-500">View items inside this list →</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default ListItem;