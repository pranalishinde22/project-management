import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskColumn from "../components/TaskColumn";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

import { useProjects } from "../context/ProjectContext";

const columns = [
  {
    id: "todo",
    label: "To Do",
    description: "Ready to start",
  },
  {
    id: "processing",
    label: "Processing",
    description: "Work in progress",
  },
  {
    id: "completed",
    label: "Completed",
    description: "Finished work",
  },
];

const initialTaskForm = {
  title: "",
  priority: "medium",
  due: "",
  assignee: "AM",
  status: "todo",
};

function Project() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const {
    projects,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  } = useProjects();

  const project = projects.find(
    (item) => String(item.id) === String(projectId)
  );

  const projectTasks = tasks.filter(
    (task) =>
      String(task.projectId) === String(projectId)
  );

  const [showTaskModal, setShowTaskModal] =
    useState(false);
  const [editingTask, setEditingTask] =
    useState(null);
  const [search, setSearch] = useState("");
  const [taskForm, setTaskForm] =
    useState(initialTaskForm);

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

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[#111415]">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900 dark:text-[#f5f5f5]">
            Project not found
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-[#8b5cf6] dark:text-white dark:hover:bg-[#7c3aed]"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const filteredTasks = projectTasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openCreateTask = () => {
    setEditingTask(null);
    setTaskForm({ ...initialTaskForm });
    setShowTaskModal(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);

    setTaskForm({
      title: task.title,
      priority: task.priority,
      due: task.due,
      assignee: task.assignee,
      status: task.status,
    });

    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    if (!taskForm.title.trim()) {
      setToast({
        message: "Task title is required.",
        type: "error",
      });
      return;
    }

    try {
      if (editingTask) {
        await updateTask(
          editingTask.id,
          taskForm
        );

        setToast({
          message: "Task updated successfully.",
          type: "success",
        });
      } else {
        await addTask({
          projectId: project.id,
          ...taskForm,
        });

        setToast({
          message: "Task created successfully.",
          type: "success",
        });
      }

      closeTaskModal();
    } catch (error) {
      setToast({
        message:
          error.message || "Failed to save task.",
        type: "error",
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await deleteTask(taskId);

      setToast({
        message: "Task deleted successfully.",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          error.message ||
          "Failed to delete task.",
        type: "error",
      });
    }
  };

  const handleTaskMove = async (
    taskId,
    newStatus
  ) => {
    try {
      await moveTask(taskId, newStatus);

      const statusNames = {
        todo: "To Do",
        processing: "Processing",
        completed: "Completed",
      };

      setToast({
        message: `Task moved to ${statusNames[newStatus]}.`,
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          error.message ||
          "Failed to change task status.",
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

      <Navbar />

      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar
          projects={projects}
          activeProject={project}
          onProjectClick={(selectedProject) =>
            navigate(
              `/project/${selectedProject.id}`
            )
          }
          onAddProject={() => navigate("/dashboard")}
        />

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {/* PROJECT HEADER */}
          <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <button
                onClick={() => navigate("/dashboard")}
                className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-slate-700 dark:text-[#737b7d] dark:hover:text-[#f5f5f5]"
              >
                <ArrowLeft size={14} />
                Back to dashboard
              </button>

              <div className="flex items-start gap-3">
                <div
                  className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${project.color}`}
                />

                <div className="min-w-0">
                  <h1 className="break-words text-2xl font-extrabold tracking-tight text-slate-950 dark:text-[#f5f5f5] sm:text-3xl">
                    {project.name}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500 dark:text-[#a7acad]">
                    {projectTasks.length}{" "}
                    {projectTasks.length === 1
                      ? "task"
                      : "tasks"}{" "}
                    in this project
                  </p>
                </div>
              </div>
            </div>

            {/* SEARCH + ADD TASK */}
            <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">
              <div className="relative min-w-0 flex-1 sm:flex-none">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#737b7d]"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search tasks..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#1b2021] dark:text-[#f5f5f5] dark:placeholder:text-[#737b7d] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20 sm:w-64"
                />
              </div>

              <button
                onClick={openCreateTask}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] dark:bg-[#8b5cf6] dark:text-white dark:hover:bg-[#7c3aed] sm:w-auto"
              >
                <Plus size={17} />
                Add task
              </button>
            </div>
          </div>

          {/* TASK COLUMNS */}
          <div className="overflow-x-auto pb-4">
            <div className="grid min-w-[980px] grid-cols-3 gap-4">
              {columns.map((column) => (
                <TaskColumn
                  key={column.id}
                  column={column}
                  tasks={filteredTasks.filter(
                    (task) =>
                      task.status === column.id
                  )}
                  onDrop={handleTaskMove}
                  onEdit={openEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>

          <p className="mt-1 text-center text-[11px] text-slate-400 dark:text-[#737b7d] sm:hidden">
            Swipe left or right to view all columns
          </p>
        </main>
      </div>

      {/* TASK MODAL */}
      {showTaskModal && (
        <Modal
          title={
            editingTask
              ? "Edit task"
              : "Create task"
          }
          onClose={closeTaskModal}
        >
          <form
            onSubmit={handleTaskSubmit}
            className="space-y-5 p-4 sm:p-5"
          >
            {/* TITLE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#a7acad]">
                Task title
              </label>

              <input
                autoFocus
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    title: e.target.value,
                  })
                }
                placeholder="Implement login page"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:placeholder:text-[#737b7d] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20"
              />
            </div>

            {/* PRIORITY */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#a7acad]">
                Priority
              </label>

              <select
                value={taskForm.priority}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    priority: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-4 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20"
              >
                <option value="low">
                  Low
                </option>
                <option value="medium">
                  Medium
                </option>
                <option value="high">
                  High
                </option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#a7acad]">
                Status
              </label>

              <select
                value={taskForm.status}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    status: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-4 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20"
              >
                <option value="todo">
                  To Do
                </option>
                <option value="processing">
                  Processing
                </option>
                <option value="completed">
                  Completed
                </option>
              </select>
            </div>

            {/* DUE DATE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#a7acad]">
                Due date
              </label>

              <input
                type="date"
                value={taskForm.due}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    due: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-4 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20"
              />
            </div>

            {/* ASSIGNEE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#a7acad]">
                Assignee initials
              </label>

              <input
                maxLength={3}
                value={taskForm.assignee}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    assignee:
                      e.target.value.toUpperCase(),
                  })
                }
                placeholder="AM"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase text-slate-900 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-[#343b3d] dark:bg-[#15191a] dark:text-[#f5f5f5] dark:placeholder:text-[#737b7d] dark:focus:border-[#8b5cf6] dark:focus:ring-[#8b5cf6]/20"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeTaskModal}
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 active:bg-slate-100 dark:text-[#a7acad] dark:hover:bg-[#222829] dark:active:bg-[#293235] sm:w-auto sm:py-2.5"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] dark:bg-[#8b5cf6] dark:text-white dark:hover:bg-[#7c3aed] sm:w-auto sm:py-2.5"
              >
                {editingTask
                  ? "Save changes"
                  : "Create task"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Project;