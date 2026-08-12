"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { login } from "@/lib/actions/auth";
import { signIn } from "next-auth/react";

export default function LoginPage() {
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

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <Link href="/" className="text-3xl font-bold text-red-500">
          Finder ❤️
        </Link>
        <h2 className="mt-6 text-xl font-semibold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Sign in to keep the conversation going
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
                  onChange={handleChange}
                  value={form.email}
                  required
                  autoComplete="email"
                  className="block w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none border border-gray-200 placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-red-400 hover:text-red-500"
                >
                  Forgot password?
                </a>
              </div>
              <div className="mt-1.5">
                <input
                  id="password"
                  type="password"
                  onChange={handleChange}
                  value={form.password}
                  name="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none border border-gray-200 placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <button
            onClick={() => login()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95 transition"
          >
            <FaGithub />
            Continue with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Not a member?{" "}
          <Link
            href="/signup"
            className="font-semibold text-red-500 hover:text-red-600"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
