import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';

// Consistent URL para sa backend
const apiUrl = import.meta.env.VITE_PUBLIC_API_URL || 'https://to-do-list-p4te.onrender.com';
axios.defaults.withCredentials = true;

function ListItemsDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Inayos ang spelling mula 'Usenavigate'
  const [items, setItems] = useState([]);

  // Inayos na fetchItems na may safety check
  const fetchItems = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-items/${id}`, { credentials: "include" });
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  // Inayos na addItem logic
  const addItem = async () => {
    const description = prompt("Enter task:");
    if (!description) return;

    try {
      const res = await fetch(`${apiUrl}/add-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ list_id: id, description }),
      });

      if (res.ok) {
        await fetchItems(); // Refresh ang listahan ng tasks
      } else {
        const errorText = await res.text();
        console.error("Failed to add task:", errorText);
        alert("Hindi makapag-add ng task. Pakisuri ang server.");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Siguraduhing gising ang Render backend.");
    }
  };

  useEffect(() => {
    if (id) fetchItems();
  }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Button papuntang ListItem page */}
      <button 
        onClick={() => navigate("/")} 
        className="mb-4 text-blue-600 font-medium hover:underline"
      >
        ← Back to All Lists
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks for List #{id}</h2>
        <button 
          onClick={addItem} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Add Task
        </button>
      </div>

      <ul className="space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No tasks found. Add your first task!</p>
        ) : (
          items.map(item => (
            <li key={item.id} className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center">
              <span className="text-gray-800">{item.description}</span>
              <span className={`text-xs px-2 py-1 rounded ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {item.status || 'pending'}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ListItemsDetail;