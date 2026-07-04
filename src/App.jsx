import { useState, useEffect } from "react";

const STATUSES = ["Applied", "Interview Scheduled", "Rejected", "Offered"];

const EMPTY_FORM = {
  company: "",
  role: "",
  date: "",
  status: "Applied",
};

export default function App() {
  // --------------------------------------------------
  // useState — stores all job applications in memory
  // useEffect — syncs to localStorage whenever jobs changes
  // --------------------------------------------------
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  // --------------------------------------------------
  // Handle form field changes — controlled component
  // Every keystroke updates form state
  // --------------------------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --------------------------------------------------
  // Add or Update job
  // --------------------------------------------------
  const handleSubmit = () => {
    if (!form.company || !form.role || !form.date) {
      alert("Please fill all fields");
      return;
    }

    if (editId !== null) {
      // UPDATE — map over jobs, replace matching id
      setJobs(jobs.map((j) => (j.id === editId ? { ...form, id: editId } : j)));
      setEditId(null);
    } else {
      // ADD — spread existing jobs, add new one with unique id
      setJobs([...jobs, { ...form, id: Date.now() }]);
    }
    setForm(EMPTY_FORM);
  };

  // --------------------------------------------------
  // Load job into form for editing
  // --------------------------------------------------
const handleEdit = (job) => {
    setForm({ company: job.company, role: job.role, date: job.date, status: job.status });
    setEditId(job.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --------------------------------------------------
  // Delete job by filtering it out
  // --------------------------------------------------
  const handleDelete = (id) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  // --------------------------------------------------
  // Filter — "All" shows everything, else match status
  // --------------------------------------------------
  const filtered = filter === "All" ? jobs : jobs.filter((j) => j.status === filter);

  // --------------------------------------------------
  // Status badge color
  // --------------------------------------------------
  const badgeColor = (status) => {
    if (status === "Applied") return "#1a73e8";
    if (status === "Interview Scheduled") return "#f59e0b";
    if (status === "Rejected") return "#ef4444";
    if (status === "Offered") return "#10b981";
    return "#666";
  };
  const cardStyle = {
    background: editId !== null ? "#fffbeb" : "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: editId !== null
      ? "0 2px 12px rgba(245,158,11,0.25)"
      : "0 2px 8px rgba(0,0,0,0.07)",
    border: editId !== null ? "1px solid #f59e0b" : "1px solid transparent",
    transition: "all 0.3s ease",
  };
  const styleTag = document.createElement("style");
styleTag.innerHTML = mediaStyles;
document.head.appendChild(styleTag);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
  <div>
    <h1 style={styles.title}>Job Application Tracker</h1>
    <p style={styles.subtitle}>Track every application. Stay organised.</p>
  </div>
  <div style={styles.totalBadge}>
    {jobs.length} Total
  </div>
</div>

      {/* ---- FORM ---- */}
      <div style={cardStyle}>
        <h2 style={styles.sectionTitle}>
          {editId !== null ? "Edit Application" : "Add Application"}
        </h2>

        <div style={styles.formGrid} className="form-grid">
          <input
            style={styles.input}
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            name="role"
            placeholder="Role Applied For"
            value={form.role}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
          <select
            style={styles.input}
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button style={styles.primaryBtn} onClick={handleSubmit}>
          {editId !== null ? "Update Application" : "Add Application"}
        </button>

        {editId !== null && (
          <button
            style={styles.cancelBtn}
            onClick={() => { setEditId(null); setForm(EMPTY_FORM); }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* ---- FILTER ---- */}
      <div style={styles.filterRow} className="filter-row">
        {["All", ...STATUSES].map((s) => (
          <button
            key={s}
            style={filter === s ? styles.filterBtnActive : styles.filterBtn}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ---- STATS ---- */}
      <div style={styles.statsRow} className="stats-row">
        {["All", ...STATUSES].map((s) => (
          <div key={s} style={styles.statBox}>
            <span style={styles.statNum}>
              {s === "All" ? jobs.length : jobs.filter((j) => j.status === s).length}
            </span>
            <span style={styles.statLabel}>{s}</span>
          </div>
        ))}
      </div>

      {/* ---- JOB LIST ---- */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>No applications found. Add one above!</div>
      ) : (
        filtered.map((job) => (
          <div key={job.id} style={styles.jobCard} className="job-card">
            <div style={styles.jobLeft}>
              <div style={styles.jobCompany}>{job.company}</div>
              <div style={styles.jobRole}>{job.role}</div>
              <div style={styles.jobDate}>Applied: {job.date}</div>
            </div>
            <div style={styles.jobRight} className="job-right">
              <span style={{ ...styles.badge, background: badgeColor(job.status) }}>
                {job.status}
              </span>
              <div style={styles.actionRow}>
                <button style={styles.editBtn} onClick={() => handleEdit(job)}>Edit</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(job.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// --------------------------------------------------
// STYLES — inline, no extra CSS file needed
// --------------------------------------------------
const styles = {
  page: {
    maxWidth: "780px",
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "'Segoe UI', sans-serif",
    background: "linear-gradient(135deg, #f4f6f9 0%, #e8edf5 100%)",
    minHeight: "100vh",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 4px",
    letterSpacing: "-0.5px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
totalBadge: {
    background: "#1a73e8",
    color: "#fff",
    padding: "8px 18px",
    borderRadius: "20px",
    fontWeight: "700",
    fontSize: "15px",
  },
  subtitle: {
    color: "#666",
    margin: "0 0 24px",
    fontSize: "15px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#1a1a2e",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  primaryBtn: {
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelBtn: {
    background: "#f1f1f1",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "14px",
    cursor: "pointer",
  },
  filterRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  filterBtn: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    background: "#fff",
    fontSize: "13px",
    cursor: "pointer",
    color: "#444",
  },
  filterBtnActive: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid #1a73e8",
    background: "#1a73e8",
    fontSize: "13px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "600",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "10px",
    marginBottom: "20px",
  },
  statBox: {
    background: "#fff",
    borderRadius: "10px",
    padding: "14px 10px",
    textAlign: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  statNum: {
    display: "block",
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a2e",
  },
  statLabel: {
    fontSize: "11px",
    color: "#888",
  },
  jobCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "16px 20px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  jobLeft: { flex: 1 },
  jobCompany: { fontWeight: "700", fontSize: "15px", color: "#1a1a2e" },
  jobRole: { fontSize: "13px", color: "#555", margin: "3px 0" },
  jobDate: { fontSize: "12px", color: "#999" },
  jobRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" },
  badge: {
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  actionRow: { display: "flex", gap: "8px" },
  editBtn: {
    padding: "5px 14px",
    borderRadius: "6px",
    border: "1px solid #1a73e8",
    background: "#fff",
    color: "#1a73e8",
    fontSize: "12px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "5px 14px",
    borderRadius: "6px",
    border: "1px solid #ef4444",
    background: "#fff",
    color: "#ef4444",
    fontSize: "12px",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#999",
    fontSize: "15px",
  },
};

const mediaStyles = `
  @media (max-width: 600px) {
    .form-grid {
      grid-template-columns: 1fr !important;
    }
    .stats-row {
      grid-template-columns: repeat(3, 1fr) !important;
    }
    .job-card {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 12px !important;
    }
    .job-right {
      flex-direction: row !important;
      width: 100% !important;
      justify-content: space-between !important;
      align-items: center !important;
    }
    .filter-row {
      gap: 6px !important;
    }
  }
`;