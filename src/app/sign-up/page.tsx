"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "@/lib/validation/signup.scheme";

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const role = watch("role");

  const onSubmit = async (data: SignupInput) => {
    setServerError(null);

    try {
      await axios.post("/api/signup", data);
      router.replace("/sign-in");
    } catch (err: any) {
      setServerError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-semibold mb-6">Create your account</h1>

        {serverError && (
          <p className="mb-4 text-sm text-red-400 bg-red-400/10 p-2 rounded">
            {serverError}
          </p>
        )}

        <input
          type="text"
          placeholder="Name (optional)"
          className="w-full mb-1 p-3 rounded bg-slate-800"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-400 text-sm mb-3">{errors.name.message}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-1 p-3 rounded bg-slate-800"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-400 text-sm mb-3">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-1 p-3 rounded bg-slate-800"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-400 text-sm mb-3">{errors.password.message}</p>
        )}

        <select
          className="w-full mb-1 p-3 rounded bg-slate-800"
          {...register("role")}
        >
          <option value="">Select Role</option>
          <option value="donor">Donor</option>
          <option value="receiver">Receiver</option>
          <option value="admin">admin</option>
        </select>
        {errors.role && (
          <p className="text-red-400 text-sm mb-3">{errors.role.message}</p>
        )}

        {role === "receiver" && (
          <>
            <select
              className="w-full mb-1 p-3 rounded bg-slate-800"
              {...register("receiverType")}
            >
              <option value="">Select Receiver Type</option>
              <option value="ngo">NGO</option>
              <option value="individual">Individual</option>
            </select>

            {"receiverType" in errors && errors.receiverType && (
              <p className="text-red-400 text-sm mb-3">
                {errors.receiverType.message}
              </p>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>

        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
