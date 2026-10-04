import {
  CheckCircle2,
  CircleHelp,
  Clock3,
} from "lucide-react";

import TaskCard from "./TaskCard";

function TaskColumn({
  column,
  tasks,
  onDrop,
  onEdit,
  onDelete,
}) {
  const icons = {
    todo: CircleHelp,
    processing: Clock3,
    completed: CheckCircle2,
  };

  const Icon = icons[column.id];

  return (
    <section
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();

        const taskId =
          event.dataTransfer.getData("taskId");

        onDrop(taskId, column.id);
      }}
      className="min-h-[400px] rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-[#343b3d] dark:bg-[#15191a] sm:min-h-[420px] sm:p-3.5"
    >
      {/* COLUMN HEADER */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <div className="shrink-0 rounded-lg bg-white p-2 text-slate-500 shadow-sm dark:bg-[#293235] dark:text-[#a7acad]">
            <Icon size={16} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-800 dark:text-[#f5f5f5]">
              {column.label}
            </h3>

            <p className="truncate text-[10px] text-slate-400 dark:text-[#737b7d]">
              {column.description}
            </p>
          </div>
        </div>

        {/* TASK COUNT */}
        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm dark:bg-[#293235] dark:text-[#a7acad]">
          {tasks.length}
        </span>
      </div>

      {/* TASKS */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        {/* EMPTY COLUMN */}
        {tasks.length === 0 && (
          <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 px-3 text-center text-xs text-slate-400 dark:border-[#343b3d] dark:bg-[#1b2021]/50 dark:text-[#737b7d] sm:min-h-32">
            Drop tasks here
          </div>
        )}
      </div>
    </section>
  );
}

export default TaskColumn;