import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  X,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar({
  projects,
  activeProject,
  onProjectClick,
  onAddProject,
  onClose,
  mobile = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    logout();
    navigate("/login");
  };

  const sidebar = (
    <aside className="flex h-full w-64 max-w-[85vw] flex-col border-r border-slate-200 bg-white p-3 text-slate-900 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] sm:p-4">
      {/* WORKSPACE */}
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#737b7d]">
          Workspace
        </span>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-[#a7acad] dark:hover:bg-[#222829] dark:hover:text-[#f5f5f5] dark:active:bg-[#293235]"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* MAIN NAVIGATION */}
      <nav className="space-y-1">
        {/* DASHBOARD */}
        <button
          type="button"
          onClick={() => {
            navigate("/dashboard");

            if (mobile) {
              onClose();
            }
          }}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-[#222829] dark:active:bg-[#293235] ${
            location.pathname === "/dashboard"
              ? "font-bold text-slate-900 dark:bg-[#222829] dark:text-[#f5f5f5]"
              : "font-medium text-slate-500 dark:text-[#a7acad]"
          }`}
        >
          <LayoutDashboard
            size={17}
            className="shrink-0"
          />

          <span>Dashboard</span>
        </button>

        {/* CALENDAR */}
        <button
          type="button"
          onClick={() => {
            navigate("/calendar");

            if (mobile) {
              onClose();
            }
          }}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-[#222829] dark:active:bg-[#293235] ${
            location.pathname === "/calendar"
              ? "font-bold text-slate-900 dark:bg-[#222829] dark:text-[#f5f5f5]"
              : "font-medium text-slate-500 dark:text-[#a7acad]"
          }`}
        >
          <CalendarDays
            size={17}
            className="shrink-0"
          />

          <span>Calendar</span>
        </button>
      </nav>

      {/* PROJECTS HEADER */}
      <div className="mb-2 mt-7 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#737b7d]">
          My projects
        </span>

        <button
          type="button"
          onClick={onAddProject}
          aria-label="Add project"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-[#737b7d] dark:hover:bg-[#222829] dark:hover:text-[#f5f5f5] dark:active:bg-[#293235]"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* PROJECT LIST */}
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => {
              onProjectClick(project);

              if (mobile) {
                onClose();
              }
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition active:scale-[0.99] ${
              activeProject?.id === project.id
                ? "bg-slate-950 font-semibold text-white dark:bg-[#8b5cf6] dark:text-white"
                : "text-slate-600 hover:bg-slate-50 active:bg-slate-100 dark:text-[#a7acad] dark:hover:bg-[#222829] dark:active:bg-[#293235]"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${project.color}`}
            />

            <span className="min-w-0 truncate">
              {project.name}
            </span>
          </button>
        ))}
      </div>

      {/* BOTTOM MENU */}
      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-[#343b3d]">
        {/* SETTINGS */}
        <button
          type="button"
          onClick={() => {
            navigate("/settings");

            if (mobile) {
              onClose();
            }
          }}
          className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-[#222829] dark:active:bg-[#293235] ${
            location.pathname === "/settings"
              ? "font-bold text-slate-900 dark:bg-[#222829] dark:text-[#f5f5f5]"
              : "font-medium text-slate-500 dark:text-[#a7acad]"
          }`}
        >
          <Settings
            size={17}
            className="shrink-0"
          />

          <span>Settings</span>
        </button>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 active:bg-red-100 dark:text-red-400 dark:hover:bg-red-950/30 dark:active:bg-red-950/50"
        >
          <LogOut
            size={17}
            className="shrink-0"
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  if (!mobile) {
    return (
      <div className="hidden lg:block">
        {sidebar}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close sidebar"
        className="absolute inset-0 bg-slate-950/30 dark:bg-black/60"
      />

      <div className="relative h-full w-72 max-w-[85vw] shadow-2xl dark:shadow-black/50">
        {sidebar}
      </div>
    </div>
  );
}

export default Sidebar;