import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleHelp,
  Clock3,
  FolderKanban,
  ListFilter,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

import { useProjects } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    projects,
    tasks,
    addProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const [showProjectModal, setShowProjectModal] =
    useState(false);
  const [editingProject, setEditingProject] =
    useState(null);
  const [projectName, setProjectName] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!toast.message) return;

    const timer = setTimeout(() => {
      setToast({
        message: "",
        type: "success",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.message]);

  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const processingTasks = tasks.filter(
    (task) => task.status === "processing"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const filteredProjects = projects.filter((project) =>
    project.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(
      (task) => task.projectId === projectId
    );

    const completed = projectTasks.filter(
      (task) => task.status === "completed"
    ).length;

    const progress =
      projectTasks.length === 0
        ? 0
        : Math.round(
            (completed / projectTasks.length) * 100
          );

    return {
      taskCount: projectTasks.length,
      progress,
    };
  };

  const openCreateProject = () => {
    setEditingProject(null);
    setProjectName("");
    setShowProjectModal(true);
  };

  const openEditProject = (project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setShowProjectModal(true);
  };

  const closeProjectModal = () => {
    setShowProjectModal(false);
    setEditingProject(null);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setToast({
        message: "Project name is required.",
        type: "error",
      });
      return;
    }

    try {
      if (editingProject) {
        await updateProject(
          editingProject.id,
          projectName.trim()
        );

        setToast({
          message: "Project updated successfully.",
          type: "success",
        });
      } else {
        await addProject(projectName.trim());

        setToast({
          message: "Project created successfully.",
          type: "success",
        });
      }

      setProjectName("");
      setEditingProject(null);
      setShowProjectModal(false);
    } catch (error) {
      setToast({
        message:
          error.message || "Something went wrong.",
        type: "error",
      });
    }
  };

  const handleDeleteProject = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This will also delete all tasks inside this project.`
    );

    if (!confirmed) return;

    try {
      await deleteProject(project.id);

      setToast({
        message: "Project deleted successfully.",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          error.message || "Failed to delete project.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900 dark:bg-[#111415] dark:text-[#f5f5f5]">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />

      <Navbar
        onMenuClick={() => setMobileMenu(true)}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar
          projects={projects}
          activeProject={null}
          onProjectClick={(project) =>
            navigate(`/project/${project.id}`)
          }
          onAddProject={openCreateProject}
        />

        {mobileMenu && (
          <Sidebar
            mobile
            projects={projects}
            activeProject={null}
            onProjectClick={(project) => {
              setMobileMenu(false);
              navigate(`/project/${project.id}`);
            }}
            onAddProject={() => {
              setMobileMenu(false);
              openCreateProject();
            }}
            onClose={() => setMobileMenu(false)}
          />
        )}

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold text-slate-400 dark:text-[#737b7d]">
                Workspace
              </p>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-[#f5f5f5] sm:text-3xl">
                Good morning,{" "}
                {user?.name?.split(" ")[0] || "there"}
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-[#a7acad]">
                Here's what's happening across your
                projects.
              </p>
            </div>

            <button
              onClick={openCreateProject}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] dark:bg-[#8b5cf6] dark:text-white dark:hover:bg-[#7c3aed] sm:w-auto sm:py-2.5"
            >
              <Plus size={17} />
              New project
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="mb-7 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            <StatCard
              title="Total projects"
              value={projects.length}
              icon={ListFilter}
            />

            <StatCard
              title="To do"
              value={todoTasks}
              icon={CircleHelp}
            />

            <StatCard
              title="In progress"
              value={processingTasks}
              icon={Clock3}
            />

            <StatCard
              title="Completed"
              value={completedTasks}
              icon={CheckCircle2}
            />
          </div>

          {/* PROJECT SECTION */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#f5f5f5]">
              Your projects
            </h2>

            <p className="mt-1 text-xs text-slate-400 dark:text-[#737b7d]">
              Select a project to manage its tasks.
            </p>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center shadow-sm dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/20 sm:p-12">
              <FolderKanban
                size={40}
                className="mx-auto text-slate-300 dark:text-[#737b7d]"
              />

              <h3 className="mt-4 font-bold text-slate-800 dark:text-[#f5f5f5]">
                {search.trim()
                  ? "No projects found"
                  : "No projects yet"}
              </h3>

              <p className="mt-1 text-sm text-slate-400 dark:text-[#737b7d]">
                {search.trim()
                  ? `No project matches "${search}".`
                  : "Create your first project to get started."}
              </p>

              {!search.trim() && (
                <button
                  onClick={openCreateProject}
                  className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] dark:bg-[#8b5cf6] dark:text-white dark:hover:bg-[#7c3aed] sm:w-auto sm:py-2.5"
                >
                  Create project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProjects.map((project) => {
                const stats = getProjectStats(
                  project.id
                );

                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    taskCount={stats.taskCount}
                    progress={stats.progress}
                    onOpen={() =>
                      navigate(
                        `/project/${project.id}`
                      )
                    }
                    onEdit={() =>
                      openEditProject(project)
                    }
                    onDelete={() =>
                      handleDeleteProject(project)
                    }
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* PROJECT MODAL */}
      {showProjectModal && (
        <Modal
          title={
            editingProject
              ? "Edit project"
              : "Create project"
          }
          onClose={closeProjectModal}
        >
          <form
            onSubmit={handleProjectSubmit}
            className="p-4 sm:p-5"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#a7acad]">
                Project name
              </span>

              <input
                autoFocus
                value={projectName}
                onChange={(e) =>
                  setProjectName(e.target.value)
                }
                placeholder="Website Redesign"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:placeholder:text-[#737b7d] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20"
              />
            </label>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeProjectModal}
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 active:bg-slate-100 dark:text-[#a7acad] dark:hover:bg-[#222829] dark:active:bg-[#293235] sm:w-auto sm:py-2.5"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] dark:bg-[#8b5cf6] dark:text-white dark:hover:bg-[#7c3aed] sm:w-auto sm:py-2.5"
              >
                {editingProject
                  ? "Save changes"
                  : "Create project"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/20 dark:hover:bg-[#222829] sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 dark:text-[#737b7d]">
          {title}
        </span>

        <span className="rounded-lg bg-slate-50 p-2 text-slate-500 dark:bg-[#293235] dark:text-[#a7acad]">
          <Icon size={15} />
        </span>
      </div>

      <div className="text-2xl font-extrabold text-slate-950 dark:text-[#f5f5f5]">
        {value}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  taskCount,
  progress,
  onOpen,
  onEdit,
  onDelete,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/20 dark:hover:bg-[#222829] dark:hover:shadow-black/30 sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={onOpen}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${project.color} text-white`}
        >
          <FolderKanban size={19} />
        </button>

        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-100 hover:text-slate-700 active:bg-slate-200 dark:text-[#737b7d] dark:hover:bg-[#293235] dark:hover:text-[#f5f5f5] dark:active:bg-[#343b3d]"
            title="Edit project"
          >
            <Pencil size={15} />
          </button>

          <button
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500 active:bg-red-100 dark:text-[#737b7d] dark:hover:bg-red-950/40 dark:hover:text-red-400 dark:active:bg-red-950/60"
            title="Delete project"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <button
        onClick={onOpen}
        className="block w-full text-left"
      >
        <h3 className="break-words font-bold text-slate-900 dark:text-[#f5f5f5]">
          {project.name}
        </h3>

        <p className="mt-1 text-xs text-slate-400 dark:text-[#737b7d]">
          {taskCount}{" "}
          {taskCount === 1 ? "task" : "tasks"}
        </p>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-[#293235]">
          <div
            className="h-full rounded-full bg-slate-900 transition-all dark:bg-[#8b5cf6]"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-2 text-right text-[10px] font-semibold text-slate-400 dark:text-[#737b7d]">
          {progress}% complete
        </div>
      </button>
    </div>
  );
}

export default Dashboard;