import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  CheckCircle2,
  CircleHelp,
  FolderKanban,
  X,
  Camera,
  User,
  LogOut,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectContext";

function Navbar({
  onMenuClick,
  searchValue = "",
  onSearchChange,
}) {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { projects, tasks } = useProjects();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedPicture = localStorage.getItem(
      "flowboard_profile_picture"
    );

    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
  }, []);

  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const handleProfileClick = () => {
    setShowProfile((current) => !current);
    setShowNotifications(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications((current) => !current);
    setShowProfile(false);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Profile picture must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setProfilePicture(imageData);

      localStorage.setItem(
        "flowboard_profile_picture",
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

    setProfilePicture("");
    localStorage.removeItem("flowboard_profile_picture");
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    logout();
    navigate("/login");
  };

  const initials =
    user?.name?.slice(0, 2).toUpperCase() || "AM";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur dark:border-[#343b3d] dark:bg-[#15191a]/95 dark:text-[#f5f5f5]">
      <div className="flex h-full items-center justify-between px-3 sm:px-6">
        {/* LEFT SIDE */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="shrink-0 rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 active:bg-slate-200 dark:text-[#a7acad] dark:hover:bg-[#222829] dark:active:bg-[#293235] lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-[#8b5cf6] dark:text-white">
            <span className="font-bold">F</span>
          </div>

          <div className="hidden min-w-0 sm:block">
            <div className="text-sm font-extrabold text-slate-900 dark:text-[#f5f5f5]">
              FlowBoard
            </div>

            <div className="text-[10px] font-medium text-slate-400 dark:text-[#737b7d]">
              PROJECT MANAGEMENT
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="hidden max-w-md flex-1 px-6 md:block lg:px-8">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#737b7d]"
            />

            <input
              type="search"
              value={searchValue}
              onChange={(event) =>
                onSearchChange?.(event.target.value)
              }
              placeholder="Search projects..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#1b2021] dark:text-[#f5f5f5] dark:placeholder:text-[#737b7d] dark:focus:bg-[#1b2021] dark:focus:ring-[#8b5cf6]/10"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {/* NOTIFICATIONS */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={handleNotificationClick}
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 active:bg-slate-200 dark:text-[#a7acad] dark:hover:bg-[#222829] dark:active:bg-[#293235]"
            >
              <Bell size={18} />

              {(totalTasks > 0 || totalProjects > 0) && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#22c997]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/30">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-[#343b3d]">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#f5f5f5]">
                      Notifications
                    </h3>

                    <p className="mt-0.5 text-[11px] text-slate-400 dark:text-[#737b7d]">
                      Your workspace summary
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowNotifications(false)
                    }
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-[#737b7d] dark:hover:bg-[#293235] dark:hover:text-[#f5f5f5]"
                    aria-label="Close notifications"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {/* PROJECTS */}
                  <div className="flex gap-3 border-b border-slate-100 px-4 py-3 dark:border-[#343b3d]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-[#293235] dark:text-[#a7acad]">
                      <FolderKanban size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-[#f5f5f5]">
                        Projects
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500 dark:text-[#a7acad]">
                        You currently have{" "}
                        <span className="font-semibold text-slate-700 dark:text-[#f5f5f5]">
                          {totalProjects}
                        </span>{" "}
                        {totalProjects === 1
                          ? "project"
                          : "projects"}.
                      </p>
                    </div>
                  </div>

                  {/* TASKS */}
                  <div className="flex gap-3 border-b border-slate-100 px-4 py-3 dark:border-[#343b3d]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-[#293235] dark:text-[#a7acad]">
                      <CircleHelp size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-[#f5f5f5]">
                        Tasks
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500 dark:text-[#a7acad]">
                        You have{" "}
                        <span className="font-semibold text-slate-700 dark:text-[#f5f5f5]">
                          {todoTasks}
                        </span>{" "}
                        tasks waiting to be completed.
                      </p>
                    </div>
                  </div>

                  {/* COMPLETED */}
                  <div className="flex gap-3 px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-[#293235] dark:text-[#22c997]">
                      <CheckCircle2 size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-[#f5f5f5]">
                        Completed
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500 dark:text-[#a7acad]">
                        You have completed{" "}
                        <span className="font-semibold text-slate-700 dark:text-[#f5f5f5]">
                          {completedTasks}
                        </span>{" "}
                        {completedTasks === 1
                          ? "task"
                          : "tasks"}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative">
            <button
              type="button"
              onClick={handleProfileClick}
              className="flex items-center gap-2 rounded-xl border-l border-slate-200 pl-2 sm:pl-3 dark:border-[#343b3d]"
              aria-label="Open profile menu"
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-transparent dark:ring-[#343b3d]"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-[#8b5cf6] dark:text-white">
                  {initials}
                </div>
              )}

              <div className="hidden min-w-0 text-left lg:block">
                <div className="max-w-[140px] truncate text-xs font-bold text-slate-800 dark:text-[#f5f5f5]">
                  {user?.name}
                </div>

                <div className="max-w-[140px] truncate text-[10px] text-slate-400 dark:text-[#737b7d]">
                  {user?.email}
                </div>
              </div>

              <ChevronDown
                size={15}
                className={`hidden shrink-0 text-slate-400 transition dark:text-[#737b7d] lg:block ${
                  showProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/30">
                {/* PROFILE HEADER */}
                <div className="border-b border-slate-100 px-4 py-4 dark:border-[#343b3d]">
                  <div className="flex items-center gap-3">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-[#343b3d]"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-[#8b5cf6] dark:text-white">
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-[#f5f5f5]">
                        {user?.name}
                      </p>

                      <p className="truncate text-xs text-slate-400 dark:text-[#737b7d]">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PROFILE ACTIONS */}
                <div className="border-b border-slate-100 p-2 dark:border-[#343b3d]">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-[#a7acad] dark:hover:bg-[#222829] dark:hover:text-[#f5f5f5]"
                  >
                    <Camera size={17} />

                    <span>
                      {profilePicture
                        ? "Change profile picture"
                        : "Add profile picture"}
                    </span>
                  </button>

                  {profilePicture && (
                    <button
                      type="button"
                      onClick={handleRemoveProfilePicture}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <X size={17} />
                      Remove profile picture
                    </button>
                  )}
                </div>

                {/* PROFILE */}
                <div className="border-b border-slate-100 p-2 dark:border-[#343b3d]">
                  <button
                    type="button"
                    onClick={() => setShowProfile(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-[#a7acad] dark:hover:bg-[#222829] dark:hover:text-[#f5f5f5]"
                  >
                    <User size={17} />
                    My profile
                  </button>
                </div>

                {/* LOGOUT */}
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;