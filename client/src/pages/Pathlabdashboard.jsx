import React, { useEffect, useState } from "react";

export default function PathlabDashboard() {
  const [tests, setTests] = useState([{ testName: "", available: true }]);
  const [savedTests, setSavedTests] = useState([]);
  const [message, setMessage] = useState("");
  const email = localStorage.getItem("pathlabEmail");

  useEffect(() => {
    if (!email) {
      setMessage("Email not found. Please login again.");
      return;
    }

    fetch(`http://localhost:5000/api/pathlab/me?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        const serverTests = Array.isArray(data.tests) ? data.tests : [];
        setSavedTests(serverTests);
        setTests(serverTests.length > 0 ? serverTests : [{ testName: "", available: true }]);
      })
      .catch(() => setMessage("Failed to load tests. Please try again."));
  }, [email]);

  const handleChange = (index, field, value) => {
    setTests((prevTests) =>
      prevTests.map((test, i) =>
        i === index ? { ...test, [field]: value } : test
      )
    );
  };

  const handleAddTest = () => {
    setTests([...tests, { testName: "", available: true }]);
  };

  const handleRemoveTest = (index) => {
    setTests((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!email) {
      setMessage("Email missing. Please log in again.");
      return;
    }

    const nonEmptyTests = tests.filter((t) => t.testName.trim() !== "");
    if (nonEmptyTests.length === 0) {
      setMessage("Please add at least one valid test.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/pathlab/tests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tests: nonEmptyTests }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Tests saved successfully!");
        setSavedTests(data.pathlab.tests || []);
      } else {
        setMessage(data.message || "Failed to save.");
      }
    } catch (e) {
      console.error(e);
      setMessage("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1c24] to-[#13232f] p-6 text-white">
      <div className="max-w-3xl mx-auto bg-[#183945] border border-[#2c6168] rounded-xl p-8 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-[#67e3d5] mb-6">
          Pathlab Dashboard
        </h1>
        <h2 className="text-2xl font-semibold text-[#8ee8f2] mb-4">
          Manage Test Availability
        </h2>

        {tests.map((test, idx) => (
          <div key={idx} className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder="Test Name"
              value={test.testName}
              onChange={(e) => handleChange(idx, "testName", e.target.value)}
              className="p-2 rounded-lg bg-[#1e2f3a] text-white flex-1 border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#41bba9] transition"
              required
            />
            <select
              value={test.available ? "true" : "false"}
              onChange={(e) => handleChange(idx, "available", e.target.value === "true")}
              className="p-2 rounded-lg bg-[#1e2f3a] text-white border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#41bba9] transition"
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
            <button
              type="button"
              onClick={() => handleRemoveTest(idx)}
              className="bg-red-600 px-3 py-1 rounded-lg text-white font-bold hover:bg-red-700 transition"
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="flex flex-wrap gap-4 mt-5 mb-6">
          <button
            type="button"
            onClick={handleAddTest}
            className="bg-gradient-to-r from-[#2d8e7c] to-[#4c9d8f] hover:from-[#2d937b] hover:to-[#1b644d] px-5 py-2 rounded-xl font-semibold text-white shadow-lg transition-all"
          >
            + Add Test
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#3085c3] hover:bg-[#256ba0] px-6 py-2 rounded-xl font-semibold text-white shadow-lg transition"
          >
            Save
          </button>
        </div>

        {message && (
          <div className="text-center text-green-300 mb-4">{message}</div>
        )}

        {savedTests.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-[#34d399] mb-2">
              Saved Tests
            </h3>
            <ul className="space-y-2">
              {savedTests.map((test, idx) => (
                <li
                  key={idx}
                  className="bg-[#1e2f3a] p-3 rounded-lg flex justify-between items-center border border-[#2c6168]"
                >
                  <span>{test.testName}</span>
                  <span className={test.available ? "text-green-300" : "text-red-400"}>
                    {test.available ? "✅ Available" : "❌ Not Available"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
