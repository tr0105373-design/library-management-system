import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { API_URL } from "./config";

function Members() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const headers = { Authorization: `Bearer ${token}` };

  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    role: "student", member_type: "student", max_books: 3
  });

  const fetchMembers = () => {
    axios.get(`${API_URL}/api/members`, { headers }).then((res) => setMembers(res.data)).catch((err) => console.log(err));
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const userRes = await axios.post(`${API_URL}/api/auth/register`,
        { name: form.name, email: form.email, password: form.password, role: form.role }, { headers });
      await axios.post(`${API_URL}/api/members/add`,
        { user_id: userRes.data.user_id, member_type: form.member_type, max_books: form.max_books }, { headers });
      setMessage("✅ Member added successfully!");
      fetchMembers();
      setForm({ name: "", email: "", password: "", role: "student", member_type: "student", max_books: 3 });
    } catch { setMessage("❌ Error! Email already exists."); }
  };

  const handleSearch = async () => {
    if (!search) { fetchMembers(); return; }
    const res = await axios.get(`${API_URL}/api/members/search?query=${search}`, { headers });
    setMembers(res.data);
  };

  const handleDelete = async (memberId) => {
    if (window.confirm("Delete this member?")) {
      try {
        await axios.delete(`${API_URL}/api/members/${memberId}`, { headers });
        setMessage("✅ Member deleted!");
        fetchMembers();
      } catch { setMessage("❌ Cannot delete — member has active issues!"); }
    }
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
          <h2 style={styles.heading}>👥 Members Management</h2>
          {message && <p style={{ padding: "10px", backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da", color: message.includes("✅") ? "#155724" : "#721c24", borderRadius: "6px", marginBottom: "15px" }}>{message}</p>}

          <div style={styles.searchRow}>
            <input style={styles.searchInput} placeholder="🔍 Search by name or email..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()} />
            <button style={styles.btn} onClick={handleSearch}>Search</button>
            <button style={{ ...styles.btn, backgroundColor: "#666" }} onClick={() => { setSearch(""); fetchMembers(); }}>Reset</button>
          </div>

          <div style={styles.formBox}>
            <h3 style={styles.formTitle}>➕ Add New Member</h3>
            <form onSubmit={handleAdd}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}><label style={styles.label}>Full Name *</label><input style={styles.input} placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div style={styles.formGroup}><label style={styles.label}>Email *</label><input style={styles.input} placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                <div style={styles.formGroup}><label style={styles.label}>Password *</label><input style={styles.input} placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
                <div style={styles.formGroup}><label style={styles.label}>Member Type</label>
                  <select style={styles.input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value, member_type: e.target.value })}>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                <div style={styles.formGroup}><label style={styles.label}>Max Books</label><input style={styles.input} placeholder="Max Books" type="number" value={form.max_books} onChange={(e) => setForm({ ...form, max_books: e.target.value })} /></div>
              </div>
              <button style={styles.addBtn} type="submit">➕ Add Member</button>
            </form>
          </div>

          <div style={styles.tableBox}>
            <h3 style={styles.formTitle}>👥 All Members ({members.length})</h3>
            <table style={styles.table}>
              <thead><tr style={styles.thead}>
                <th style={styles.th}>ID</th><th style={styles.th}>Name</th><th style={styles.th}>Email</th>
                <th style={styles.th}>Type</th><th style={styles.th}>Max Books</th><th style={styles.th}>Status</th><th style={styles.th}>Action</th>
              </tr></thead>
              <tbody>
                {members.length === 0 ? <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#999" }}>No members found!</td></tr> : (
                  members.map((m, i) => (
                    <tr key={m.member_id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                      <td style={styles.td}>{m.member_id}</td>
                      <td style={styles.td}><strong>{m.name}</strong></td>
                      <td style={styles.td}>{m.email}</td>
                      <td style={styles.td}>{m.member_type}</td>
                      <td style={styles.td}>{m.max_books}</td>
                      <td style={styles.td}><span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: m.status === "active" ? "#d4edda" : "#f8d7da", color: m.status === "active" ? "#155724" : "#721c24" }}>{m.status}</span></td>
                      <td style={styles.td}><button style={styles.deleteBtn} onClick={() => handleDelete(m.member_id)}>🗑️ Delete</button></td>
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
  searchRow: { display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" },
  searchInput: { padding: "9px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", width: "300px" },
  formBox: { backgroundColor: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  formTitle: { color: "#2C3E50", marginBottom: "15px" },
  formRow: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "15px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", color: "#666", fontWeight: "600" },
  input: { padding: "9px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", width: "180px" },
  btn: { padding: "9px 16px", backgroundColor: "#2C3E50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  addBtn: { padding: "10px 25px", backgroundColor: "#4A90D9", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  tableBox: { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#F4F6F9" },
  th: { padding: "10px 12px", textAlign: "left", color: "#666", fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #eee" },
  td: { padding: "10px 12px", fontSize: "13px", color: "#444", borderBottom: "1px solid #f0f0f0" },
  deleteBtn: { padding: "5px 10px", backgroundColor: "#E74C3C", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "12px" },
};

export default Members;