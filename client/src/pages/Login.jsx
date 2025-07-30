import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [userType, setUserType] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const endpoints = {
      patient: "patient",
      doctor: "doctor",
      pathlab: "pathlab",
      pharmacy: "pharmacy",
    };

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoints[userType]}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem(`${userType}Email`, data[userType].email);
        navigate(`/${userType}/dashboard`);
      } else {
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("Could not connect to server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1c24] to-[#13232f]">
      <form
        onSubmit={handleLogin}
        className="bg-[#183945] p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-[#2c6168]"
      >
        <h2 className="text-3xl font-extrabold text-[#67e3d5] text-center tracking-wide">
          Login
        </h2>

        <div>
          <label className="block mb-2 text-lg font-semibold text-white">
            Login As
          </label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#1e2f3a] text-white border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#41bba9] transition"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="pathlab">Pathlab</option>
            <option value="pharmacy">Pharmacy</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-semibold text-white">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg bg-[#1e2f3a] text-white border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#41bba9] transition"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-semibold text-white">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-lg bg-[#1e2f3a] text-white border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#41bba9] transition"
          />
        </div>

        {error && (
          <div className="text-[#ffbb99] bg-[#2f3f3f] border-l-4 border-red-400 rounded px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full mt-2 py-3 bg-gradient-to-r from-[#2d8e7c] to-[#4c9d8f] hover:from-[#2d937b] hover:to-[#1b644d] text-white font-bold rounded-xl shadow-lg tracking-wide text-lg transition-all duration-300"
        >
          Login
        </button>

        <div className="text-center mt-2">
          <span className="text-gray-300">New user? </span>
          <Link
            to="/"
            className="text-[#5affd8] font-semibold underline hover:text-[#baffec] transition"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
