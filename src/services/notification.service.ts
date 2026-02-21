import { receiverRequestEmail } from "@/emails/receiverRequest";
import { sendEmail } from "./email.service";
import { otpVerificationEmail } from "@/emails/optVerification";

export async function notifyDonorOnRequest({
  donorEmail,
  donorName,
  receiverName,
  foodName,
  quantity,
}: any) {
  const email = receiverRequestEmail({
    donorName,
    receiverName,
    foodName,
    quantity,
  });

  

  await sendEmail({
    to: donorEmail,
    subject: email.subject,
    html: email.html,
    text: email.text,
    event: "RECEIVER_REQUEST",
  });
}

export async function sendOtpVerificationEmail({
  email,
  name,
  otp,
}: {
  email: string;
  name?: string;
  otp: string;
}) {
  const emailTemplate = otpVerificationEmail({
    name,
    otp,
  });

  await sendEmail({
    to: email,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text,
    event: "OTP_VERIFICATION",
  });
}

