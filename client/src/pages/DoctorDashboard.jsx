import React, { useEffect, useState } from "react";

const DoctorDashboard = () => {
  const doctorEmail = localStorage.getItem("doctorEmail");
  const [specialization, setSpecialization] = useState("");
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!doctorEmail) return;

    // Fetch doctor data (specialization + _id)
    fetch(`https://ieee-l1j7.onrender.com/api/doctor/${doctorEmail}`)
      .then((res) => res.json())
      .then((data) => {
        setSpecialization(data.specialization || "");

        // Fetch appointments using doctorId
        fetch(`https://ieee-l1j7.onrender.com/api/appointments/bookings/${data._id}`)
          .then((res) => res.json())
          .then(setAppointments)
          .catch(() => setAppointments([]));
      })
      .catch(() => {
        setSpecialization("");
        setAppointments([]);
      });

    // Fetch patients
    fetch(`https://ieee-l1j7.onrender.com/api/doctor/patients/${doctorEmail}`)
      .then((res) => res.json())
      .then(setPatients)
      .catch(() => setPatients([]));
  }, [doctorEmail]);

  const handleSave = async () => {
    if (!doctorEmail) {
      setSuccess("Doctor email not found.");
      return;
    }

    try {
      const res = await fetch(
        `https://ieee-l1j7.onrender.com/api/doctor/specialization/email/${doctorEmail}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ specialization }),
        }
      );

      if (res.ok) setSuccess("Specialization updated!");
      else setSuccess("Error updating specialization.");
    } catch {
      setSuccess("Failed to update specialization.");
    }

    setTimeout(() => setSuccess(""), 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1c24] to-[#13232f]">
      <div className="bg-[#172c38] border border-[#66C7C0] rounded-2xl shadow-2xl px-10 py-14 w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-[#81D8D0] mb-2 tracking-wide text-center">
          Doctor Dashboard
        </h1>
        <p className="text-[#baffec] text-lg mb-6 text-center">
          Welcome, Doctor! Here you can view your appointments, patients, and manage reports.
        </p>

        {/* Specialization Field */}
        <div className="mb-7">
          <label className="block text-[#81D8D0] font-semibold text-lg mb-2">
            Specialization
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="flex-1 bg-[#1a2b3a] text-[#cfffe6] border border-[#66C7C0] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81D8D0] transition"
              placeholder="Enter your specialization"
            />
            <button
              className="bg-gradient-to-r from-[#66C7C0] to-[#1E3A5F] text-white px-5 py-2 rounded-xl font-bold shadow hover:scale-105 transition"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
          {success && (
            <div className="text-[#81D8D0] font-semibold mt-2 text-center">
              {success}
            </div>
          )}
        </div>

        {/* Patient List */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#81D8D0] mb-2 text-left">
            Your Patients
          </h2>
          {patients.length === 0 ? (
            <div className="text-[#d1fff5] text-center">No patients assigned yet.</div>
          ) : (
            <ul className="bg-[#1a2e3f] rounded-xl p-4 max-h-60 overflow-y-auto">
              {patients.map((p) => (
                <li
                  key={p._id}
                  className="py-2 border-b border-[#19313b] last:border-b-0 text-[#d1fff5] flex justify-between"
                >
                  <span>
                    <b>{p.name}</b> ({p.gender}, {p.mobile})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Booked Appointments */}
        <div>
          <h2 className="text-2xl font-bold text-[#81D8D0] mb-2 text-left">
            Booked Appointments
          </h2>
          {appointments.length === 0 ? (
            <div className="text-[#d1fff5] text-center">No appointments booked yet.</div>
          ) : (
            <ul className="bg-[#1a2e3f] rounded-xl p-4 max-h-60 overflow-y-auto">
              {appointments.map((a, i) => (
                <li
                  key={i}
                  className="py-2 border-b border-[#19313b] last:border-b-0 text-[#d1fff5] flex justify-between"
                >
                  <span><b>{a.patientEmail}</b></span>
                  <span>{a.date}, {a.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
