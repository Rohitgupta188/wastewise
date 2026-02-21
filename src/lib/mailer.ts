import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter;

export function getMailer() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASS!,
    },
  });

  return transporter;
}
