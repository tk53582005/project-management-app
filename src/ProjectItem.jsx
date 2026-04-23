function ProjectItem({ project, onDelete, onUpdateStatus }) {
  const getStatusClasses = (status) => {
    if (status === "planned") {
      return "bg-slate-500 text-white";
    }
    if (status === "in-progress") {
      return "bg-amber-500 text-white";
    }
    if (status === "completed") {
      return "bg-emerald-600 text-white";
    }
    return "bg-slate-300 text-slate-800";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">
            {project.projectName}
          </h3>

          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-800">Client:</span>{" "}
            {project.clientName}
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-800">Status:</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                project.status
              )}`}
            >
              {project.status}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Created: {new Date(project.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onUpdateStatus(project.projectId, project.status)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Update
          </button>

          <button
            onClick={() => onDelete(project.projectId)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectItem;