import {
  CalendarDays,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

function TaskCard({
  task,
  onEdit,
  onDelete,
}) {
  const priorityStyle = {
    high: "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400",
    medium:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    low:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  };

  const formattedDate = task.due
    ? new Date(task.due).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        }
      )
    : "No date";

  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData(
          "taskId",
          String(task.id)
        );
      }}
      className="group cursor-grab rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/20 dark:hover:bg-[#222829] dark:hover:shadow-black/30 sm:p-4"
    >
      {/* TASK HEADER */}
      <div className="mb-3 flex items-start justify-between gap-2 sm:gap-3">
        <p className="min-w-0 break-words text-sm font-semibold leading-5 text-slate-800 dark:text-[#f5f5f5]">
          {task.title}
        </p>

        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label="Task options"
          className="shrink-0 rounded-lg p-2 text-slate-300 transition hover:bg-slate-100 hover:text-slate-700 active:bg-slate-200 dark:text-[#737b7d] dark:hover:bg-[#293235] dark:hover:text-[#f5f5f5] dark:active:bg-[#343b3d]"
        >
          <MoreHorizontal size={17} />
        </button>
      </div>

      {/* PRIORITY + DATE */}
      <div className="mb-3 flex flex-wrap gap-2">
        <span
          className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${
            priorityStyle[task.priority]
          }`}
        >
          {task.priority}
        </span>

        <span className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-400 dark:bg-[#293235] dark:text-[#a7acad]">
          <CalendarDays size={11} />

          {formattedDate}
        </span>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-[#343b3d]">
        {/* ASSIGNEE */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[8px] font-bold text-white dark:bg-[#8b5cf6] dark:text-white">
          {task.assignee || "NA"}
        </div>

        {/* ACTIONS */}
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:bg-slate-200 dark:text-[#737b7d] dark:hover:bg-[#293235] dark:hover:text-[#f5f5f5] dark:active:bg-[#343b3d]"
            title="Edit task"
            aria-label="Edit task"
          >
            <Pencil size={13} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-md p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:bg-red-100 dark:text-[#737b7d] dark:hover:bg-red-950/50 dark:hover:text-red-400 dark:active:bg-red-950/70"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;