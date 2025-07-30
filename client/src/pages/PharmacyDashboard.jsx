import React, { useEffect, useState } from "react";

export default function PharmacyInventory() {
  const [inventory, setInventory] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const pharmacyEmail = localStorage.getItem("pharmacyEmail");
    if (!pharmacyEmail) return;
    fetch(`https://ieee-l1j7.onrender.com/api/pharmacy/me?email=${encodeURIComponent(pharmacyEmail)}`)
      .then((r) => r.json())
      .then((data) => setInventory(data.inventory || []));
  }, []);

  function handleChange(idx, key, value) {
    setInventory((arr) => {
      const copy = [...arr];
      copy[idx][key] = value;
      return copy;
    });
  }

  function handleAddRow() {
    setInventory((arr) => [...arr, { medicineName: "", stock: 1 }]);
  }

  function handleRemoveRow(idx) {
    setInventory((arr) => arr.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setMsg("");
    const pharmacyEmail = localStorage.getItem("pharmacyEmail");
    try {
      const response = await fetch("https://ieee-l1j7.onrender.com/api/pharmacy/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pharmacyEmail,
          inventory: inventory.filter((row) => row.medicineName),
        }),
      });
      const data = await response.json();
      setMsg(data.message || "Saved!");
      setInventory(data.pharmacy?.inventory || []);
    } catch (e) {
      console.error(e);
      setMsg("Could not save.");
    }
  }

  function handleOutOfStock(idx) {
    handleChange(idx, "stock", 0);
  }

  return (
    <div className="bg-gradient-to-br from-[#0f1d1a] to-[#102d26] rounded-xl p-7 mb-10 border border-[#1e4a3e] shadow-xl">
      <h3 className="text-2xl font-bold mb-5 text-[#a8ffdd]">Set Available Medicines</h3>

      {inventory.map((row, idx) => (
        <div key={idx} className="flex flex-col md:flex-row gap-3 mb-3">
          <input
            type="text"
            placeholder="Medicine Name"
            value={row.medicineName}
            onChange={(e) => handleChange(idx, "medicineName", e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-[#1a2b22] text-[#cfffe6] border border-[#2dd4bf] focus:outline-none focus:ring-2 focus:ring-[#58e490]"
            required
          />
          <input
            type="number"
            min={0}
            placeholder="Stock"
            value={row.stock}
            onChange={(e) => handleChange(idx, "stock", e.target.value)}
            className="w-24 px-4 py-2 rounded-lg bg-[#1a2b22] text-[#cfffe6] border border-[#2dd4bf] focus:outline-none focus:ring-2 focus:ring-[#58e490]"
            required
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleRemoveRow(idx)}
              className="bg-[#522d2d] hover:bg-[#6d3636] text-white px-3 py-2 rounded-lg text-sm"
            >
              Remove
            </button>
            {row.stock > 0 && (
              <button
                type="button"
                onClick={() => handleOutOfStock(idx)}
                className="bg-[#856b14] hover:bg-[#a98b1f] text-white px-3 py-2 rounded-lg text-sm"
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="mt-4 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleAddRow}
          className="bg-[#27c48f] hover:bg-[#1da476] text-white px-6 py-2 rounded-lg font-semibold shadow"
        >
          + Add
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2 rounded-lg font-semibold shadow"
        >
          Save
        </button>
      </div>

      {msg && (
        <div className="mt-3 text-[#9dffce] font-medium">
          {msg}
        </div>
      )}

      {inventory.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xl text-[#a8ffdd] font-semibold mb-3">Current Inventory</h4>
          <ul className="space-y-2">
            {inventory.map((item, i) => (
              <li
                key={`show-${i}`}
                className="bg-[#1a2b22] text-[#defff2] px-4 py-2 rounded-lg flex justify-between"
              >
                <span>{item.medicineName}</span>
                <span>Stock: {item.stock}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
