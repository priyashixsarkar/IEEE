import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PharmacyRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    owner: "",
    contact: "",
    email: "",
    address: "",
    license: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.owner ||
      !form.contact ||
      !form.email ||
      !form.address ||
      !form.license ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill all required (*) fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/pharmacy/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        navigate("/pharmacy/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed!");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f1c24] to-[#13232f] overflow-hidden">
      <div className="max-w-7xl w-full h-[90%] flex rounded-xl overflow-hidden shadow-xl border border-[#264043]">
        {/* Left side - info */}
        <div className="hidden md:flex flex-col justify-center bg-[#10262f] px-10 py-12 w-1/2 text-[#78dcd0] space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Become a Trusted Pharmacy 💊
          </h2>
          <p className="text-lg leading-relaxed text-[#c1eee6]">
            Register your pharmacy to manage prescriptions, verify stocks, and connect with patients in your area.
          </p>
        </div>

        {/* Right side - form */}
        <div className="flex items-start justify-center w-full md:w-1/2 bg-[#183945] px-6 py-10 sm:px-10 overflow-y-auto max-h-[90vh]">
          <form className="space-y-5 w-full max-w-lg" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-extrabold text-[#67e3d5] mb-8 text-center tracking-wide">
              Pharmacy Registration
            </h2>

            {[
              { name: "name", label: "Pharmacy Name", required: true },
              { name: "owner", label: "Owner Name", required: true },
              { name: "contact", label: "Contact Number", required: true },
              { name: "email", label: "Email Address", type: "email", required: true },
              { name: "address", label: "Address", type: "textarea", required: true },
              { name: "license", label: "License Number", required: true },
              { name: "password", label: "Password", type: "password", required: true },
              { name: "confirmPassword", label: "Confirm Password", type: "password", required: true },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block text-[#c8ffe1] font-semibold mb-2">
                  {field.label}
                  {field.required && <span className="text-[#36d8c8]"> *</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    rows={2}
                    required={field.required}
                    className="w-full px-4 py-2 rounded-lg bg-[#1e2f3a] text-[#cfffe6] border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#41bba9] transition"
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-2 rounded-lg bg-[#1e2f3a] text-[#cfffe6] border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#37e1c8] transition"
                  />
                )}
              </div>
            ))}

            {/* File Upload (currently disabled) */}
            <div>
              <label className="block text-[#c8ffe1] font-semibold mb-2">
                Upload License Proof (PDF/JPEG) <span className="text-[#36d8c8]">*</span>
              </label>
              <input
                type="file"
                accept="application/pdf,image/jpeg"
                disabled
                title="File upload not yet handled"
                className="w-full px-4 py-2 rounded-lg bg-[#1e2f3a] text-[#888] border border-[#2c6168] opacity-60 cursor-not-allowed"
              />
            </div>

            {error && (
              <div className="text-[#ffbb99] bg-[#2f3f3f] border-l-4 border-red-400 rounded px-3 py-2 mb-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-3 py-3 bg-gradient-to-r from-[#2d8e7c] to-[#4c9d8f] hover:from-[#2d937b] hover:to-[#1b644d] text-white font-bold rounded-xl shadow-lg tracking-wide text-lg transition-all duration-300"
            >
              Register
            </button>

            <div className="text-center mt-3">
              <span className="text-white">Already registered? </span>
              <Link to="/login" className="text-[#5affd8] font-semibold underline hover:text-[#baffec] transition">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PharmacyRegistration;
