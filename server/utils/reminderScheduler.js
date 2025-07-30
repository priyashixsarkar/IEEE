// utils/reminderScheduler.js
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Reminder = require("../models/Reminder"); // MongoDB model

// Setup your mail config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // your email
    pass: process.env.EMAIL_PASSWORD // your password or app password
  }
});

function scheduleReminders() {
  // Check every minute
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const dueReminders = await Reminder.find({
      time: { $lte: now },
      sent: false,
    });

    for (const reminder of dueReminders) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: reminder.email,
        subject: "Medicine Reminder",
        text: `It's time to take your medicine: ${reminder.medicine}`,
      };

      try {
        await transporter.sendMail(mailOptions);
        reminder.sent = true;
        await reminder.save();
        console.log(`Reminder sent to ${reminder.email}`);
      } catch (err) {
        console.error("Failed to send email:", err.message);
      }
    }
  });
}

module.exports = scheduleReminders;
