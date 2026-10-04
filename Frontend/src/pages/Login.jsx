import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6 text-slate-900 dark:bg-[#111415] dark:text-[#f5f5f5] sm:px-6 sm:py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/30 sm:p-8">
          {/* HEADER */}
          <div className="mb-6 text-center sm:mb-8">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-[#8b5cf6]">
              <span className="text-lg font-extrabold">
                F
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-[#f5f5f5] sm:text-3xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-[#a7acad] sm:leading-6">
              Login to your project management account
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm leading-5 text-red-600 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-400 sm:px-4">
              {error}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-[#a7acad]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:placeholder:text-[#737b7d] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20 sm:text-base"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-[#a7acad]">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:placeholder:text-[#737b7d] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20 sm:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800 active:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#8b5cf6] dark:text-white dark:hover:bg-[#7c3aed] dark:active:bg-[#6d28d9]"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="mt-6 text-center text-sm leading-5 text-slate-500 dark:text-[#a7acad]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-slate-900 hover:underline dark:text-[#8b5cf6] dark:hover:text-[#a78bfa]"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;