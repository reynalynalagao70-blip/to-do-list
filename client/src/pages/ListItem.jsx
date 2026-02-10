import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

// Fallsback sa Render URL kung sakaling hindi mabasa ang .env
const apiUrl = import.meta.env.VITE_PUBLIC_API_URL || 'https://to-do-list-p4te.onrender.com';

axios.defaults.withCredentials = true;

function ListItem() {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  // Inayos na fetchLists para may error handling
  const fetchLists = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-list`, { credentials: "include" });
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setLists(data.list);
      }
    } catch (err) {
      console.error("Error fetching lists:", err);
    }
  };

  // Inayos na addList na may validation at refresh logic
  const addList = async () => {
    const listTitle = prompt("Enter list title:");
    if (!listTitle) return;

    try {
      const res = await fetch(`${apiUrl}/add-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ listTitle }),
      });

      if (res.ok) {
        // Hintayin nating matapos ang fetch bago mag-update ang UI
        await fetchLists(); 
      } else {
        const errorData = await res.text();
        console.error("Failed to add list. Server response:", errorData);
        alert("Hindi makapag-add sa ngayon. Check server console.");
      }
    } catch (err) {
      console.error("Error connecting to server:", err);
      alert("Network error. Siguraduhing gising ang Render backend mo.");
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <>
      <Header />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">My To-Do Lists</h2>
          <button 
            onClick={addList} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + New List
          </button>
        </div>

        <div className="grid gap-4">
          {lists.length === 0 ? (
            <p className="text-center text-gray-500">Walang listahan. Mag-add ka na!</p>
          ) : (
            lists.map((list) => (
              <div 
                key={list.id} 
                onClick={() => navigate(`/list/${list.id}`)}
                className="p-5 border-2 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <h3 className="text-xl font-bold">{list.title}</h3>
                <p className="text-sm text-gray-500">View items inside this list →</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ListItem;