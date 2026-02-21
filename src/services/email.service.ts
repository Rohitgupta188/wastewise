import { getMailer } from "@/lib/mailer";
import EmailLog from "@/models/EmailLog";

const MAX_RETRIES = 3;

export async function sendEmail({
  to,
  subject,
  html,
  text,
  event,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  event: string;
}) {
  const log = await EmailLog.create({
    to,
    subject,
    event,
  });

  const transporter = getMailer();

  try {
    await transporter.sendMail({
      from: `"Food Redistribution" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });

    log.status = "sent";
    await log.save();
  } catch (error: any) {
    log.attempts += 1;
    log.error = error.message;
    log.status = "failed";
    await log.save();

    if (log.attempts < MAX_RETRIES) {
      throw error; // allow retry mechanism
    }
  }
}
