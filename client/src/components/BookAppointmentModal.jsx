import { useState, useEffect } from "react";

const BookAppointmentModal = ({ doctor, onClose }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");

  useEffect(() => {
    if (doctor && selectedDate) {
      fetch(`http://localhost:5000/api/appointments/slots/${doctor._id}/${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          setAvailableSlots(data.slots || []);
          setOccupiedSlots(data.occupiedSlots || []);
        })
        .catch(err => {
          setAvailableSlots([]);
          setOccupiedSlots([]);
        });
    }
  }, [selectedDate, doctor]);

  const handleBooking = async () => {
  const email = localStorage.getItem("patientEmail");
  if (!email || !selectedSlot || !selectedDate) {
    setBookingMsg("Login, date, and slot selection required");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/appointments/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientEmail: email,
        doctorId: doctor._id,
        date: selectedDate,
        time: selectedSlot
      }),
    });
    const data = await res.json();
    setBookingMsg(data.message || "Appointment booked.");
  } catch {
    setBookingMsg("Failed to book appointment.");
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-xl relative">
        <h2 className="text-xl font-bold mb-3">Book Appointment - Dr. {doctor.name}</h2>

        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="border px-3 py-2 w-full mb-4"
        />

        {selectedDate && (
          <div className="grid grid-cols-3 gap-2">
            {Array.isArray(availableSlots) && availableSlots.length > 0 ? (
              availableSlots.map(slot => {
                const isOccupied = occupiedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    disabled={isOccupied}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-2 py-1 rounded text-sm ${
                      isOccupied
                        ? "bg-gray-300 cursor-not-allowed"
                        : selectedSlot === slot
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-gray-600 col-span-3">No slots available for this date.</p>
            )}
          </div>
        )}

        <button
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded w-full font-semibold"
          onClick={handleBooking}
        >
          Confirm Booking
        </button>

        {bookingMsg && <div className="text-green-600 mt-2 text-sm">{bookingMsg}</div>}

        <button
          className="absolute top-2 right-2 text-red-500 font-bold"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
