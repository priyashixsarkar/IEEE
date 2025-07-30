import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DoctorRegistration = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    address: "",
    registrationNumber: "",
    specialization: "",
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
      !form.name || !form.gender || !form.dob || !form.mobile ||
      !form.registrationNumber || !form.specialization ||
      !form.password || !form.confirmPassword
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
      const { confirmPassword, specialization, ...doctorData } = form;

      const res = await fetch("https://ieee-l1j7.onrender.com/api/doctor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorData),
      });

      const data = await res.json();

      if (res.ok) {
        const specRes = await fetch(`https://ieee-l1j7.onrender.com/api/doctor/specialization/email/${doctorData.email}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ specialization: form.specialization }),
        });

        const specData = await specRes.json();

        if (specRes.ok) {
          alert("Doctor registered and specialization saved!");
          navigate("/doctor/dashboard");
        } else {
          setError("Doctor registered but failed to save specialization.");
          console.log(specData);
        }
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f1c24] to-[#13232f] overflow-hidden">
      <div className="max-w-7xl w-full h-[90%] flex rounded-xl overflow-hidden shadow-xl border border-[#264043]">
        {/* Left side - info */}
        <div className="hidden md:flex flex-col justify-center bg-[#10262f] px-10 py-12 w-1/2 text-[#78dcd0] space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Join Our Medical Network 🩺
          </h2>
          <p className="text-lg leading-relaxed text-[#c1eee6]">
            Register to serve patients, manage appointments, and contribute to a smarter healthcare ecosystem.
          </p>
        </div>

        {/* Right side - scrollable form */}
        <div className="flex items-start justify-center w-full md:w-1/2 bg-[#183945] px-6 py-10 sm:px-10 overflow-y-auto max-h-[90vh]">
          <form className="space-y-5 w-full max-w-lg" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-extrabold text-[#67e3d5] mb-8 text-center tracking-wide">
              Doctor Registration
            </h2>

            {/* Field Generator */}
            {[
              { name: "name", label: "Full Name", type: "text", required: true },
              { name: "gender", label: "Gender", type: "select", required: true, options: ["Male", "Female", "Other"] },
              { name: "dob", label: "Date of Birth", type: "date", required: true },
              { name: "mobile", label: "Mobile Number", type: "tel", required: true },
              { name: "email", label: "Email ID", type: "email" },
              { name: "address", label: "Address", type: "textarea" },
              { name: "registrationNumber", label: "Registration Number", type: "text", required: true },
              { name: "specialization", label: "Specialization", type: "text", required: true },
              { name: "password", label: "Password", type: "password", required: true },
              { name: "confirmPassword", label: "Confirm Password", type: "password", required: true },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block text-[#c8ffe1] font-semibold mb-2">
                  {field.label}
                  {field.required && <span className="text-[#36d8c8]"> *</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-2 rounded-lg bg-[#1e2f3a] text-[#cfffe6] border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#41bba9] transition"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg bg-[#1e2f3a] text-[#cfffe6] border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#41bba9] transition"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-2 rounded-lg bg-[#1e2f3a] text-[#cfffe6] border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#37e1c8] transition"
                  />
                )}
              </div>
            ))}

            {/* Proof Upload */}
            <div>
              <label className="block text-[#c8ffe1] font-semibold mb-2">
                Upload Proof (PDF/JPEG) <span className="text-[#58e490]">*</span>
              </label>
              <input
                type="file"
                accept="application/pdf,image/jpeg"
                required
                className="w-full px-4 py-2 rounded-lg bg-[#1e2f3a] text-[#cfffe6] border border-[#2c6168] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2c6168] file:text-[#002c1f] hover:file:bg-[#30e9c5] transition"
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

export default DoctorRegistration;
