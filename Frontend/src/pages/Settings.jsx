import { useEffect, useState } from "react";
import {
  Camera,
  LogOut,
  Settings as SettingsIcon,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectContext";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { projects } = useProjects();

  const [profilePicture, setProfilePicture] = useState("");

  // Load profile picture for the currently logged-in user
  useEffect(() => {
    if (!user?.email) {
      setProfilePicture("");
      return;
    }

    const storageKey = `flowboard_profile_picture_${user.email}`;
    const savedPicture = localStorage.getItem(storageKey);

    setProfilePicture(savedPicture || "");
  }, [user]);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(
        "Profile picture must be smaller than 2MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      if (!user?.email) return;

      const storageKey = `flowboard_profile_picture_${user.email}`;

      setProfilePicture(imageData);

      localStorage.setItem(
        storageKey,
        imageData
      );
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePicture = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );

    if (!confirmed) return;

    if (!user?.email) return;

    const storageKey = `flowboard_profile_picture_${user.email}`;

    setProfilePicture("");

    localStorage.removeItem(storageKey);
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    logout();
    navigate("/login");
  };

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#111415] dark:text-[#f5f5f5]">
      <Navbar />

      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar
          projects={projects}
          activeProject={null}
          onProjectClick={(project) =>
            navigate(`/project/${project.id}`)
          }
          onAddProject={() => navigate("/dashboard")}
        />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">

            {/* PAGE HEADER */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-900 p-3 text-white dark:bg-[#8b5cf6] dark:text-white">
                  <SettingsIcon size={22} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-[#f5f5f5]">
                    Settings
                  </h1>

                  <p className="text-sm text-slate-500 dark:text-[#a7acad]">
                    Manage your account and preferences.
                  </p>
                </div>
              </div>
            </div>

            {/* PROFILE PICTURE */}
            <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/20">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-[#343b3d]">
                <div className="flex items-center gap-2">
                  <Camera
                    size={18}
                    className="text-slate-700 dark:text-[#a7acad]"
                  />

                  <h2 className="font-semibold text-slate-900 dark:text-[#f5f5f5]">
                    Profile picture
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center">
                {/* PROFILE IMAGE */}
                <div className="relative shrink-0">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-3xl font-bold text-white ring-4 ring-slate-100 dark:bg-[#8b5cf6] dark:text-white dark:ring-[#293235]">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Current profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      userInitial
                    )}
                  </div>

                  {profilePicture && (
                    <button
                      type="button"
                      onClick={
                        handleRemoveProfilePicture
                      }
                      aria-label="Remove profile picture"
                      className="absolute -right-1 -top-1 rounded-full border border-white bg-red-500 p-1.5 text-white shadow-sm transition hover:bg-red-600 dark:border-[#1b2021]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* PROFILE CONTROLS */}
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-[#f5f5f5]">
                    Current profile picture
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-[#a7acad]">
                    Upload a new image or remove your
                    current profile picture.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:bg-slate-950 dark:bg-[#8b5cf6] dark:text-white dark:hover:bg-[#7c3aed] dark:active:bg-[#6d28d9]">
                      <Camera size={16} />

                      {profilePicture
                        ? "Change picture"
                        : "Add picture"}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          handleProfilePictureChange
                        }
                        className="hidden"
                      />
                    </label>

                    {profilePicture && (
                      <button
                        type="button"
                        onClick={
                          handleRemoveProfilePicture
                        }
                        className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:bg-red-100 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-950/40 dark:active:bg-red-950/60"
                      >
                        Remove picture
                      </button>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-400 dark:text-[#737b7d]">
                    JPG, PNG or other image formats.
                    Maximum size: 2MB.
                  </p>
                </div>
              </div>
            </section>

            {/* ACCOUNT */}
            <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/20">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-[#343b3d]">
                <div className="flex items-center gap-2">
                  <User
                    size={18}
                    className="text-slate-700 dark:text-[#a7acad]"
                  />

                  <h2 className="font-semibold text-slate-900 dark:text-[#f5f5f5]">
                    Account
                  </h2>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-[#737b7d]">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800 dark:text-[#f5f5f5]">
                    {user?.name || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-[#737b7d]">
                    Email
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-slate-800 dark:text-[#f5f5f5]">
                    {user?.email || "Not available"}
                  </p>
                </div>
              </div>
            </section>

            {/* APPEARANCE */}
            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/20">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-[#f5f5f5]">
                Appearance
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-[#a7acad]">
                Choose the theme.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* LIGHT */}
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`rounded-xl border px-4 py-4 text-left transition ${
                    theme === "light"
                      ? "border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-100 dark:border-[#8b5cf6] dark:bg-[#293235] dark:text-[#a78bfa] dark:ring-[#8b5cf6]/20"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#a7acad] dark:hover:bg-[#222829] dark:active:bg-[#293235]"
                  }`}
                >
                  <div className="text-base font-semibold">
                    ☀️ Light
                  </div>

                  <p className="mt-1 text-xs text-slate-500 dark:text-[#737b7d]">
                    Use the light appearance.
                  </p>
                </button>

                {/* DARK */}
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`rounded-xl border px-4 py-4 text-left transition ${
                    theme === "dark"
                      ? "border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-100 dark:border-[#8b5cf6] dark:bg-[#293235] dark:text-[#a78bfa] dark:ring-[#8b5cf6]/20"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#a7acad] dark:hover:bg-[#222829] dark:active:bg-[#293235]"
                  }`}
                >
                  <div className="text-base font-semibold">
                    🌙 Dark
                  </div>

                  <p className="mt-1 text-xs text-slate-500 dark:text-[#737b7d]">
                    Use the dark appearance.
                  </p>
                </button>
              </div>
            </section>

            {/* LOGOUT */}
            <section className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm dark:border-red-500/20 dark:bg-[#1b2021] dark:shadow-black/20">
              <div className="p-5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:bg-red-200 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 dark:active:bg-red-950/70"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;