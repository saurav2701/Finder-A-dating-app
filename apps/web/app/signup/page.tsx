"use client";
import axios from "axios";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendotp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("api/signup/send-otp", { email: form.email });
      setStep("otp");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("api/signup/verify-otp", {
        email: form.email,
        otp,
        password: form.password,
      });
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "somthing went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <Link href="/" className="text-3xl font-bold text-red-500">
          Finder ❤️
        </Link>
        <h2 className="mt-6 text-xl font-semibold text-gray-900">
          {step === "details" ? "Create your account" : "Verify your email"}
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          {step === "details"
            ? "Find your match, one swipe at a time"
            : `Enter the code we sent to ${form.email}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-500">
              {error}
            </div>
          )}

          {step === "details" ? (
            <form onSubmit={handleSendotp} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1.5">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="block w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none border border-gray-200 placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1.5">
                  <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    name="password"
                    required
                    autoComplete="new-password"
                    className="block w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none border border-gray-200 placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-full bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending code..." : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Verification code
                </label>
                <div className="mt-1.5">
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    autoComplete="one-time-code"
                    className="block w-full rounded-lg bg-gray-50 px-3 py-2.5 text-center text-lg tracking-[0.5em] text-gray-900 outline-none border border-gray-200 placeholder:text-gray-400 placeholder:tracking-normal placeholder:text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                    placeholder="123456"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-full bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & create account"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-red-500 hover:text-red-600"
          >
            Sign in now
          </Link>
        </p>
      </div>
    </div>
  );
}
