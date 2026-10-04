import { X } from "lucide-react";

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-sm dark:bg-black/70 sm:p-4">
      <div className="my-3 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/50 sm:my-4">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-[#343b3d] sm:px-5 sm:py-4">
          <h2 className="min-w-0 flex-1 break-words text-base font-bold text-slate-900 dark:text-[#f5f5f5] sm:text-lg">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 active:bg-slate-200 dark:text-[#737b7d] dark:hover:bg-[#293235] dark:hover:text-[#f5f5f5] dark:active:bg-[#343b3d]"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;