import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [fines, setFines] = useState([]);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const [renewId, setRenewId] = useState("");
  const [renewMsg, setRenewMsg] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = () => {
    axios.get("http://localhost:5000/api/issues", { headers }).then(res => setIssues(res.data));
    axios.get("http://localhost:5000/api/fines", { headers }).then(res => setFines(res.data));
    axios.get("http://localhost:5000/api/books", { headers }).then(res => setBooks(res.data));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSearch = async () => {
    if (!search) { fetchAll(); return; }
    const res = await axios.get(`http://localhost:5000/api/books/search?query=${search}`, { headers });
    setBooks(res.data);
  };

  const handleRenew = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/issues/renew", { issue_id: renewId }, { headers });
      setRenewMsg("✅ " + res.data.message);
      fetchAll();
      setRenewId("");
    } catch (err) {
      setRenewMsg("❌ " + (err.response?.data?.message || "Error renewing!"));
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  const myIssues = issues.filter(i => i.status === "issued");
  const returnedBooks = issues.filter(i => i.status === "returned");
  const pendingFines = fines.filter(f => f.status === "pending");
  const overdueBooks = myIssues.filter(i => new Date(i.due_date) < new Date());

  const menuItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "profile", icon: "👤", label: "My Profile" },
    { id: "mybooks", icon: "📋", label: "My Books" },
    { id: "fines", icon: "💰", label: "My Fines" },
    { id: "search", icon: "🔍", label: "Search Books" },
    { id: "history", icon: "📖", label: "History" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>📚 Library Management System</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={styles.welcome}>👤 {name} (Student)</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <div style={styles.sidebarProfile}>
            <div style={styles.avatar}>👤</div>
            <p style={styles.sidebarName}>{name}</p>
            <p style={styles.sidebarRole}>Student</p>
          </div>
          {menuItems.map((item) => (
            <button key={item.id} style={{
              ...styles.menuBtn,
              backgroundColor: activePage === item.id ? "rgba(255,255,255,0.15)" : "transparent",
              borderLeft: activePage === item.id ? "4px solid #4A90D9" : "4px solid transparent",
            }} onClick={() => setActivePage(item.id)}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div style={styles.content}>

          {/* DASHBOARD */}
          {activePage === "dashboard" && (
            <div>
              <h2 style={styles.heading}>🏠 My Dashboard</h2>
              <div style={styles.cards}>
                <div style={{ ...styles.card, borderLeft: "5px solid #4A90D9" }}>
                  <h2 style={{ color: "#4A90D9", margin: 0 }}>{myIssues.length}</h2>
                  <p style={styles.cardLabel}>📋 Books Issued</p>
                </div>
                <div style={{ ...styles.card, borderLeft: "5px solid #E74C3C" }}>
                  <h2 style={{ color: "#E74C3C", margin: 0 }}>{overdueBooks.length}</h2>
                  <p style={styles.cardLabel}>⚠️ Overdue Books</p>
                </div>
                <div style={{ ...styles.card, borderLeft: "5px solid #F0A500" }}>
                  <h2 style={{ color: "#F0A500", margin: 0 }}>{pendingFines.length}</h2>
                  <p style={styles.cardLabel}>💰 Pending Fines</p>
                </div>
                <div style={{ ...styles.card, borderLeft: "5px solid #5BAD72" }}>
                  <h2 style={{ color: "#5BAD72", margin: 0 }}>{returnedBooks.length}</h2>
                  <p style={styles.cardLabel}>✅ Books Returned</p>
                </div>
              </div>
              {overdueBooks.length > 0 && <div style={styles.alertBox}>⚠️ You have {overdueBooks.length} overdue book(s)! Please return immediately!</div>}
              {pendingFines.length > 0 && <div style={styles.fineAlertBox}>💰 You have {pendingFines.length} pending fine(s)! Pay at library counter.</div>}
              <div style={styles.tableBox}>
                <h3 style={styles.tableTitle}>📋 Currently Issued Books</h3>
                {myIssues.length === 0 ? (
                  <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No books currently issued!</p>
                ) : (
                  <table style={styles.table}>
                    <thead><tr style={styles.thead}>
                      <th style={styles.th}>Book</th>
                      <th style={styles.th}>Issue Date</th>
                      <th style={styles.th}>Due Date</th>
                      <th style={styles.th}>Status</th>
                    </tr></thead>
                    <tbody>
                      {myIssues.map((i, idx) => (
                        <tr key={i.issue_id} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                          <td style={styles.td}><strong>{i.title}</strong></td>
                          <td style={styles.td}>{i.issue_date?.split("T")[0]}</td>
                          <td style={styles.td}>{i.due_date?.split("T")[0]}</td>
                          <td style={styles.td}>
                            <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: new Date(i.due_date) < new Date() ? "#f8d7da" : "#fff3cd", color: new Date(i.due_date) < new Date() ? "#721c24" : "#856404" }}>
                              {new Date(i.due_date) < new Date() ? "⚠️ Overdue" : "📋 Issued"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activePage === "profile" && (
            <div>
              <h2 style={styles.heading}>👤 My Profile</h2>
              <div style={styles.tableBox}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px", gap: "15px" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#2C3E50", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>👤</div>
                  <h2 style={{ color: "#2C3E50", margin: 0 }}>{name}</h2>
                  <span style={{ padding: "4px 15px", backgroundColor: "#4A90D9", color: "white", borderRadius: "12px", fontSize: "13px" }}>Student</span>
                </div>
                <div style={{ padding: "20px", borderTop: "1px solid #eee" }}>
                  <div style={styles.profileRow}><span style={styles.profileLabel}>👤 Full Name</span><span style={styles.profileValue}>{name}</span></div>
                  <div style={styles.profileRow}><span style={styles.profileLabel}>🎓 Role</span><span style={styles.profileValue}>Student</span></div>
                  <div style={styles.profileRow}><span style={styles.profileLabel}>📋 Books Issued</span><span style={styles.profileValue}>{myIssues.length}</span></div>
                  <div style={styles.profileRow}><span style={styles.profileLabel}>📖 Books Returned</span><span style={styles.profileValue}>{returnedBooks.length}</span></div>
                  <div style={styles.profileRow}><span style={styles.profileLabel}>💰 Pending Fines</span><span style={{ ...styles.profileValue, color: pendingFines.length > 0 ? "#E74C3C" : "#5BAD72" }}>{pendingFines.length > 0 ? `${pendingFines.length} Pending` : "No Fines ✅"}</span></div>
                  <div style={styles.profileRow}><span style={styles.profileLabel}>⚠️ Overdue Books</span><span style={{ ...styles.profileValue, color: overdueBooks.length > 0 ? "#E74C3C" : "#5BAD72" }}>{overdueBooks.length > 0 ? `${overdueBooks.length} Overdue` : "None ✅"}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* MY BOOKS */}
          {activePage === "mybooks" && (
            <div>
              <h2 style={styles.heading}>📋 My Issued Books</h2>
              <div style={styles.tableBox}>
                <table style={styles.table}>
                  <thead><tr style={styles.thead}>
                    <th style={styles.th}>Issue ID</th>
                    <th style={styles.th}>Book Title</th>
                    <th style={styles.th}>Issue Date</th>
                    <th style={styles.th}>Due Date</th>
                    <th style={styles.th}>Status</th>
                  </tr></thead>
                  <tbody>
                    {myIssues.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#999" }}>No books issued!</td></tr>
                    ) : (
                      myIssues.map((i, idx) => (
                        <tr key={i.issue_id} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                          <td style={styles.td}>{i.issue_id}</td>
                          <td style={styles.td}><strong>{i.title}</strong></td>
                          <td style={styles.td}>{i.issue_date?.split("T")[0]}</td>
                          <td style={styles.td}>{i.due_date?.split("T")[0]}</td>
                          <td style={styles.td}>
                            <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: new Date(i.due_date) < new Date() ? "#f8d7da" : "#fff3cd", color: new Date(i.due_date) < new Date() ? "#721c24" : "#856404" }}>
                              {new Date(i.due_date) < new Date() ? "⚠️ Overdue" : "📋 Issued"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* RENEW BOOK */}
              <div style={styles.tableBox}>
                <h3 style={styles.tableTitle}>🔄 Renew Book</h3>
                <form onSubmit={handleRenew} style={{ display: "flex", gap: "10px", alignItems: "flex-end", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>Issue ID</label>
                    <input style={{ padding: "9px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", width: "180px" }}
                      placeholder="Enter Issue ID" value={renewId} onChange={(e) => setRenewId(e.target.value)} required />
                  </div>
                  <button style={{ padding: "9px 20px", backgroundColor: "#4A90D9", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }} type="submit">
                    🔄 Renew Book
                  </button>
                  {renewMsg && <span style={{ fontSize: "13px", color: renewMsg.includes("✅") ? "#155724" : "#721c24" }}>{renewMsg}</span>}
                </form>
              </div>
            </div>
          )}

          {/* MY FINES */}
          {activePage === "fines" && (
            <div>
              <h2 style={styles.heading}>💰 My Fines</h2>
              <div style={styles.cards}>
                <div style={{ ...styles.card, borderLeft: "5px solid #E74C3C" }}>
                  <h2 style={{ color: "#E74C3C", margin: 0 }}>{pendingFines.length}</h2>
                  <p style={styles.cardLabel}>⚠️ Pending Fines</p>
                </div>
                <div style={{ ...styles.card, borderLeft: "5px solid #5BAD72" }}>
                  <h2 style={{ color: "#5BAD72", margin: 0 }}>{fines.filter(f => f.status === "paid").length}</h2>
                  <p style={styles.cardLabel}>✅ Paid Fines</p>
                </div>
              </div>
              <div style={styles.tableBox}>
                <h3 style={styles.tableTitle}>⚠️ Pending Fines</h3>
                {pendingFines.length === 0 ? (
                  <p style={{ color: "#5BAD72", textAlign: "center", padding: "20px", fontWeight: "bold" }}>🎉 No pending fines!</p>
                ) : (
                  <table style={styles.table}>
                    <thead><tr style={styles.thead}>
                      <th style={styles.th}>Fine ID</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Status</th>
                    </tr></thead>
                    <tbody>
                      {pendingFines.map((f, i) => (
                        <tr key={f.fine_id} style={{ backgroundColor: i % 2 === 0 ? "#fff9f5" : "white" }}>
                          <td style={styles.td}>{f.fine_id}</td>
                          <td style={styles.td}><strong>Rs. {f.amount}</strong></td>
                          <td style={styles.td}><span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: "#fff3cd", color: "#856404" }}>Pending — Pay at library counter</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* SEARCH BOOKS */}
          {activePage === "search" && (
            <div>
              <h2 style={styles.heading}>🔍 Search Books</h2>
              <div style={styles.tableBox}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                  <input style={styles.searchInput} placeholder="Search by title, author, ISBN..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()} />
                  <button style={styles.btn} onClick={handleSearch}>Search</button>
                  <button style={{ ...styles.btn, backgroundColor: "#666" }} onClick={() => { setSearch(""); fetchAll(); }}>Reset</button>
                </div>
                <table style={styles.table}>
                  <thead><tr style={styles.thead}>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Author</th>
                    <th style={styles.th}>Publisher</th>
                    <th style={styles.th}>Year</th>
                    <th style={styles.th}>Availability</th>
                  </tr></thead>
                  <tbody>
                    {books.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#999" }}>No books found!</td></tr>
                    ) : (
                      books.map((b, i) => (
                        <tr key={b.book_id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                          <td style={styles.td}><strong>{b.title}</strong></td>
                          <td style={styles.td}>{b.author}</td>
                          <td style={styles.td}>{b.publisher}</td>
                          <td style={styles.td}>{b.year}</td>
                          <td style={styles.td}>
                            <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: b.available_copies > 0 ? "#d4edda" : "#f8d7da", color: b.available_copies > 0 ? "#155724" : "#721c24" }}>
                              {b.available_copies > 0 ? `✅ ${b.available_copies} Available` : "❌ Not Available"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HISTORY */}
          {activePage === "history" && (
            <div>
              <h2 style={styles.heading}>📖 Borrowing History</h2>
              <div style={styles.tableBox}>
                <table style={styles.table}>
                  <thead><tr style={styles.thead}>
                    <th style={styles.th}>Issue ID</th>
                    <th style={styles.th}>Book Title</th>
                    <th style={styles.th}>Issue Date</th>
                    <th style={styles.th}>Return Date</th>
                    <th style={styles.th}>Status</th>
                  </tr></thead>
                  <tbody>
                    {issues.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#999" }}>No history yet!</td></tr>
                    ) : (
                      issues.map((i, idx) => (
                        <tr key={i.issue_id} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                          <td style={styles.td}>{i.issue_id}</td>
                          <td style={styles.td}><strong>{i.title}</strong></td>
                          <td style={styles.td}>{i.issue_date?.split("T")[0]}</td>
                          <td style={styles.td}>{i.return_date ? i.return_date.split("T")[0] : "-"}</td>
                          <td style={styles.td}>
                            <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: i.status === "returned" ? "#d4edda" : i.status === "issued" ? "#fff3cd" : "#f8d7da", color: i.status === "returned" ? "#155724" : i.status === "issued" ? "#856404" : "#721c24" }}>
                              {i.status === "returned" ? "✅ Returned" : i.status === "issued" ? "📋 Issued" : "⚠️ Overdue"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
  navTitle: { color: "white", margin: 0, fontSize: "20px" },
  welcome: { color: "#BDC3C7", fontSize: "14px" },
  logoutBtn: { padding: "7px 16px", backgroundColor: "#E74C3C", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  layout: { display: "flex" },
  sidebar: { width: "220px", backgroundColor: "#2C3E50", minHeight: "calc(100vh - 52px)", padding: "0", display: "flex", flexDirection: "column" },
  sidebarProfile: { padding: "20px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)" },
  avatar: { fontSize: "40px", marginBottom: "8px" },
  sidebarName: { color: "white", margin: "0 0 4px 0", fontSize: "14px", fontWeight: "bold" },
  sidebarRole: { color: "#4A90D9", margin: 0, fontSize: "12px", backgroundColor: "rgba(74,144,217,0.2)", padding: "2px 10px", borderRadius: "10px", display: "inline-block" },
  menuBtn: { padding: "13px 20px", color: "#BDC3C7", border: "none", textAlign: "left", fontSize: "14px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  content: { flex: 1, padding: "25px" },
  heading: { color: "#2C3E50", marginBottom: "20px" },
  cards: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "25px" },
  card: { padding: "20px 25px", borderRadius: "10px", backgroundColor: "white", minWidth: "150px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardLabel: { color: "#666", fontSize: "13px", margin: "5px 0 0 0" },
  alertBox: { padding: "12px 15px", backgroundColor: "#fff3cd", color: "#856404", borderRadius: "8px", marginBottom: "15px", borderLeft: "4px solid #F0A500", fontSize: "14px" },
  fineAlertBox: { padding: "12px 15px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "8px", marginBottom: "15px", borderLeft: "4px solid #E74C3C", fontSize: "14px" },
  tableBox: { backgroundColor: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  tableTitle: { color: "#2C3E50", marginBottom: "15px" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#F4F6F9" },
  th: { padding: "10px 12px", textAlign: "left", color: "#666", fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #eee" },
  td: { padding: "10px 12px", fontSize: "13px", color: "#444", borderBottom: "1px solid #f0f0f0" },
  searchInput: { padding: "9px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", width: "300px" },
  btn: { padding: "9px 16px", backgroundColor: "#2C3E50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  profileRow: { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f0f0" },
  profileLabel: { color: "#666", fontSize: "14px" },
  profileValue: { color: "#2C3E50", fontSize: "14px", fontWeight: "bold" },
};

export default StudentDashboard;