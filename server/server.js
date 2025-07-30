const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./mongo.js');
 // If you have it separate

const app = express();
app.use(cors());
app.use(express.json());
 
// Import routes
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const pathlabRoutes = require('./routes/pathlabRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes'); 
const scheduleReminders = require("./utils/reminderScheduler");
scheduleReminders();


// Use routes
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/pathlab', pathlabRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
