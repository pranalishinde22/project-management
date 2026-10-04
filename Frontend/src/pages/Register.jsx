import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
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

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      setError("Please enter a correct email address.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 text-slate-900 dark:bg-[#111415] dark:text-[#f5f5f5]">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/30 sm:p-8">
          {/* HEADER */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-[#8b5cf6]">
              <span className="text-lg font-extrabold">
                F
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-[#f5f5f5]">
              Create an account
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-[#a7acad]">
              Create your account to get started.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            {/* NAME */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-[#a7acad]">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:placeholder:text-[#737b7d] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-[#a7acad]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:placeholder:text-[#737b7d] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-[#a7acad]">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:placeholder:text-[#737b7d] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-[#737b7d] dark:hover:bg-[#293235] dark:hover:text-[#f5f5f5]"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-[#a7acad]">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:placeholder:text-[#737b7d] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-[#737b7d] dark:hover:bg-[#293235] dark:hover:text-[#f5f5f5]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#8b5cf6] dark:text-white dark:hover:bg-[#7c3aed] dark:active:bg-[#6d28d9]"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-[#a7acad]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-slate-900 hover:underline dark:text-[#8b5cf6] dark:hover:text-[#a78bfa]"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;