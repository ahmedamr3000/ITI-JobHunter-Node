import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";
import dotenv from "dotenv";
dotenv.config({});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SEND_EMAIL_ADDRESS,
    pass: process.env.SEND_EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendEmail(email, url) {
  try {
    const info = await transporter.sendMail({
      from: "Node Proj ITI",
      to: email,
      subject: "Hello world",
      text: "",
      html: emailTemplate(url),
    });
  } catch (error) {
    console.error("Error occurred while sending email: ", error);
  }
}
export { sendEmail };
