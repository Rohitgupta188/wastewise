type OtpVerificationEmailProps = {
  name?: string;
  otp: string;
};

export function otpVerificationEmail({
  name,
  otp,
}: OtpVerificationEmailProps) {
  return {
    subject: "Verify Your Account - OTP Code",
    html: `
      <h2>Hello ${name ?? "User"},</h2>
      <p>Your verification code is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  };
}
