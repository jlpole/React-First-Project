import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ✅ Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
    console.log('Check your EMAIL_USER and EMAIL_PASSWORD in .env file');
  } else {
    console.log('Email server is ready to send messages');
  }
});

export default transporter;