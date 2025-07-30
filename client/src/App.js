import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Pages
import Home from "./pages/Home";
import PatientRegistration from './pages/PatientRegistration';
import DoctorRegistration from "./pages/DoctorRegistration";
import PathlabRegistration from "./pages/PathlabRegistration";
import PharmacyRegistration from "./pages/PharmacyRegistration";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Pathlabdashboard from "./pages/Pathlabdashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import Login from "./pages/Login";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient/register" element={<PatientRegistration />} />
          <Route path="/doctor-registration" element={<DoctorRegistration />} />
          <Route path="/pathlab-registration" element={<PathlabRegistration />} />
          <Route path="/pharmacy-registration" element={<PharmacyRegistration />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/pathlab/dashboard" element={<Pathlabdashboard />} />
          <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
  );
}

export default App;
