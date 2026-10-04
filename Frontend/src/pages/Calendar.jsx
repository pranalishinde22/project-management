import { useMemo } from "react";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { useProjects } from "../context/ProjectContext";

function Calendar() {
  const navigate = useNavigate();
  const { projects, tasks } = useProjects();

  const tasksWithDueDates = useMemo(() => {
    return tasks
      .filter((task) => task.due)
      .map((task) => {
        const project = projects.find(
          (item) => String(item.id) === String(task.projectId)
        );

        return {
          ...task,
          projectName: project?.name || "Unknown Project",
        };
      })
      .sort((a, b) => new Date(a.due) - new Date(b.due));
  }, [tasks, projects]);

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
          <div className="mx-auto max-w-6xl">
            {/* PAGE HEADER */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-900 p-3 text-white dark:bg-[#8b5cf6] dark:text-white">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-[#f5f5f5]">
                    Calendar
                  </h1>

                  <p className="text-sm text-slate-500 dark:text-[#a7acad]">
                    View your tasks by due date.
                  </p>
                </div>
              </div>
            </div>

            {/* EMPTY STATE */}
            {tasksWithDueDates.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/20">
                <CalendarDays
                  size={42}
                  className="mx-auto mb-4 text-slate-300 dark:text-[#737b7d]"
                />

                <h2 className="text-lg font-semibold text-slate-800 dark:text-[#f5f5f5]">
                  No scheduled tasks
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-[#737b7d]">
                  Tasks with due dates will appear here.
                </p>
              </div>
            ) : (
              /* UPCOMING TASKS */
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/20">
                <div className="border-b border-slate-200 px-5 py-4 dark:border-[#343b3d]">
                  <h2 className="font-semibold text-slate-900 dark:text-[#f5f5f5]">
                    Upcoming Tasks
                  </h2>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-[#343b3d]">
                  {tasksWithDueDates.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-[#222829] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <CheckCircle2
                          size={20}
                          className={
                            task.status === "completed"
                              ? "mt-0.5 shrink-0 text-[#22c997]"
                              : "mt-0.5 shrink-0 text-slate-300 dark:text-[#737b7d]"
                          }
                        />

                        <div className="min-w-0">
                          <p className="break-words font-medium text-slate-800 dark:text-[#f5f5f5]">
                            {task.title}
                          </p>

                          <p className="mt-1 text-sm text-slate-500 dark:text-[#737b7d]">
                            {task.projectName}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-sm font-medium text-slate-600 dark:text-[#a7acad]">
                        {new Date(task.due).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Calendar;