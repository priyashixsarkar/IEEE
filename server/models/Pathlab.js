const mongoose = require('mongoose');

const pathlabSchema = new mongoose.Schema({
  name: String,
  ownerName: String,
  contactNumber: String,
  address: String,
  licenseNumber: String,
  email: String,
  password: String,
  tests: [
    {
      testName: String,
      available: Boolean,
    }
  ]
});

module.exports = mongoose.model('Pathlab', pathlabSchema);
