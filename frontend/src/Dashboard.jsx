import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { API_URL } from "./config";

function Dashboard() {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [stats, setStats] = useState({ books: 0, members: 0, issued: 0, fines: 0 });
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    // (`${API_URL}/api/books`, { headers }).then((res) => {
    //   setBooks(res.data);
    //   setStaaxios.getts((prev) => ({ ...prev, books: res.data.length }));
    // });
    axios.get(`${API_URL}/api/books`, { headers }).then((res) => {
  const data = Array.isArray(res.data) ? res.data : [];
  setBooks(data);
  setStats((prev) => ({ ...prev, books: data.length }));
   });

    axios.get(`${API_URL}/api/members`, { headers }).then((res) =>
      setStats((prev) => ({ ...prev, members: res.data.length })));
    // axios.get(`${API_URL}/api/issues`, { headers }).then((res) => {
    //   setIssues(res.data);
    //   setStats((prev) => ({ ...prev, issued: res.data.length }));
    // });
    axios.get(`${API_URL}/api/issues`, { headers }).then((res) => {
  const data = Array.isArray(res.data) ? res.data : [];
  setIssues(data);
  setStats((prev) => ({ ...prev, issued: data.length }));
   });

    axios.get(`${API_URL}/api/fines`, { headers }).then((res) =>
      setStats((prev) => ({ ...prev, fines: res.data.length })));
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  const barData = [
    { name: "Books", value: stats.books },
    { name: "Members", value: stats.members },
    { name: "Issued", value: stats.issued },
    { name: "Fines", value: stats.fines },
  ];

  const pieData = [
    { name: "Available", value: stats.books - stats.issued },
    { name: "Issued", value: stats.issued },
  ];
  const COLORS = ["#4A90D9", "#E07B54"];

  // const booksData = books.slice(0, 5).map((b) => ({
  //   name: b.title.length > 10 ? b.title.substring(0, 10) + "..." : b.title,
  //   Available: b.available_copies,
  //   Total: b.total_copies,
  // }));
  const booksData = (Array.isArray(books) ? books : [])
  .slice(0, 5)
  .map((b) => ({
    name: b.title?.length > 10 ? b.title.substring(0, 10) + "..." : b.title,
    Available: b.available_copies || 0,
    Total: b.total_copies || 0,
  }));

  // const recentIssues = issues.slice(-5).reverse();
  const recentIssues = (Array.isArray(issues) ? issues : [])
  .slice(-5)
  .reverse();
  // const overdueBooks = issues.filter(i => i.status === "issued" && new Date(i.due_date) < new Date());
  const overdueBooks = (Array.isArray(issues) ? issues : []).filter(
  (i) => i.status === "issued" && new Date(i.due_date) < new Date()
);
  const lowStockBooks = books.filter(b => b.available_copies <= 1);

  const menuItems = [
    { path: "/dashboard", icon: "🏠", label: "Dashboard" },
    { path: "/books", icon: "📖", label: "Books" },
    { path: "/members", icon: "👥", label: "Members" },
    { path: "/issues", icon: "📋", label: "Issue/Return" },
    { path: "/fines", icon: "💰", label: "Fines" },
    { path: "/reports", icon: "📊", label: "Reports" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>📚 Library Management System</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={styles.welcome}>👤 {name} ({role})</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.layout}>
        <div style={styles.sidebar}>
          {menuItems.map((item) => (
            <button key={item.path} style={{
              ...styles.menuBtn,
              backgroundColor: window.location.pathname === item.path ? "rgba(255,255,255,0.15)" : "transparent",
              borderLeft: window.location.pathname === item.path ? "4px solid #4A90D9" : "4px solid transparent",
            }} onClick={() => navigate(item.path)}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div style={styles.content}>
          <h3 style={styles.heading}>📊 Dashboard Overview</h3>

          {overdueBooks.length > 0 && (
            <div style={styles.alertBox}>⚠️ <strong>{overdueBooks.length} Overdue Book(s)!</strong> — Please follow up!</div>
          )}
          {lowStockBooks.length > 0 && (
            <div style={styles.warningBox}>📦 <strong>{lowStockBooks.length} Book(s) Low Stock!</strong></div>
          )}

          <div style={styles.cards}>
            <div style={{ ...styles.card, borderLeft: "5px solid #4A90D9" }}><h1 style={{ color: "#4A90D9", margin: 0 }}>{stats.books}</h1><p style={styles.cardLabel}>📚 Total Books</p></div>
            <div style={{ ...styles.card, borderLeft: "5px solid #5BAD72" }}><h1 style={{ color: "#5BAD72", margin: 0 }}>{stats.members}</h1><p style={styles.cardLabel}>👥 Total Members</p></div>
            <div style={{ ...styles.card, borderLeft: "5px solid #E07B54" }}><h1 style={{ color: "#E07B54", margin: 0 }}>{stats.issued}</h1><p style={styles.cardLabel}>📋 Issued Books</p></div>
            <div style={{ ...styles.card, borderLeft: "5px solid #F0A500" }}><h1 style={{ color: "#F0A500", margin: 0 }}>{stats.fines}</h1><p style={styles.cardLabel}>⚠️ Pending Fines</p></div>
            <div style={{ ...styles.card, borderLeft: "5px solid #E74C3C" }}><h1 style={{ color: "#E74C3C", margin: 0 }}>{overdueBooks.length}</h1><p style={styles.cardLabel}>🚨 Overdue Books</p></div>
          </div>

          <div style={styles.chartsRow}>
            <div style={styles.chartBox}>
              <h4 style={styles.chartTitle}>📊 Library Overview</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} /><YAxis tick={{ fill: "#666", fontSize: 12 }} /><Tooltip /><Bar dataKey="value" fill="#4A90D9" radius={[6, 6, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.chartBox}>
              <h4 style={styles.chartTitle}>🥧 Books Status</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{pieData.map((entry, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /><Legend /></PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={styles.chartBoxFull}>
            <h4 style={styles.chartTitle}>📈 Books Availability (Top 5)</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={booksData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} /><YAxis tick={{ fill: "#666", fontSize: 12 }} /><Tooltip /><Legend /><Bar dataKey="Total" fill="#4A90D9" radius={[6, 6, 0, 0]} /><Bar dataKey="Available" fill="#5BAD72" radius={[6, 6, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>

          {overdueBooks.length > 0 && (
            <div style={styles.chartBoxFull}>
              <h4 style={{ ...styles.chartTitle, color: "#E74C3C" }}>🚨 Overdue Books</h4>
              <table style={styles.table}><thead><tr style={styles.thead}><th style={styles.th}>Issue ID</th><th style={styles.th}>Book</th><th style={styles.th}>Member</th><th style={styles.th}>Due Date</th></tr></thead>
                <tbody>{overdueBooks.map((i, idx) => (<tr key={i.issue_id} style={{ backgroundColor: idx % 2 === 0 ? "#fff5f5" : "white" }}><td style={styles.td}>{i.issue_id}</td><td style={styles.td}><strong>{i.title}</strong></td><td style={styles.td}>{i.name}</td><td style={{ ...styles.td, color: "#E74C3C", fontWeight: "bold" }}>{i.due_date?.split("T")[0]}</td></tr>))}</tbody>
              </table>
            </div>
          )}

          <div style={styles.chartBoxFull}>
            <h4 style={styles.chartTitle}>🕐 Recent Issues</h4>
            {recentIssues.length === 0 ? <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No issues yet!</p> : (
              <table style={styles.table}><thead><tr style={styles.thead}><th style={styles.th}>Issue ID</th><th style={styles.th}>Book</th><th style={styles.th}>Member</th><th style={styles.th}>Issue Date</th><th style={styles.th}>Due Date</th><th style={styles.th}>Status</th></tr></thead>
                <tbody>{recentIssues.map((i, idx) => (<tr key={i.issue_id} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}><td style={styles.td}>{i.issue_id}</td><td style={styles.td}><strong>{i.title}</strong></td><td style={styles.td}>{i.name}</td><td style={styles.td}>{i.issue_date?.split("T")[0]}</td><td style={styles.td}>{i.due_date?.split("T")[0]}</td><td style={styles.td}><span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: i.status === "issued" ? "#fff3cd" : i.status === "returned" ? "#d4edda" : "#f8d7da", color: i.status === "issued" ? "#856404" : i.status === "returned" ? "#155724" : "#721c24" }}>{i.status}</span></td></tr>))}</tbody>
              </table>
            )}
          </div>

          {lowStockBooks.length > 0 && (
            <div style={styles.chartBoxFull}>
              <h4 style={{ ...styles.chartTitle, color: "#F0A500" }}>📦 Low Stock Books</h4>
              <table style={styles.table}><thead><tr style={styles.thead}><th style={styles.th}>Book ID</th><th style={styles.th}>Title</th><th style={styles.th}>Author</th><th style={styles.th}>Available Copies</th></tr></thead>
                <tbody>{lowStockBooks.map((b, idx) => (<tr key={b.book_id} style={{ backgroundColor: idx % 2 === 0 ? "#fffdf0" : "white" }}><td style={styles.td}>{b.book_id}</td><td style={styles.td}><strong>{b.title}</strong></td><td style={styles.td}>{b.author}</td><td style={{ ...styles.td, color: "#F0A500", fontWeight: "bold" }}>{b.available_copies}</td></tr>))}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#F4F6F9" },
  navbar: { backgroundColor: "#2C3E50", padding: "14px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navTitle: { color: "white", margin: 0, fontSize: "20px", fontWeight: "bold" },
  welcome: { color: "#BDC3C7", fontSize: "14px" },
  logoutBtn: { padding: "7px 16px", backgroundColor: "#E74C3C", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  layout: { display: "flex" },
  sidebar: { width: "210px", backgroundColor: "#2C3E50", minHeight: "calc(100vh - 52px)", padding: "15px 0", display: "flex", flexDirection: "column" },
  menuBtn: { padding: "13px 20px", color: "#BDC3C7", border: "none", textAlign: "left", fontSize: "14px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  content: { flex: 1, padding: "25px" },
  heading: { color: "#2C3E50", marginBottom: "20px", fontSize: "20px", fontWeight: "bold" },
  alertBox: { padding: "12px 15px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "8px", marginBottom: "15px", borderLeft: "4px solid #E74C3C", fontSize: "14px" },
  warningBox: { padding: "12px 15px", backgroundColor: "#fff3cd", color: "#856404", borderRadius: "8px", marginBottom: "15px", borderLeft: "4px solid #F0A500", fontSize: "14px" },
  cards: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "25px" },
  card: { padding: "20px 25px", borderRadius: "10px", backgroundColor: "white", minWidth: "130px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardLabel: { color: "#666", fontSize: "13px", margin: 0 },
  chartsRow: { display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" },
  chartBox: { flex: 1, backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", minWidth: "280px" },
  chartBoxFull: { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" },
  chartTitle: { color: "#2C3E50", marginBottom: "15px", fontSize: "15px", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#F4F6F9" },
  th: { padding: "10px 12px", textAlign: "left", color: "#666", fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #eee" },
  td: { padding: "10px 12px", fontSize: "13px", color: "#444", borderBottom: "1px solid #f0f0f0" },
};

export default Dashboard;