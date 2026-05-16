import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { API_URL } from "./config";
// import api from "./api";   // ✅ IMPORTANT FIX: use central axios instance

function Members() {
  const name = localStorage.getItem("name");

  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    member_type: "student",
    max_books: 3
  });

  // ✅ FIXED: no manual axios + headers
  const fetchMembers = async () => {
    try {
      const res = await api.get("/api/members");
      setMembers(res.data.members || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const userRes = await api.post("/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });

      await api.post("/api/members/add", {
        user_id: userRes.data.user_id,
        member_type: form.member_type,
        max_books: form.max_books
      });

      setMessage("✅ Member added successfully!");
      fetchMembers();

      setForm({
        name: "",
        email: "",
        password: "",
        role: "student",
        member_type: "student",
        max_books: 3
      });

    } catch (err) {
      console.log(err);
      setMessage("❌ Error! Email already exists.");
    }
  };

  const handleSearch = async () => {
    try {
      if (!search) return fetchMembers();

      const res = await api.get(`/api/members/search?query=${search}`);
      setMembers(res.data.members || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (memberId) => {
    if (window.confirm("Delete this member?")) {
      try {
        await api.delete(`/api/members/${memberId}`);
        setMessage("✅ Member deleted!");
        fetchMembers();
      } catch (err) {
        console.log(err);
        setMessage("❌ Cannot delete — member has active issues!");
      }
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
          <h2 style={styles.heading}>👥 Members Management</h2>

          {message && (
            <p style={{
              padding: "10px",
              backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
              color: message.includes("✅") ? "#155724" : "#721c24",
              borderRadius: "6px",
              marginBottom: "15px"
            }}>
              {message}
            </p>
          )}

          <div style={styles.searchRow}>
            <input
              style={styles.searchInput}
              placeholder="🔍 Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            <button style={styles.btn} onClick={handleSearch}>Search</button>

            <button
              style={{ ...styles.btn, backgroundColor: "#666" }}
              onClick={() => {
                setSearch("");
                fetchMembers();
              }}
            >
              Reset
            </button>
          </div>

          <div style={styles.formBox}>
            <h3 style={styles.formTitle}>➕ Add New Member</h3>

            <form onSubmit={handleAdd}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input style={styles.input}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email *</label>
                  <input style={styles.input}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Password *</label>
                  <input style={styles.input}
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Member Type</label>
                  <select
                    style={styles.input}
                    value={form.role}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        role: e.target.value,
                        member_type: e.target.value
                      })
                    }
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Max Books</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={form.max_books}
                    onChange={(e) =>
                      setForm({ ...form, max_books: e.target.value })
                    }
                  />
                </div>
              </div>

              <button style={styles.addBtn} type="submit">
                ➕ Add Member
              </button>
            </form>
          </div>

          <div style={styles.tableBox}>
            <h3 style={styles.formTitle}>
              👥 All Members ({members.length})
            </h3>

            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Max Books</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                      No members found!
                    </td>
                  </tr>
                ) : (
                  members.map((m, i) => (
                    <tr key={m.member_id}>
                      <td style={styles.td}>{m.member_id}</td>
                      <td style={styles.td}><strong>{m.name}</strong></td>
                      <td style={styles.td}>{m.email}</td>
                      <td style={styles.td}>{m.member_type}</td>
                      <td style={styles.td}>{m.max_books}</td>
                      <td style={styles.td}>{m.status}</td>
                      <td style={styles.td}>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(m.member_id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
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

export default Members;