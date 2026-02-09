import {useParams, useLocation, Usenavigate} from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';

const API = 'https://to-do-list-p4te.onrender.com';
axios.defaults.withCredentials = true;

function ListItemsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/get-items/${id}`, { credentials: "include" });
    const data = await res.json();
    if (data.success) setItems(data.items);
  };

  const addItem = async () => {
    const description = prompt("Enter task:");
    if (!description) return;
    await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/add-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ list_id: id, description }),
    });
    fetchItems();
  };

  useEffect(() => { fetchItems(); }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate("/lists")} className="mb-4 text-blue-600 font-medium">← Back to All Lists</button>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks for List #{id}</h2>
        <button onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add Task</button>
      </div>
      <ul className="space-y-3">
        {items.length === 0 ? <p className="text-gray-500 text-center">No tasks found.</p> : 
          items.map(item => (
            <li key={item.id} className="p-4 border rounded-lg bg-white shadow-sm flex justify-between">
              <span>{item.description}</span>
              <span className="text-xs bg-yellow-100 px-2 py-1 rounded">{item.status}</span>
            </li>
          ))
        }
      </ul>
    </div>
  );
}
export default ListItemsDetail;