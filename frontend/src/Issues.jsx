import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { API_URL } from "./config";

function Issues() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const headers = { Authorization: `Bearer ${token}` };
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState({ book_id: "", member_id: "" });
  const [returnForm, setReturnForm] = useState({ issue_id: "", book_id: "" });
  const [message, setMessage] = useState("");

  const fetchIssues = () => { axios.get(`${API_URL}/api/issues`, { headers }).then((res) => setIssues(res.data)); };
  useEffect(() => { fetchIssues(); }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/issues/issue`, form, { headers });
      setMessage("✅ " + res.data.message); fetchIssues(); setForm({ book_id: "", member_id: "" });
    } catch (err) { setMessage("❌ " + (err.response?.data?.message || "Error!")); }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/issues/return`, returnForm, { headers });
      setMessage("✅ " + res.data.message); fetchIssues(); setReturnForm({ issue_id: "", book_id: "" });
    } catch { setMessage("❌ Error returning!"); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>📚 Library Management System</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={styles.welcome}>👤 {name}</span>
          <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); window.location.href = "/"; }}>Logout</button>
        </div>
      </div>
      <div style={styles.layout}>
        <Sidebar />
        <div style={styles.content}>
          <h2 style={styles.heading}>📋 Issue & Return Books</h2>
          {message && <p style={{ padding: "10px", backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da", color: message.includes("✅") ? "#155724" : "#721c24", borderRadius: "6px", marginBottom: "15px" }}>{message}</p>}

          <div style={styles.formsRow}>
            <div style={styles.formBox}>
              <h3 style={styles.formTitle}>📤 Issue Book</h3>
              <form onSubmit={handleIssue}>
                <div style={styles.formGroup}><label style={styles.label}>Book ID *</label><input style={styles.input} placeholder="Book ID" value={form.book_id} onChange={(e) => setForm({ ...form, book_id: e.target.value })} required /></div>
                <div style={styles.formGroup}><label style={styles.label}>Member ID *</label><input style={styles.input} placeholder="Member ID" value={form.member_id} onChange={(e) => setForm({ ...form, member_id: e.target.value })} required /></div>
                <button style={styles.issueBtn} type="submit">📤 Issue Book</button>
              </form>
            </div>
            <div style={styles.formBox}>
              <h3 style={styles.formTitle}>📥 Return Book</h3>
              <form onSubmit={handleReturn}>
                <div style={styles.formGroup}><label style={styles.label}>Issue ID *</label><input style={styles.input} placeholder="Issue ID" value={returnForm.issue_id} onChange={(e) => setReturnForm({ ...returnForm, issue_id: e.target.value })} required /></div>
                <div style={styles.formGroup}><label style={styles.label}>Book ID *</label><input style={styles.input} placeholder="Book ID" value={returnForm.book_id} onChange={(e) => setReturnForm({ ...returnForm, book_id: e.target.value })} required /></div>
                <button style={styles.returnBtn} type="submit">📥 Return Book</button>
              </form>
            </div>
          </div>

          <div style={styles.tableBox}>
            <h3 style={styles.formTitle}>📋 All Issues ({issues.length})</h3>
            <table style={styles.table}>
              <thead><tr style={styles.thead}>
                <th style={styles.th}>Issue ID</th><th style={styles.th}>Book</th><th style={styles.th}>Member</th>
                <th style={styles.th}>Issue Date</th><th style={styles.th}>Due Date</th><th style={styles.th}>Return Date</th><th style={styles.th}>Status</th>
              </tr></thead>
              <tbody>
                {issues.length === 0 ? <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#999" }}>No issues yet!</td></tr> : (
                  issues.map((i, idx) => (
                    <tr key={i.issue_id} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                      <td style={styles.td}>{i.issue_id}</td><td style={styles.td}><strong>{i.title}</strong></td><td style={styles.td}>{i.name}</td>
                      <td style={styles.td}>{i.issue_date?.split("T")[0]}</td><td style={styles.td}>{i.due_date?.split("T")[0]}</td>
                      <td style={styles.td}>{i.return_date ? i.return_date.split("T")[0] : "-"}</td>
                      <td style={styles.td}><span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: i.status === "issued" ? "#fff3cd" : i.status === "returned" ? "#d4edda" : "#f8d7da", color: i.status === "issued" ? "#856404" : i.status === "returned" ? "#155724" : "#721c24" }}>{i.status}</span></td>
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
  container: { fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#F4F6F9" },
  navbar: { backgroundColor: "#2C3E50", padding: "14px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navTitle: { color: "white", margin: 0, fontSize: "20px" },
  welcome: { color: "#BDC3C7", fontSize: "14px" },
  logoutBtn: { padding: "7px 16px", backgroundColor: "#E74C3C", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  layout: { display: "flex" },
  content: { flex: 1, padding: "25px" },
  heading: { color: "#2C3E50", marginBottom: "20px" },
  formsRow: { display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" },
  formBox: { backgroundColor: "white", padding: "20px", borderRadius: "10px", flex: 1, minWidth: "250px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  formTitle: { color: "#2C3E50", marginBottom: "15px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" },
  label: { fontSize: "12px", color: "#666", fontWeight: "600" },
  input: { padding: "9px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px" },
  issueBtn: { padding: "10px 25px", backgroundColor: "#4A90D9", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", width: "100%" },
  returnBtn: { padding: "10px 25px", backgroundColor: "#5BAD72", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", width: "100%" },
  tableBox: { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#F4F6F9" },
  th: { padding: "10px 12px", textAlign: "left", color: "#666", fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #eee" },
  td: { padding: "10px 12px", fontSize: "13px", color: "#444", borderBottom: "1px solid #f0f0f0" },
};

export default Issues;