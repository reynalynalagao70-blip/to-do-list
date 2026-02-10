import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2
import Header from "../Components/Header";

const apiUrl = import.meta.env.VITE_PUBLIC_API_URL || 'https://to-do-list-p4te.onrender.com';
axios.defaults.withCredentials = true;

function ListItem() {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  const fetchLists = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-list`, { credentials: "include" });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.success) setLists(data.list);
    } catch (err) {
      console.error("Error fetching lists:", err);
    }
  };

  // --- LOGOUT FUNCTION ---
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: "Sigurado ka bang gusto mong umalis?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!'
    });

    if (result.isConfirmed) {
      try {
        // Pwedeng tawagin ang backend logout endpoint mo rito
        await axios.post(`${apiUrl}/logout`); 
        navigate("/login"); // Balik sa login page
      } catch (err) {
        console.error("Logout error:", err);
        // Kahit may error, i-clear ang local storage at i-redirect
        navigate("/login");
      }
    }
  };

  // --- ADD LIST (Modern Popup) ---
  const addList = async () => {
    const { value: listTitle } = await Swal.fire({
      title: 'New List Title',
      input: 'text',
      inputPlaceholder: 'Enter list title...',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'Kailangan may title!'
      }
    });

    if (listTitle) {
      try {
        const res = await fetch(`${apiUrl}/add-list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ listTitle }),
        });
        if (res.ok) {
          fetchLists();
          Swal.fire('Success!', 'Listahan ay naidagdag na.', 'success');
        }
      } catch (err) {
        Swal.fire('Error', 'Hindi makakonekta sa server', 'error');
      }
    }
  };

  // --- EDIT LIST (Modern Popup) ---
  const editList = async (e, listId, currentTitle) => {
    e.stopPropagation();
    const { value: newTitle } = await Swal.fire({
      title: 'Edit List Title',
      input: 'text',
      inputValue: currentTitle,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'Hindi pwedeng walang title!'
      }
    });

    if (newTitle && newTitle !== currentTitle) {
      try {
        const res = await fetch(`${apiUrl}/edit-list/${listId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ listTitle: newTitle }),
        });
        if (res.ok) fetchLists();
      } catch (err) {
        console.error("Error editing list:", err);
      }
    }
  };

  // --- DELETE LIST (Modern Confirmation) ---
  const deleteList = async (e, listId) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Sigurado ka ba?',
      text: "Mabubura pati ang mga tasks sa loob nito!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oo, bura na!'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${apiUrl}/delete-list/${listId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          fetchLists();
          Swal.fire('Deleted!', 'Ang listahan ay nabura na.', 'success');
        }
      } catch (err) {
        console.error("Error deleting list:", err);
      }
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
          <div className="flex gap-2">
            <button 
              onClick={addList} 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + New List
            </button>
            <button 
              onClick={handleLogout} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {lists.length === 0 ? (
            <p className="text-center text-gray-500">Walang listahan. Mag-add ka na!</p>
          ) : (
            lists.map((list) => (
              <div 
                key={list.id} 
                onClick={() => navigate(`/list/${list.id}`)}
                className="p-5 border-2 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold">{list.title}</h3>
                  <p className="text-sm text-gray-500">View items inside this list →</p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={(e) => editList(e, list.id, list.title)}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => deleteList(e, list.id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ListItem;