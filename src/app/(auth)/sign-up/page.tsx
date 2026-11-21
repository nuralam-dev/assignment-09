"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";

import AuthLayout from "@/components/auth/AuthLayout";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { toast } from "@/components/ui/toast";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Input Change Function
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form Submit Function
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    // Required Field Validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Password Length Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Uppercase Letter Validation
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain an uppercase letter.");
      return;
    }

    // Lowercase Letter Validation
    if (!/[a-z]/.test(password)) {
      setError("Password must contain a lowercase letter.");
      return;
    }

    // Confirm Password Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // TODO: Implement BetterAuth Sign Up here.

    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password: password,
        callbackURL: "/",
      });
      if (error) {
        console.log("Sign Up Error:", error);
        setError(error.message || "Failed to create account.");
        toast.add({
          type: "error",
          title: "Sign up failed",
          description: error.message || "Failed to create account.",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Success",
        description: "Account created successfully.",
      });

      // Redirect only after successful sign up
      router.push("/");
    } catch (err) {
      console.error("Unexpected Sign Up Error:", err);
      setError("Something went wrong. Please try again.");
      toast.add({
        type: "error",
        title: "Sign up failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <AuthLayout>
      <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xl shadow-gray-200/50 sm:p-10">
        {/* Header */}
        <div className="mb-7">
          <span className="inline-block rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
            Join FixMate
          </span>

          <h1 className="mt-5 text-3xl font-bold text-slate-800">
            Create Your Account
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Join FixMate and get started with reliable repair services.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Full Name
            </label>

            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="signup-email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>

            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

              <input
                id="signup-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signup-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:bg-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-teal-700"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              At least 6 characters with uppercase and lowercase letters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Confirm Password
            </label>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:bg-white"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-teal-700"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
          >
            Create Account
            <FiArrowRight />
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-sm text-gray-400">Or sign up with</span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google Sign Up */}
        <GoogleAuthButton text="Sign Up with Google" />

        {/* Sign In Link */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-teal-700 transition hover:text-orange-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
