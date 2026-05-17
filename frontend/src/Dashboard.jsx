import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { API_URL } from "./config";

function Dashboard() {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    books: 0,
    members: 0,
    issued: 0,
    fines: 0
  });

  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);

  /* ================= FIXED BOOKS FETCH ================= */
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_URL}/api/books`, { headers })
      .then(res => {

        console.log("BOOKS RESPONSE:", res.data);

        const data = res.data?.books || res.data || [];

        const safeData = Array.isArray(data) ? data : [];

        setBooks(safeData);

        setStats(prev => ({
          ...prev,
          books: safeData.length
        }));
      })
      .catch(err => console.log("BOOKS ERROR:", err));

  }, [token]);

  /* ================= OTHER STATS ================= */
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_URL}/api/members`, { headers })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setStats(prev => ({ ...prev, members: data.length }));
      })
      .catch(err => console.log(err));

    axios.get(`${API_URL}/api/issues`, { headers })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setIssues(data);
        setStats(prev => ({ ...prev, issued: data.length }));
      })
      .catch(err => console.log(err));

    axios.get(`${API_URL}/api/fines`, { headers })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setStats(prev => ({ ...prev, fines: data.length }));
      })
      .catch(err => console.log(err));

  }, [token]);

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

  const booksData = (Array.isArray(books) ? books : [])
    .slice(0, 5)
    .map(b => ({
      name: b.title?.length > 10 ? b.title.substring(0, 10) + "..." : b.title,
      Available: b.available_copies || 0,
      Total: b.total_copies || 0,
    }));

  const recentIssues = (Array.isArray(issues) ? issues : [])
    .slice(-5)
    .reverse();

  const overdueBooks = (Array.isArray(issues) ? issues : []).filter(
    i => i.status === "issued" && new Date(i.due_date) < new Date()
  );

  const lowStockBooks = (Array.isArray(books) ? books : [])
    .filter(b => b.available_copies <= 1);

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
                backgroundColor: window.location.pathname === item.path ? "rgba(255,255,255,0.15)" : "transparent",
                borderLeft: window.location.pathname === item.path ? "4px solid #4A90D9" : "4px solid transparent",
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
            <div style={styles.card}><h1>{stats.books}</h1><p>📚 Total Books</p></div>
            <div style={styles.card}><h1>{stats.members}</h1><p>👥 Members</p></div>
            <div style={styles.card}><h1>{stats.issued}</h1><p>📋 Issued</p></div>
            <div style={styles.card}><h1>{stats.fines}</h1><p>💰 Fines</p></div>
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

export default Dashboard;