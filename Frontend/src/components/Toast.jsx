function Toast({
  message,
  type = "success",
  onClose,
}) {
  if (!message) {
    return null;
  }

  const isError = type === "error";

  return (
    <div className="fixed left-4 right-4 top-4 z-[100] sm:left-auto sm:right-5 sm:top-5">
      <div
        className={`flex w-full items-start gap-3 rounded-xl border bg-white px-4 py-3 text-slate-900 shadow-xl dark:bg-black dark:text-white sm:w-auto sm:max-w-md ${
          isError
            ? "border-red-200 dark:border-red-500/50"
            : "border-slate-200 dark:border-slate-700"
        }`}
      >
        <span className="min-w-0 flex-1 break-words text-sm font-medium">
          {message}
        </span>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="shrink-0 rounded-md px-2 py-1 text-sm font-bold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:bg-slate-200 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;