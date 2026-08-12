"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }
      router.push("/login");
    } catch (err) {
      setError("Something went wrong");
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
          Create your account
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Find your match, one swipe at a time
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-500">
                {error}
              </div>
            )}

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
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>
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
