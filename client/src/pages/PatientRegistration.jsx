import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    address: "",
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
    if (!form.name || !form.gender || !form.dob || !form.mobile || !form.password || !form.confirmPassword) {
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
      const response = await fetch("https://ieee-l1j7.onrender.com/api/patient/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        localStorage.setItem("patientEmail", form.email);
        navigate("/patient/dashboard");
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
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center bg-[#10262f] px-10 py-12 w-1/2 text-[#78dcd0] space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Your Health Journey Starts Here 🍃
          </h2>
          <p className="text-lg leading-relaxed text-[#c1eee6]">
            Simplify your healthcare — register to access appointments, reminders, test trackers, and nearby pharmacies with one login.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-start justify-center w-full md:w-1/2 bg-[#183945] px-6 py-10 sm:px-10 overflow-y-auto max-h-[90vh]">
          <div className="w-full max-w-lg">
            <h2 className="text-3xl font-extrabold text-[#67e3d5] mb-8 text-center tracking-wide">
              Patient Registration
            </h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name on top */}
              <div>
                <label className="block text-[#c8ffe1] font-semibold mb-2">
                  Name <span className="text-[#36d8c8]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-[#1e2f3a] text-[#cfffe6] border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#41bba9] transition"
                  placeholder="Enter full name"
                />
              </div>

              {/* Other fields */}
              {[
                "gender", "dob", "mobile", "email", "address",
                "password", "confirmPassword"
              ].map((field, idx) => {
                const commonClass =
                  "w-full px-4 py-2 rounded-lg bg-[#1e2f3a] text-[#cfffe6] border border-[#2c6168] focus:outline-none focus:ring-2 focus:ring-[#41bba9] transition";
                const labels = {
                  gender: "Gender",
                  dob: "Date of Birth",
                  mobile: "Mobile Number",
                  email: "Email ID",
                  address: "Address",
                  password: "Password",
                  confirmPassword: "Confirm Password"
                };
                const props = {
                  name: field,
                  required: ["gender", "dob", "mobile", "password", "confirmPassword"].includes(field),
                  value: form[field],
                  onChange: handleChange
                };
                return (
                  <div key={idx}>
                    <label className="block text-[#c8ffe1] font-semibold mb-2">
                      {labels[field]}
                      {props.required && <span className="text-[#36d8c8]"> *</span>}
                    </label>
                    {field === "gender" ? (
                      <select {...props} className={commonClass}>
                        <option value="">Select Gender</option>
                        {["Male", "Female", "Other"].map((opt) => (
                          <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                        ))}
                      </select>
                    ) : field === "address" ? (
                      <textarea
                        {...props}
                        rows={2}
                        placeholder="Enter address (optional)"
                        className={commonClass}
                      />
                    ) : (
                      <input
                        type={
                          field.includes("password") ? "password" :
                          field === "dob" ? "date" :
                          field === "email" ? "email" :
                          field === "mobile" ? "tel" : "text"
                        }
                        placeholder={
                          field === "mobile" ? "Enter 10-digit mobile" :
                          field === "email" ? "Enter your email (optional)" :
                          field.includes("password") ?
                            field === "password" ? "Enter password (min 6 characters)" : "Re-enter password" : ""
                        }
                        minLength={field.includes("password") ? 6 : undefined}
                        pattern={field === "mobile" ? "[0-9]{10}" : undefined}
                        maxLength={field === "mobile" ? 10 : undefined}
                        className={commonClass}
                        {...props}
                      />
                    )}
                  </div>
                );
              })}

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
    </div>
  );
};

export default PatientRegistration;
