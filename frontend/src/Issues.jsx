import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
// import { API_URL } from "./config";
import api from "./api";   // ✅ FIX: use central axios instance

function Issues() {
  const name = localStorage.getItem("name");

  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState({ book_id: "", member_id: "" });
  const [returnForm, setReturnForm] = useState({ issue_id: "", book_id: "" });
  const [message, setMessage] = useState("");

  // ✅ FIXED: no manual axios + headers
  const fetchIssues = async () => {
    try {
      const res = await api.get("/api/issues");
      setIssues(res.data.issues || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/issues/issue", form);
      setMessage("✅ " + res.data.message);
      fetchIssues();
      setForm({ book_id: "", member_id: "" });
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Error!"));
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/issues/return", returnForm);
      setMessage("✅ " + res.data.message);
      fetchIssues();
      setReturnForm({ issue_id: "", book_id: "" });
    } catch (err) {
      console.log(err);
      setMessage("❌ Error returning!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>📚 Library Management System</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={styles.welcome}>👤 {name}</span>
          <button
            style={styles.logoutBtn}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={styles.layout}>
        <Sidebar />

        <div style={styles.content}>
          <h2 style={styles.heading}>📋 Issue & Return Books</h2>

          {message && (
            <p
              style={{
                padding: "10px",
                backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
                color: message.includes("✅") ? "#155724" : "#721c24",
                borderRadius: "6px",
                marginBottom: "15px",
              }}
            >
              {message}
            </p>
          )}

          <div style={styles.formsRow}>
            {/* ISSUE */}
            <div style={styles.formBox}>
              <h3 style={styles.formTitle}>📤 Issue Book</h3>

              <form onSubmit={handleIssue}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Book ID *</label>
                  <input
                    style={styles.input}
                    value={form.book_id}
                    onChange={(e) =>
                      setForm({ ...form, book_id: e.target.value })
                    }
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Member ID *</label>
                  <input
                    style={styles.input}
                    value={form.member_id}
                    onChange={(e) =>
                      setForm({ ...form, member_id: e.target.value })
                    }
                    required
                  />
                </div>

                <button style={styles.issueBtn} type="submit">
                  📤 Issue Book
                </button>
              </form>
            </div>

            {/* RETURN */}
            <div style={styles.formBox}>
              <h3 style={styles.formTitle}>📥 Return Book</h3>

              <form onSubmit={handleReturn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Issue ID *</label>
                  <input
                    style={styles.input}
                    value={returnForm.issue_id}
                    onChange={(e) =>
                      setReturnForm({ ...returnForm, issue_id: e.target.value })
                    }
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Book ID *</label>
                  <input
                    style={styles.input}
                    value={returnForm.book_id}
                    onChange={(e) =>
                      setReturnForm({ ...returnForm, book_id: e.target.value })
                    }
                    required
                  />
                </div>

                <button style={styles.returnBtn} type="submit">
                  📥 Return Book
                </button>
              </form>
            </div>
          </div>

          {/* TABLE */}
          <div style={styles.tableBox}>
            <h3 style={styles.formTitle}>
              📋 All Issues ({issues.length})
            </h3>

            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Issue ID</th>
                  <th style={styles.th}>Book</th>
                  <th style={styles.th}>Member</th>
                  <th style={styles.th}>Issue Date</th>
                  <th style={styles.th}>Due Date</th>
                  <th style={styles.th}>Return Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {issues.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#999",
                      }}
                    >
                      No issues yet!
                    </td>
                  </tr>
                ) : (
                  issues.map((i, idx) => (
                    <tr
                      key={i.issue_id}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white",
                      }}
                    >
                      <td style={styles.td}>{i.issue_id}</td>
                      <td style={styles.td}><strong>{i.title}</strong></td>
                      <td style={styles.td}>{i.name}</td>
                      <td style={styles.td}>{i.issue_date?.split("T")[0]}</td>
                      <td style={styles.td}>{i.due_date?.split("T")[0]}</td>
                      <td style={styles.td}>
                        {i.return_date ? i.return_date.split("T")[0] : "-"}
                      </td>
                      <td style={styles.td}>{i.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", height: "100vh" },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e3a8a",
    color: "white",
    padding: "10px 20px"
  },

  navTitle: { margin: 0 },

  welcome: { fontWeight: "bold" },

  logoutBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer"
  },

  layout: { display: "flex", flex: 1 },

  content: { flex: 1, padding: "20px" },

  heading: { marginBottom: "20px" },

  formsRow: { display: "flex", gap: "20px", flexWrap: "wrap" },

  formBox: {
    backgroundColor: "#f9fafb",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "250px"
  },

  formTitle: { marginBottom: "10px" },

  formGroup: { display: "flex", flexDirection: "column", marginBottom: "10px" },

  label: { marginBottom: "4px" },

  input: {
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "4px"
  },

  issueBtn: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },

  returnBtn: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },

  tableBox: { marginTop: "20px" },

  table: { width: "100%", borderCollapse: "collapse" },

  thead: { backgroundColor: "#e5e7eb" },

  th: { padding: "10px", border: "1px solid #ddd" },

  td: { padding: "10px", border: "1px solid #ddd" }
};

export default Issues;