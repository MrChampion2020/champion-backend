const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
require('dotenv').config();
app.use(
  cors({
    origin: "*", // Allow all origins
  })
);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Handle contact form submission.
 * 
 * @route POST /api/contact
 * @param {String} name - Sender's name
 * @param {String} email - Sender's email
 * @param {String} message - Message content
 * @returns {Object} JSON response
 */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Send email using Nodemailer
    await transporter.sendMail({
      from: email, // Set the 'from' field to the email submitted via the form
      to: process.env.REC_EMAIL, // Your receiving email address
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` // Include form details in the message
    });

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));