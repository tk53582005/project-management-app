function ProjectForm({
  projectName,
  clientName,
  setProjectName,
  setClientName,
  handleSubmit,
  loading, // ← 追加
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Create Project
      </h2>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          type="text"
          placeholder="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <input
          type="text"
          placeholder="Client name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <button
          type="submit"
          disabled={loading || !projectName.trim() || !clientName.trim()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Project
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;