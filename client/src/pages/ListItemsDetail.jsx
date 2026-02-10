import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';

const apiUrl = import.meta.env.VITE_PUBLIC_API_URL || 'https://to-do-list-p4te.onrender.com';
axios.defaults.withCredentials = true;

function ListItemsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-items/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

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
      if (res.ok) await fetchItems();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // --- NEW: EDIT FUNCTION ---
  const editItem = async (itemId, currentDescription) => {
    const newDescription = prompt("Edit task:", currentDescription);
    if (!newDescription || newDescription === currentDescription) return;

    try {
      const res = await fetch(`${apiUrl}/edit-item/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ description: newDescription }),
      });

      if (res.ok) {
        await fetchItems();
      } else {
        alert("Failed to update task.");
      }
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  // --- NEW: DELETE FUNCTION ---
  const deleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`${apiUrl}/delete-item/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        await fetchItems();
      } else {
        alert("Failed to delete task.");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    if (id) fetchItems();
  }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate("/listitem")} className="mb-4 text-blue-600 font-medium hover:underline">
        ← Back to All Lists
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks for List #{id}</h2>
        <button onClick={addItem} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          + Add Task
        </button>
      </div>

      <ul className="space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No tasks found. Add your first task!</p>
        ) : (
          items.map(item => (
            <li key={item.id} className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center">
              <div>
                <p className="text-gray-800 font-medium">{item.description}</p>
                <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status || 'pending'}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2">
                <button 
                  onClick={() => editItem(item.id, item.description)}
                  className="text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="text-sm bg-gray-100 hover:bg-red-100 hover:text-red-600 px-3 py-1 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ListItemsDetail;