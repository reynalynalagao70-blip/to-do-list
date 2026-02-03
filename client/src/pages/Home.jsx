import { useState } from "react";
import Header from "../Components/Header";

function Home() {
  const [items, setItems] = useState([
    { id: 1, title: "Learn React" },
    { id: 2, title: "Study Tailwind" },
  ]);

  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  const handleAdd = () => {
    if (!title) return;

    if (editId) {
      setItems(
        items.map((item) =>
          item.id === editId ? { ...item, title } : item
        )
      );
      setEditId(null);
    } else {
      setItems([...items, { id: Date.now(), title }]);
    }

    setTitle("");
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <>
      <Header />

      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">List Table</h2>

        {/* Add / Edit Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="border px-3 py-2 flex-1 rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-red-600 text-white px-4 rounded hover:bg-red-700"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* Table */}
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border p-2 text-center">{item.id}</td>
                <td className="border p-2">{item.title}</td>
                <td className="border p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Home;
