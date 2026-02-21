"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const verificationSchema = z.object({
  email: z.email("Valid email required"),
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits"),
});

type VerificationInput = z.infer<typeof verificationSchema>;

export default function KYCVerificationPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerificationInput>({
    resolver: zodResolver(verificationSchema),
  });

  const onSubmit = async (data: VerificationInput) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await axios.post("/api/verification", data);

      if (res.data.success) {
        setSuccessMessage("Verification successful. Redirecting...");
        setTimeout(() => {
          router.push("/dashboard/receiver/request");
        }, 1500);
      }
    } catch (error: any) {
      setServerError(
        error.response?.data?.error || "Verification failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6">
          KYC Verification
        </h1>

        {serverError && (
          <p className="mb-4 text-sm text-red-400 bg-red-400/10 p-2 rounded">
            {serverError}
          </p>
        )}

        {successMessage && (
          <p className="mb-4 text-sm text-green-400 bg-green-400/10 p-2 rounded">
            {successMessage}
          </p>
        )}

        <input
          type="email"
          placeholder="Registered Email"
          className="w-full mb-1 p-3 rounded bg-slate-800"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-400 text-sm mb-3">
            {errors.email.message}
          </p>
        )}

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          className="w-full mb-1 p-3 rounded bg-slate-800 tracking-widest text-center text-lg"
          {...register("otp")}
        />
        {errors.otp && (
          <p className="text-red-400 text-sm mb-3">
            {errors.otp.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Verify Account"}
        </button>
      </motion.form>
    </div>
  );
}
