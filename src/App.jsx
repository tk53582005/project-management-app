import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";

const API_URL =
  "https://xo41qf1cu1.execute-api.ap-northeast-1.amazonaws.com/projects";

function App() {
  const auth = useAuth();

  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setProjects(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchProjects();
    }
  }, [auth.isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName.trim() || !clientName.trim()) {
      setError("Project name and client name are required.");
      return;
    }

    try {
      setError("");

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectName, clientName }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setProjectName("");
      setClientName("");
      fetchProjects();
    } catch (err) {
      console.error("Create error:", err);
      setError(err.message);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      setError("");

      const res = await fetch(`${API_URL}/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      fetchProjects();
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  const handleUpdateStatus = async (projectId, currentStatus) => {
    try {
      setError("");

      let nextStatus = "planned";
      if (currentStatus === "planned") nextStatus = "in-progress";
      else if (currentStatus === "in-progress") nextStatus = "completed";

      const res = await fetch(`${API_URL}/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      fetchProjects();
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === "all" || project.status === filter;

    const keyword = searchTerm.toLowerCase();
    const matchesSearch =
      project.projectName.toLowerCase().includes(keyword) ||
      project.clientName.toLowerCase().includes(keyword);

    return matchesFilter && matchesSearch;
  });

  const getFilterButtonClass = (value) => {
    const baseClass = "rounded-lg px-4 py-2 text-sm font-medium transition";
    const activeClass = "bg-slate-900 text-white";
    const inactiveClass =
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100";

    return `${baseClass} ${filter === value ? activeClass : inactiveClass}`;
  };

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700">
        Loading...
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-red-600">
        Error: {auth.error.message}
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Project Management App
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            ログインするとプロジェクト管理画面を利用できます。
          </p>

          <button
            onClick={() => auth.signinRedirect()}
            className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
            <p className="mt-2 text-sm text-slate-600">
              React + API Gateway + Lambda + DynamoDB CRUD App
            </p>
            {auth.user?.profile?.email && (
              <p className="mt-1 text-xs text-slate-500">
                Logged in as: {auth.user.profile.email}
              </p>
            )}
          </div>

          <button
            onClick={() => auth.removeUser()}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            ログアウト
          </button>
        </div>

        <ProjectForm
          projectName={projectName}
          clientName={clientName}
          setProjectName={setProjectName}
          setClientName={setClientName}
          handleSubmit={handleSubmit}
        />

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by project or client"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={getFilterButtonClass("all")}
          >
            All
          </button>
          <button
            onClick={() => setFilter("planned")}
            className={getFilterButtonClass("planned")}
          >
            Planned
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={getFilterButtonClass("in-progress")}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={getFilterButtonClass("completed")}
          >
            Completed
          </button>
        </div>

        {loading && (
          <div className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 shadow-sm">
            Loading...
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 shadow-sm">
            Error: {error}
          </div>
        )}

        <ProjectList
          projects={filteredProjects}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
}

export default App;