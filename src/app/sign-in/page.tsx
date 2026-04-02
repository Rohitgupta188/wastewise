"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { http } from "@/lib/http";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninInput } from "@/lib/validation/signin.schema";

export default function SignInPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  });

const onSubmit = async (data: SigninInput) => {
  try {
    const res = await http.post("/signin", data);

    const user = res.data.user;

    if (user.role === "donor") {
      router.replace("/dashboard/donor");
      router.refresh();
      return;
    }

    if (user.role === "admin") {
      router.replace("/dashboard/admin");
      return;
    }

    if (user.role === "receiver") {
      router.replace(`/verification/${user.receiverType}`);
      return;
    }

    router.replace("/sign-in");
  } catch {
    setError("root", {
      message: "Invalid email or password",
    });
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6">Welcome back</h1>

        {errors.root && (
          <p className="mb-4 text-sm text-red-400">{errors.root.message}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full mb-1 p-3 rounded bg-slate-800"
        />
        {errors.email && (
          <p className="text-red-400 text-sm mb-3">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full mb-1 p-3 rounded bg-slate-800"
        />
        {errors.password && (
          <p className="text-red-400 text-sm mb-3">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </motion.form>
    </div>
  );
}
