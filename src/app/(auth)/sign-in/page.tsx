"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

import AuthLayout from "@/components/auth/AuthLayout";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { toast } from "@/components/ui/toast";
import { signIn } from "@/lib/auth-client";
import { serviceCallback } from "@/lib/auth-redirect";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim() || !formData.password) {
      setError("Please fill in all fields.");
      toast.add({
        type: "error",
        title: "Sign in failed",
        description: "Please fill in all fields.",
      });
      return;
    }

    try {
      const { error } = await signIn.email({
        email: formData.email, 
        password: formData.password, 
        rememberMe: true, 
        callbackURL: serviceCallback(new URLSearchParams(window.location.search).get("callbackURL")),
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Sign in failed",
          description: error.message || "Failed to sign in. Please try again.",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Success",
        description: "Signed in successfully.",
      });

    } catch {
      toast.add({
        type: "error",
        title: "Sign in failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <AuthLayout>
      <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xl shadow-gray-200/50 sm:p-10">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
            Welcome Back
          </span>

          <h1 className="mt-5 text-3xl font-bold text-slate-800">
            Sign In to FixMate
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>

            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

              <input
                id="email"
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
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" className="h-4 w-4 accent-teal-700" />
              Remember me
            </label>

            {/* TODO: Implement password reset later */}
            <span className="text-sm font-medium text-teal-700">
              Forgot Password?
            </span>
          </div>

          {/* Error */}
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
            Sign In
            <FiArrowRight />
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-sm text-gray-400">Or continue with</span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google Authentication */}
        <GoogleAuthButton text="Continue with Google" />

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-teal-700 transition hover:text-orange-500"
          >
            Create Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
