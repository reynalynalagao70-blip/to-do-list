import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const apiUrl = import.meta.env.VITE_PUBLIC_API_URL || 'https://to-do-list-p4te.onrender.com';
axios.defaults.withCredentials = true;

function ListItem() {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();
  
  // --- STATE PARA SA MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "add", "edit", or "delete"
  const [currentList, setCurrentList] = useState({ id: null, title: "" });
  const [inputValue, setInputValue] = useState("");

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

  useEffect(() => {
    fetchLists();
  }, []);

  // --- MODAL HANDLERS ---
  const openModal = (mode, list = { id: null, title: "" }) => {
    setModalMode(mode);
    setCurrentList(list);
    setInputValue(list.title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInputValue("");
  };

  const handleAction = async () => {
    if ((modalMode === "add" || modalMode === "edit") && !inputValue.trim()) return;

    try {
      if (modalMode === "add") {
        await axios.post(`${apiUrl}/add-list`, { listTitle: inputValue });
      } else if (modalMode === "edit") {
        await axios.put(`${apiUrl}/edit-list/${currentList.id}`, { listTitle: inputValue });
      } else if (modalMode === "delete") {
        await axios.delete(`${apiUrl}/delete-list/${currentList.id}`);
      }
      fetchLists();
      closeModal();
    } catch (err) {
      console.error(`Error during ${modalMode}:`, err);
    }
  };

  const handleLogout = () => {
    // Simpleng logout logic
    navigate("/login");
  };

  return (
    <>
      <Header />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">My To-Do Lists</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => openModal("add")} 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + New List
            </button>
            <button 
              onClick={handleLogout} 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
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
                    onClick={(e) => { e.stopPropagation(); openModal("edit", list); }}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); openModal("delete", list); }}
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

      {/* --- CUSTOM MODAL UI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 capitalize">
              {modalMode === 'delete' ? 'Confirm Delete' : `${modalMode} List`}
            </h3>
            
            {modalMode === 'delete' ? (
              <p className="text-gray-600 mb-6">Sigurado ka bang buburahin mo ang "{currentList.title}"?</p>
            ) : (
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter list title..."
                className="w-full border-2 rounded-lg p-2 mb-6 focus:border-blue-500 outline-none"
                autoFocus
              />
            )}

            <div className="flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleAction}
                className={`px-4 py-2 text-white rounded-lg ${modalMode === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {modalMode === 'delete' ? 'Delete' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListItem;