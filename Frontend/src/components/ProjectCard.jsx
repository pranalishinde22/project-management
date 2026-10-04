import {
  ArrowRight,
  FolderKanban,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/project/${project.id}`)
      }
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md active:scale-[0.99] dark:border-[#343b3d] dark:bg-[#1b2021] dark:shadow-black/20 dark:hover:bg-[#222829] dark:hover:shadow-black/30 sm:p-5"
    >
      {/* Top section */}
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${project.color} text-white`}
        >
          <FolderKanban size={19} />
        </div>

        <ArrowRight
          size={17}
          className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700 dark:text-[#737b7d] dark:group-hover:text-[#f5f5f5]"
        />
      </div>

      {/* Project name */}
      <h3 className="break-words font-bold text-slate-900 dark:text-[#f5f5f5]">
        {project.name}
      </h3>

      {/* Task count */}
      <p className="mt-1 text-xs text-slate-400 dark:text-[#737b7d]">
        {project.taskCount} tasks
      </p>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-[#293235] sm:mt-5">
        <div
          className="h-full rounded-full bg-slate-900 transition-all dark:bg-[#8b5cf6]"
          style={{
            width: `${project.progress}%`,
          }}
        />
      </div>

      {/* Progress text */}
      <div className="mt-2 text-right text-[10px] font-semibold text-slate-400 dark:text-[#737b7d]">
        {project.progress}% complete
      </div>
    </div>
  );
}

export default ProjectCard;