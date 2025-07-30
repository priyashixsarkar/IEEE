import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

const patientServices = [
  { title: "Doctor At Home", desc: "Consult trusted healthcare professionals anytime, anywhere", bg: "url('/images/doctor-bg.jpg')", to: "#", key: "doctor" },
  { title: "Dose Alert", desc: "Stay on schedule with gentle reminders to take your medicine", bg: "url('/images/dose-bg.jpg')", to: "#", key: "dose" },
  { title: "Pharma Near", desc: "Check medicine availability near you instantly", bg: "url('/images/pharma-bg.jpg')", to: "#", key: "pharma" },
  { title: "Near Test", desc: "Find nearby test labs and check test availability.", bg: "url('/images/test-bg.jpg')", to: "#", key: "test" }
];

export default function PatientDashboard() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergy, setAllergy] = useState("");
  const [history, setHistory] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [expanded, setExpanded] = useState(null);

  const [doseName, setDoseName] = useState("");
  const [doseTime, setDoseTime] = useState("");
  const [doseMsg, setDoseMsg] = useState("");

  const [medicineSearch, setMedicineSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMsg, setSearchMsg] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [bookingMsg, setBookingMsg] = useState("");
  const [, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState(null);


  const [testSearch, setTestSearch] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [testMsg, setTestMsg] = useState("");

  const fetchSlots = async (doctorId, date) => {
    const res = await fetch(`http://localhost:5000/api/appointments/slots/${doctorId}/${date}`);
    const data = await res.json();
    setAvailableSlots(data.slots);
    setOccupiedSlots(data.occupiedSlots);
  };

  useEffect(() => {
    if (expanded === "doctor") {
      fetch("http://localhost:5000/api/doctor")
        .then(res => res.json())
        .then(data => setDoctors(data.doctors || []))
        .catch(() => setDoctors([]));
    }
  }, [expanded]);

  async function handleSave() {
    setSaveMsg("");
    const email = localStorage.getItem("patientEmail");
    if (!email) {
      setSaveMsg("You are not logged in!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/patient/dashboard/save", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, bloodGroup, allergy, history }),
      });
      const data = await response.json();
      setSaveMsg(response.ok ? "Saved successfully!" : data.message || "Failed to save.");
    } catch {
      setSaveMsg("Error: Could not connect to server.");
    }
  }

  const doctorAtHomeContent = (
    <div className="flex flex-col gap-3 w-full">
      <h2 className="text-3xl font-bold text-[#a6ffe1] mb-3">Available Doctors</h2>
      {doctors.length === 0 ? (
        <p className="text-white">No doctors found.</p>
      ) : (
        <ul className="grid gap-4">
          {doctors.map(doc => (
            <li key={doc._id} className="bg-[#1a2b22] p-4 rounded-lg text-white">
              <div className="font-bold text-[#72ffcf]">{doc.name}</div>
              <div className="text-[#defff2]">Specialization: {doc.specialization || "Not provided"}</div>
              <div className="text-[#b9ffdd] text-sm">Email: {doc.email}</div>
              <input
                type="date"
                onChange={e => {
                  setSelectedDate(e.target.value);
                  setSelectedDoctor(doc._id);
                  fetchSlots(doc._id, e.target.value);
                }}
                className="mt-2 p-2 bg-[#1a2b22] text-white w-full rounded"
              />
              {selectedDoctor === doc._id && (
                <>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {availableSlots.map(slot => {
                      const isOccupied = occupiedSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          disabled={isOccupied}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-1 rounded text-sm ${
                            isOccupied
                              ? "bg-gray-500 cursor-not-allowed"
                              : (selectedSlot === slot ? "bg-blue-600" : "bg-green-600 hover:bg-green-700")
                          }`}
                        >
                          {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={async () => {
                      const email = localStorage.getItem("patientEmail");
                      if (!email || !selectedSlot) {
                        setBookingMsg("Login and slot selection required");
                        return;
                      }
                      setBookingMsg("Booking...");
                      try {
                        const res = await fetch("http://localhost:5000/api/appointments/book", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ patientEmail: email, doctorId: doc._id, time: selectedSlot }),
                        });
                        const data = await res.json();
                        setBookingMsg(data.message || "Appointment booked.");
                      } catch {
                        setBookingMsg("Failed to book appointment.");
                      }
                    }}
                    className="mt-2 bg-[#27c48f] px-4 py-1 rounded text-white font-bold"
                  >
                    Book Appointment
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {bookingMsg && <p className="text-green-300 mt-2">{bookingMsg}</p>}
      <button
        className="mt-4 text-[#a6ffe1] underline hover:text-[#8fffca] text-sm"
        onClick={() => {
          setExpanded(null);
          setDoctors([]);
          setBookingMsg("");
        }}
      >
        Close
      </button>
    </div>
  );

  const doseAlertContent = (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-3xl font-bold text-[#a6ffe1]">Set Dose Alert</h2>
      <input
        type="text"
        value={doseName}
        onChange={(e) => setDoseName(e.target.value)}
        placeholder="Medicine name"
        className="p-2 rounded bg-[#1a2b22] text-white"
      />
      <input
        type="datetime-local"
        value={doseTime}
        onChange={(e) => setDoseTime(e.target.value)}
        className="p-2 rounded bg-[#1a2b22] text-white"
      />
      <button
        className="bg-[#27c48f] text-white px-4 py-2 rounded font-bold"
        onClick={async () => {
          setDoseMsg("Setting reminder...");
          const email = localStorage.getItem("patientEmail");
          try {
            const res = await fetch("http://localhost:5000/api/patient/reminder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, medicine: doseName, time: doseTime }),
            });
            const data = await res.json();
            setDoseMsg(data.message || "Reminder set.");
          } catch {
            setDoseMsg("Failed to set reminder.");
          }
        }}
      >
        Set Reminder
      </button>
      {doseMsg && <div className="text-green-200">{doseMsg}</div>}
      <button
        className="mt-4 text-[#a6ffe1] underline hover:text-[#8fffca] text-sm"
        onClick={() => {
          setExpanded(null);
          setDoseMsg("");
          setDoseName("");
          setDoseTime("");
        }}
      >
        Close
      </button>
    </div>
  );

  const pharmaNearContent = (
    <div className="flex flex-col items-start w-full h-full">
      <div className="text-3xl md:text-4xl font-extrabold text-[#1c1348] mb-2">
        Pharma Near
      </div>
      <form
        className="flex gap-2 mb-3 w-full"
        onSubmit={async e => {
          e.preventDefault();
          setSearchMsg("");
          setSearchResults([]);
          if (!medicineSearch) {
            setSearchMsg("Please enter a medicine name.");
            return;
          }
          try {
            setSearchMsg("Searching...");
            const res = await fetch(
              `http://localhost:5000/api/pharmacy/search?medicine=${encodeURIComponent(medicineSearch)}`
            );
            const data = await res.json();
            if (res.ok && data.pharmacies?.length > 0) {
              setSearchResults(data.pharmacies);
              setSearchMsg("");
            } else {
              setSearchMsg("No pharmacies found with that medicine.");
            }
          } catch {
            setSearchMsg("Error contacting server.");
          }
        }}
      >
        <input
          className="flex-1 rounded-lg px-3 py-2 bg-[#202e28] text-[#a6ffe1] border border-[#28e091] focus:outline-none"
          value={medicineSearch}
          onChange={e => setMedicineSearch(e.target.value)}
          placeholder="Enter medicine name"
        />
        <button
          type="submit"
          className="bg-[#27c48f] px-5 py-2 rounded-lg text-white font-bold"
        >
          Search
        </button>
      </form>
      {searchMsg && <div className="text-[#bbffb6] mb-2">{searchMsg}</div>}
      {searchResults.length > 0 && (
        <ul className="w-full">
          {searchResults.map(pharmacy => (
            <li key={pharmacy._id} className="mb-3 p-3 bg-[#12392b] rounded-lg">
              <div className="font-bold text-[#72ffcf]">{pharmacy.name}</div>
              <div className="text-[#defff2]">{pharmacy.address}</div>
              <div className="text-[#b9ffdd] text-sm">Contact: {pharmacy.contactNumber}</div>
              <div className="text-[#baffec] text-xs mt-1">
                Available: {
                  pharmacy.inventory
                    .filter(med => med.medicineName.toLowerCase() === medicineSearch.toLowerCase())
                    .map(med => `${med.medicineName} (${med.stock})`)
                    .join(", ")
                }
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        className="mt-4 text-[#a6ffe1] underline hover:text-[#8fffca] text-sm"
        onClick={() => {
          setExpanded(null);
          setSearchMsg("");
          setSearchResults([]);
          setMedicineSearch("");
        }}
      >
        Close
      </button>
    </div>
  );

  const nearTestContent = (
  <div className="flex flex-col items-start w-full h-full">
    <div className="text-3xl md:text-4xl font-extrabold text-[#1c1348] mb-2">Near Test</div>
    <form
      className="flex gap-2 mb-3 w-full"
      onSubmit={async e => {
        e.preventDefault();
        setTestMsg("");
        setTestResults([]);
        if (!testSearch) {
          setTestMsg("Please enter a test name.");
          return;
        }
        try {
          setTestMsg("Searching...");
          const res = await fetch(
            `http://localhost:5000/api/pathlab/search?test=${encodeURIComponent(testSearch)}`
          );
          const data = await res.json();
          if (res.ok && data.pathlabs?.length > 0) {
            setTestResults(data.pathlabs);
            setTestMsg("");
          } else {
            setTestMsg("No labs found offering that test.");
          }
        } catch {
          setTestMsg("Error contacting server.");
        }
      }}
    >
      <input
        className="flex-1 rounded-lg px-3 py-2 bg-[#202e28] text-[#a6ffe1] border border-[#28e091] focus:outline-none"
        value={testSearch}
        onChange={e => setTestSearch(e.target.value)}
        placeholder="Enter test name"
      />
      <button
        type="submit"
        className="bg-[#27c48f] px-5 py-2 rounded-lg text-white font-bold"
      >
        Search
      </button>
    </form>
    {testMsg && <div className="text-[#bbffb6] mb-2">{testMsg}</div>}
    {testResults.length > 0 && (
      <ul className="w-full">
        {testResults.map(lab => (
          <li key={lab._id} className="mb-3 p-3 bg-[#12392b] rounded-lg">
            <div className="font-bold text-[#72ffcf]">{lab.name}</div>
            <div className="text-[#defff2]">{lab.address}</div>
            <div className="text-[#b9ffdd] text-sm">Contact: {lab.contactNumber}</div>
            <div className="text-[#baffec] text-xs mt-1">
              Available: {
                lab.tests
                  .filter(t => t.testName.toLowerCase() === testSearch.toLowerCase())
                  .map(t => `${t.testName}`)
                  .join(", ")
              }
            </div>
          </li>
        ))}
      </ul>
    )}
    <button
      className="mt-4 text-[#a6ffe1] underline hover:text-[#8fffca] text-sm"
      onClick={() => {
        setExpanded(null);
        setTestMsg("");
        setTestSearch("");
        setTestResults([]);
      }}
    >
      Close
    </button>
  </div>
);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081d16] via-[#152824] to-[#16322c] flex p-0">
      <div className="w-full max-w-xs bg-[#11251b] border-r border-[#195c4a] p-8 flex flex-col gap-6 shadow-2xl">
        <h2 className="text-3xl font-bold text-[#b9ffdd] mb-4">Patient Dashboard</h2>
        <div>
          <label className="text-lg text-[#c8ffe1] font-semibold block mb-1">Blood Group</label>
          <select className="w-full bg-[#1a2b22] border border-[#2dd4bf] text-[#cfffe6] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#58e490]" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
            <option value="">Select</option>
            <option value="A+">A+</option><option value="A-">A-</option>
            <option value="B+">B+</option><option value="B-">B-</option>
            <option value="AB+">AB+</option><option value="AB-">AB-</option>
            <option value="O+">O+</option><option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label className="text-lg text-[#c8ffe1] font-semibold block mb-1">Allergy (if any)</label>
          <input type="text" value={allergy} onChange={e => setAllergy(e.target.value)} placeholder="Type any allergy" className="w-full bg-[#1a2b22] border border-[#2dd4bf] text-[#cfffe6] rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="text-lg text-[#c8ffe1] font-semibold block mb-1">Previous Medical Case History</label>
          <textarea value={history} onChange={e => setHistory(e.target.value)} placeholder="Type previous medical case history" rows={3} className="w-full bg-[#1a2b22] border border-[#2dd4bf] text-[#cfffe6] rounded-lg px-4 py-2" />
        </div>
        <button className="mt-2 px-5 py-2 bg-[#27c48f] text-white font-bold rounded-xl" onClick={handleSave}>Save</button>
        {saveMsg && <div className="mt-2 text-[#b6ffb6]">{saveMsg}</div>}
      </div>

      <main className="flex-1 flex flex-col py-10 px-4 md:px-12">
        <h1 className="text-4xl font-bold text-white mb-8">Our Service</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7" style={{ minHeight: 470 }}>
          {patientServices.map((service) =>
            service.key === expanded ? (
              <div key={service.key} className="relative rounded-2xl shadow-xl overflow-hidden flex flex-col justify-end border border-[#1d4939] bg-[#11251b]/90 col-span-1 md:col-span-2 z-10 scale-105"
                style={{ backgroundImage: service.bg, backgroundSize: "cover", backgroundPosition: "center", minHeight: 350 }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative p-7 z-10">
                  {service.key === "pharma" && pharmaNearContent}
                  {service.key === "dose" && doseAlertContent}
                  {service.key === "doctor" && doctorAtHomeContent}
                  {service.key === "test" && nearTestContent}

                </div>
              </div>
            ) : (
              <div
                key={service.key}
                className={"relative rounded-2xl shadow-xl overflow-hidden flex flex-col justify-end min-h-[220px] border border-[#1d4939] group transition-all duration-300 " + (expanded ? "opacity-40 blur-[1px] scale-95 pointer-events-none" : "cursor-pointer hover:scale-105")}
                style={{ backgroundImage: service.bg, backgroundSize: "cover", backgroundPosition: "center" }}
                onClick={() => setExpanded(service.key)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all"></div>
                <div className="relative p-7 z-10">
                  <div className="text-3xl md:text-4xl font-extrabold text-[#defff2] mb-2">{service.title}</div>
                  <div className="text-lg md:text-xl italic text-[#e0ffe5] font-semibold mb-6">{service.desc}</div>
                  <a href={service.to} className="inline-flex items-center bg-white/70 px-7 py-2 rounded-full font-bold text-[#003827] shadow-lg hover:bg-white/90 text-lg transition absolute bottom-7 right-7" title="Go to Service" tabIndex={-1}>
                    <ArrowUpRight size={24} />
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
