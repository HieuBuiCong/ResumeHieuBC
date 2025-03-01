import nodemailer from 'nodemailer';
import config from '../config/dotenv.config.js';

// Configure the transporter
const transporter = nodemailer.createTransport({
host: 'smartrelay.hitachienergy.com',  // SMTP relay hostname
    port: 587,  // TLS Port (Use 465 for SSL)
    secure: false, // Use `true` for port 465 (SSL), `false` for port 587 (TLS)
    auth: {
        user: config.smtp.user, // Your Hitachi Energy email
        pass: config.smtp.password, // Your email password or app-specific password
    },
    tls: {
        rejectUnauthorized: false // Allows untrusted certificates (if needed)
    }
});

export const sendEmail = async (to, subject, content, isHtml = false) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      [isHtml ? "html" : "text"]: content // Sends as HTML if isHtml is true
    });
    console.log(`📧 Email sent to: ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
