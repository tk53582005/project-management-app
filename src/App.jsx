import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";

const API_BASE_URL =
  "https://xo41qf1cu1.execute-api.ap-northeast-1.amazonaws.com";

const PROJECTS_API_URL = `${API_BASE_URL}/projects`;
const INVOICES_API_URL = `${API_BASE_URL}/invoices`;

function App() {
  const auth = useAuth();

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.user?.access_token}`,
  });

  const signOutRedirect = async () => {
    await auth.removeUser();

    const clientId = "4vrs82vcgc93shqql5bdngdrfd";
    const logoutUri = window.location.origin;
    const cognitoDomain =
      "https://ap-northeast-1lf0frqj4b.auth.ap-northeast-1.amazoncognito.com";

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");

  const [invoices, setInvoices] = useState([]);
  const [invoiceProjectId, setInvoiceProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(PROJECTS_API_URL, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setProjects(sorted);

      if (!invoiceProjectId && sorted.length > 0) {
        setInvoiceProjectId(sorted[0].projectId);
      }
    } catch (err) {
      console.error("Fetch projects error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setError("");

      const res = await fetch(INVOICES_API_URL, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setInvoices(sorted);
    } catch (err) {
      console.error("Fetch invoices error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      fetchProjects();
      fetchInvoices();
    }
  }, [auth.isAuthenticated, auth.user?.access_token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName.trim() || !clientName.trim()) {
      setError("Project name and client name are required.");
      setSuccess("");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const res = await fetch(PROJECTS_API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ projectName, clientName }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setProjectName("");
      setClientName("");
      setSuccess("Project created successfully");
      fetchProjects();
    } catch (err) {
      console.error("Create project error:", err);
      setError(err.message);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("本当にこのプロジェクトを削除しますか？")) return;

    try {
      setError("");
      setSuccess("");

      const res = await fetch(`${PROJECTS_API_URL}/${projectId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setSuccess("Project deleted");
      fetchProjects();
    } catch (err) {
      console.error("Delete project error:", err);
      setError(err.message);
    }
  };

  const handleUpdateStatus = async (projectId, currentStatus) => {
    try {
      setError("");
      setSuccess("");

      let nextStatus = "planned";
      if (currentStatus === "planned") nextStatus = "in-progress";
      else if (currentStatus === "in-progress") nextStatus = "completed";

      const res = await fetch(`${PROJECTS_API_URL}/${projectId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setSuccess("Project status updated");
      fetchProjects();
    } catch (err) {
      console.error("Update project error:", err);
      setError(err.message);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();

    if (!invoiceProjectId || !amount.trim() || !dueDate) {
      setError("Project, amount and due date are required.");
      setSuccess("");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const res = await fetch(INVOICES_API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          projectId: invoiceProjectId,
          amount,
          dueDate,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setAmount("");
      setDueDate("");
      setSuccess("Invoice created");
      fetchInvoices();
    } catch (err) {
      console.error("Create invoice error:", err);
      setError(err.message);
    }
  };

  const handleUpdateInvoiceStatus = async (invoiceId, currentStatus) => {
    try {
      setError("");
      setSuccess("");

      const nextStatus = currentStatus === "paid" ? "pending" : "paid";

      const res = await fetch(`${INVOICES_API_URL}/${invoiceId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setSuccess("Invoice status updated");
      fetchInvoices();
    } catch (err) {
      console.error("Update invoice error:", err);
      setError(err.message);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("本当にこの請求書を削除しますか？")) return;

    try {
      setError("");
      setSuccess("");

      const res = await fetch(`${INVOICES_API_URL}/${invoiceId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setSuccess("Invoice deleted");
      fetchInvoices();
    } catch (err) {
      console.error("Delete invoice error:", err);
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

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.projectId === projectId);
    return project ? project.projectName : projectId;
  };

  const getFilterButtonClass = (value) => {
    const baseClass =
      "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition";
    const activeClass = "bg-slate-900 text-white";
    const inactiveClass =
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100";

    return `${baseClass} ${filter === value ? activeClass : inactiveClass}`;
  };

  const getInvoiceStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-600 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      default:
        return "bg-slate-200 text-slate-700";
    }
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
            className="mt-6 w-full cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
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
            onClick={signOutRedirect}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
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
          <div className="mb-4 animate-pulse rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 shadow-sm">
            Loading...
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 shadow-sm">
            Error: {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 shadow-sm">
            {success}
          </div>
        )}

        <ProjectList
          projects={filteredProjects}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
        />

        <section className="mt-12">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Invoices</h2>
            <p className="mt-1 text-sm text-slate-600">
              Create and manage invoices linked to your projects.
            </p>
          </div>

          <form
            onSubmit={handleCreateInvoice}
            className="mb-6 rounded-2xl bg-white p-6 shadow-sm"
          >
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Create Invoice
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Project
                </label>
                <select
                  value={invoiceProjectId}
                  onChange={(e) => setInvoiceProjectId(e.target.value)}
                  className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Select project</option>
                  {projects.map((project) => (
                    <option key={project.projectId} value={project.projectId}>
                      {project.projectName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Due date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Create Invoice
            </button>
          </form>

          <div className="space-y-3">
            {invoices.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 shadow-sm">
                No invoices yet.
              </div>
            ) : (
              invoices.map((invoice) => (
                <div
                  key={invoice.invoiceId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        ¥{Number(invoice.amount).toLocaleString()}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Project: {getProjectName(invoice.projectId)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Due: {invoice.dueDate || "-"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Status:
                        <span
                          className={`ml-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getInvoiceStatusClass(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdateInvoiceStatus(
                            invoice.invoiceId,
                            invoice.status
                          )
                        }
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.invoiceId)}
                        className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;