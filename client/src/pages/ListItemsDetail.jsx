import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';

const apiUrl = import.meta.env.VITE_PUBLIC_API_URL || 'https://to-do-list-p4te.onrender.com';
axios.defaults.withCredentials = true;

function ListItemsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  // --- STATE PARA SA MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "add", "edit", "delete"
  const [currentItem, setCurrentItem] = useState({ id: null, description: "" });
  const [inputValue, setInputValue] = useState("");

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

  useEffect(() => {
    if (id) fetchItems();
  }, [id]);

  // --- MODAL HANDLERS ---
  const openModal = (mode, item = { id: null, description: "" }) => {
    setModalMode(mode);
    setCurrentItem(item);
    setInputValue(item.description || "");
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
        await axios.post(`${apiUrl}/add-items`, { list_id: id, description: inputValue });
      } else if (modalMode === "edit") {
        await axios.put(`${apiUrl}/edit-item/${currentItem.id}`, { description: inputValue });
      } else if (modalMode === "delete") {
        await axios.delete(`${apiUrl}/delete-item/${currentItem.id}`);
      }
      fetchItems();
      closeModal();
    } catch (err) {
      console.error(`Error during ${modalMode}:`, err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate("/listitem")} className="mb-4 text-blue-600 font-medium hover:underline flex items-center gap-1">
        ← Back to All Lists
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks for List #{id}</h2>
        <button 
          onClick={() => openModal("add")} 
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
              <div>
                <p className="text-gray-800 font-medium">{item.description}</p>
                <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status || 'pending'}
                </span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => openModal("edit", item)}
                  className="text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => openModal("delete", item)}
                  className="text-sm bg-gray-100 hover:bg-red-100 hover:text-red-600 px-3 py-1 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* --- CUSTOM MODAL UI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl scale-in-center">
            <h3 className="text-xl font-bold mb-4">
              {modalMode === 'delete' ? 'Delete Task' : modalMode === 'edit' ? 'Edit Task' : 'New Task'}
            </h3>
            
            {modalMode === 'delete' ? (
              <p className="text-gray-600 mb-6">Sigurado ka bang buburahin mo ang task na ito?</p>
            ) : (
              <div className="flex flex-col gap-2 mb-6">
                <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ano ang gagawin mo?"
                  className="w-full border-2 rounded-lg p-2 focus:border-blue-500 outline-none transition-all"
                  autoFocus
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAction}
                className={`px-4 py-2 text-white rounded-lg shadow-md transition-all active:scale-95 ${
                  modalMode === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {modalMode === 'delete' ? 'Confirm' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListItemsDetail;