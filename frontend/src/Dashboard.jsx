import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

import api from "./api";

function Dashboard() {

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    books: 0,
    members: 0,
    issued: 0,
    fines: 0
  });

  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);

  /* ================= BOOKS ================= */

  useEffect(() => {

    api.get("/api/books")
      .then(res => {

        console.log("BOOKS:", res.data);

        const data = Array.isArray(res.data) ? res.data : [];

        setBooks(data);

        setStats(prev => ({
          ...prev,
          books: data.length
        }));

      })
      .catch(err => console.log("BOOK ERROR:", err));

  }, []);

  /* ================= MEMBERS ================= */

  useEffect(() => {

    api.get("/api/members")
      .then(res => {

        const data = Array.isArray(res.data) ? res.data : [];

        setStats(prev => ({
          ...prev,
          members: data.length
        }));

      })
      .catch(err => console.log(err));

  }, []);

  /* ================= ISSUES ================= */

  useEffect(() => {

    api.get("/api/issues")
      .then(res => {

        const data = Array.isArray(res.data) ? res.data : [];

        setIssues(data);

        setStats(prev => ({
          ...prev,
          issued: data.length
        }));

      })
      .catch(err => console.log(err));

  }, []);

  /* ================= FINES ================= */

  useEffect(() => {

    api.get("/api/fines")
      .then(res => {

        const data = Array.isArray(res.data) ? res.data : [];

        setStats(prev => ({
          ...prev,
          fines: data.length
        }));

      })
      .catch(err => console.log(err));

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

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

  const booksData = books
    .slice(0, 5)
    .map(b => ({
      name: b.title?.length > 10 ? b.title.substring(0, 10) + "..." : b.title,
      Available: b.available_copies || 0,
      Total: b.total_copies || 0,
    }));

  const recentIssues = issues
    .slice(-5)
    .reverse();

  const overdueBooks = issues.filter(
    i => i.status === "issued" && new Date(i.due_date) < new Date()
  );

  const lowStockBooks = books.filter(
    b => b.available_copies <= 1
  );

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

          {menuItems.map(item => (

            <button
              key={item.path}
              style={{
                ...styles.menuBtn,
                backgroundColor:
                  window.location.pathname === item.path
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                borderLeft:
                  window.location.pathname === item.path
                    ? "4px solid #4A90D9"
                    : "4px solid transparent",
              }}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.label}

            </button>

          ))}

        </div>

        <div style={styles.content}>

          <h3 style={styles.heading}>📊 Dashboard Overview</h3>

          {overdueBooks.length > 0 && (
            <div style={styles.alertBox}>
              ⚠️ <strong>{overdueBooks.length} Overdue Book(s)!</strong>
            </div>
          )}

          {lowStockBooks.length > 0 && (
            <div style={styles.warningBox}>
              📦 <strong>{lowStockBooks.length} Book(s) Low Stock!</strong>
            </div>
          )}

          <div style={styles.cards}>

            <div style={styles.card}>
              <h1>{stats.books}</h1>
              <p>📚 Total Books</p>
            </div>

            <div style={styles.card}>
              <h1>{stats.members}</h1>
              <p>👥 Members</p>
            </div>

            <div style={styles.card}>
              <h1>{stats.issued}</h1>
              <p>📋 Issued</p>
            </div>

            <div style={styles.card}>
              <h1>{stats.fines}</h1>
              <p>💰 Fines</p>
            </div>

          </div>

          <div style={styles.chartsRow}>

            <div style={styles.chartBox}>

              <h4>📊 Overview</h4>

              <ResponsiveContainer width="100%" height={220}>

                <BarChart data={barData}>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Bar dataKey="value" fill="#4A90D9" />

                </BarChart>

              </ResponsiveContainer>

            </div>

            <div style={styles.chartBox}>

              <h4>🥧 Books Status</h4>

              <ResponsiveContainer width="100%" height={220}>

                <PieChart>

                  <Pie data={pieData} dataKey="value" label>

                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}

                  </Pie>

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          <div style={styles.chartBoxFull}>

            <h4>📈 Top Books</h4>

            <ResponsiveContainer width="100%" height={220}>

              <BarChart data={booksData}>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="Total" fill="#4A90D9" />
                <Bar dataKey="Available" fill="#5BAD72" />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: "Arial", minHeight: "100vh", background: "#F4F6F9" },

  navbar: {
    background: "#2C3E50",
    padding: "14px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  navTitle: { color: "white", margin: 0, fontSize: "20px" },

  welcome: { color: "#BDC3C7", fontSize: "14px" },

  logoutBtn: {
    padding: "7px 16px",
    background: "#E74C3C",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  layout: { display: "flex" },

  sidebar: {
    width: "210px",
    background: "#2C3E50",
    minHeight: "100vh",
    padding: "15px 0",
    display: "flex",
    flexDirection: "column"
  },

  menuBtn: {
    padding: "13px 20px",
    color: "#BDC3C7",
    border: "none",
    textAlign: "left",
    fontSize: "14px",
    cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  },

  content: { flex: 1, padding: "25px" },

  heading: { color: "#2C3E50", marginBottom: "20px" },

  alertBox: {
    padding: "12px 15px",
    background: "#f8d7da",
    color: "#721c24",
    borderRadius: "8px",
    marginBottom: "15px",
    borderLeft: "4px solid #E74C3C"
  },

  warningBox: {
    padding: "12px 15px",
    background: "#fff3cd",
    color: "#856404",
    borderRadius: "8px",
    marginBottom: "15px",
    borderLeft: "4px solid #F0A500"
  },

  cards: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "25px"
  },

  card: {
    padding: "20px 25px",
    borderRadius: "10px",
    background: "white",
    minWidth: "130px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  },

  chartsRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },

  chartBox: {
    flex: 1,
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    minWidth: "280px"
  },

  chartBoxFull: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "20px"
  }
};

export default Dashboard;