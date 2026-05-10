import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

function Fines() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const headers = { Authorization: `Bearer ${token}` };

  const [fines, setFines] = useState([]);
  const [message, setMessage] = useState("");
  const [payForm, setPayForm] = useState({ fine_id: "", paid_amount: "" });
  const [waiveForm, setWaiveForm] = useState({ fine_id: "", reason: "" });

  const fetchFines = () => {
    axios.get("http://localhost:5000/api/fines", { headers })
      .then((res) => setFines(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => { fetchFines(); }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/fines/pay", payForm, { headers });
      setMessage("✅ Fine paid successfully!");
      fetchFines();
      setPayForm({ fine_id: "", paid_amount: "" });
    } catch { setMessage("❌ Error paying fine!"); }
  };

  const handleWaive = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/fines/waive", waiveForm, { headers });
      setMessage("✅ Fine waived successfully!");
      fetchFines();
      setWaiveForm({ fine_id: "", reason: "" });
    } catch { setMessage("❌ Error waiving fine!"); }
  };

  const pendingFines = fines.filter(f => f.status === "pending");
  const paidFines = fines.filter(f => f.status === "paid");
  const waivedFines = fines.filter(f => f.status === "waived");
  const totalPending = pendingFines.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
  const totalCollected = paidFines.reduce((sum, f) => sum + parseFloat(f.paid_amount || 0), 0);

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
          <h2 style={styles.heading}>💰 Fine Management</h2>

          {message && (
            <p style={{ padding: "10px", backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da", color: message.includes("✅") ? "#155724" : "#721c24", borderRadius: "6px", marginBottom: "15px" }}>
              {message}
            </p>
          )}

          {/* Summary Cards */}
          <div style={styles.cards}>
            <div style={{ ...styles.card, borderLeft: "5px solid #E07B54" }}>
              <h2 style={{ color: "#E07B54", margin: 0 }}>{pendingFines.length}</h2>
              <p style={styles.cardLabel}>⚠️ Pending Fines</p>
            </div>
            <div style={{ ...styles.card, borderLeft: "5px solid #F0A500" }}>
              <h2 style={{ color: "#F0A500", margin: 0 }}>Rs. {totalPending}</h2>
              <p style={styles.cardLabel}>💸 Total Pending</p>
            </div>
            <div style={{ ...styles.card, borderLeft: "5px solid #5BAD72" }}>
              <h2 style={{ color: "#5BAD72", margin: 0 }}>{paidFines.length}</h2>
              <p style={styles.cardLabel}>✅ Paid Fines</p>
            </div>
            <div style={{ ...styles.card, borderLeft: "5px solid #4A90D9" }}>
              <h2 style={{ color: "#4A90D9", margin: 0 }}>Rs. {totalCollected}</h2>
              <p style={styles.cardLabel}>💰 Total Collected</p>
            </div>
            <div style={{ ...styles.card, borderLeft: "5px solid #9B59B6" }}>
              <h2 style={{ color: "#9B59B6", margin: 0 }}>{waivedFines.length}</h2>
              <p style={styles.cardLabel}>🔓 Waived Fines</p>
            </div>
          </div>

          {/* Forms Row */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
            {/* Pay Fine */}
            <div style={{ ...styles.formBox, flex: 1 }}>
              <h3 style={styles.formTitle}>💳 Pay Fine</h3>
              <form onSubmit={handlePay} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Fine ID *</label>
                  <input style={styles.input} placeholder="Fine ID" value={payForm.fine_id}
                    onChange={(e) => setPayForm({ ...payForm, fine_id: e.target.value })} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Amount (Rs.) *</label>
                  <input style={styles.input} placeholder="Amount" type="number" value={payForm.paid_amount}
                    onChange={(e) => setPayForm({ ...payForm, paid_amount: e.target.value })} required />
                </div>
                <button style={styles.payBtn} type="submit">💳 Pay</button>
              </form>
            </div>

            {/* Waive Fine */}
            <div style={{ ...styles.formBox, flex: 1 }}>
              <h3 style={styles.formTitle}>🔓 Waive Fine (Admin Only)</h3>
              <form onSubmit={handleWaive} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Fine ID *</label>
                  <input style={styles.input} placeholder="Fine ID" value={waiveForm.fine_id}
                    onChange={(e) => setWaiveForm({ ...waiveForm, fine_id: e.target.value })} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Reason *</label>
                  <input style={styles.input} placeholder="Reason" value={waiveForm.reason}
                    onChange={(e) => setWaiveForm({ ...waiveForm, reason: e.target.value })} required />
                </div>
                <button style={styles.waiveBtn} type="submit">🔓 Waive</button>
              </form>
            </div>
          </div>

          {/* Pending Fines */}
          <div style={styles.tableBox}>
            <h4 style={styles.tableTitle}>⚠️ Pending Fines ({pendingFines.length})</h4>
            {pendingFines.length === 0 ? (
              <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No pending fines!</p>
            ) : (
              <table style={styles.table}>
                <thead><tr style={styles.thead}>
                  <th style={styles.th}>Fine ID</th>
                  <th style={styles.th}>Member</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                </tr></thead>
                <tbody>
                  {pendingFines.map((f, i) => (
                    <tr key={f.fine_id} style={{ backgroundColor: i % 2 === 0 ? "#fff9f5" : "white" }}>
                      <td style={styles.td}>{f.fine_id}</td>
                      <td style={styles.td}>{f.name}</td>
                      <td style={styles.td}>Rs. {f.amount}</td>
                      <td style={styles.td}><span style={styles.pendingBadge}>Pending</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Paid Fines */}
          <div style={styles.tableBox}>
            <h4 style={styles.tableTitle}>✅ Paid Fines ({paidFines.length})</h4>
            {paidFines.length === 0 ? (
              <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No paid fines!</p>
            ) : (
              <table style={styles.table}>
                <thead><tr style={styles.thead}>
                  <th style={styles.th}>Fine ID</th>
                  <th style={styles.th}>Member</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Paid Date</th>
                  <th style={styles.th}>Status</th>
                </tr></thead>
                <tbody>
                  {paidFines.map((f, i) => (
                    <tr key={f.fine_id} style={{ backgroundColor: i % 2 === 0 ? "#f5fff8" : "white" }}>
                      <td style={styles.td}>{f.fine_id}</td>
                      <td style={styles.td}>{f.name}</td>
                      <td style={styles.td}>Rs. {f.paid_amount}</td>
                      <td style={styles.td}>{f.paid_date?.split("T")[0]}</td>
                      <td style={styles.td}><span style={styles.paidBadge}>Paid</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Waived Fines */}
          {waivedFines.length > 0 && (
            <div style={styles.tableBox}>
              <h4 style={styles.tableTitle}>🔓 Waived Fines ({waivedFines.length})</h4>
              <table style={styles.table}>
                <thead><tr style={styles.thead}>
                  <th style={styles.th}>Fine ID</th>
                  <th style={styles.th}>Member</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                </tr></thead>
                <tbody>
                  {waivedFines.map((f, i) => (
                    <tr key={f.fine_id} style={{ backgroundColor: i % 2 === 0 ? "#f5f0ff" : "white" }}>
                      <td style={styles.td}>{f.fine_id}</td>
                      <td style={styles.td}>{f.name}</td>
                      <td style={styles.td}>Rs. {f.amount}</td>
                      <td style={styles.td}><span style={styles.waivedBadge}>Waived</span></td>
                    </tr>
                  ))}
                </tbody>
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
  navTitle: { color: "white", margin: 0, fontSize: "20px" },
  welcome: { color: "#BDC3C7", fontSize: "14px" },
  logoutBtn: { padding: "7px 16px", backgroundColor: "#E74C3C", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  layout: { display: "flex" },
  content: { flex: 1, padding: "25px" },
  heading: { color: "#2C3E50", marginBottom: "20px" },
  cards: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "25px" },
  card: { padding: "20px 25px", borderRadius: "10px", backgroundColor: "white", minWidth: "130px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardLabel: { color: "#666", fontSize: "13px", margin: "5px 0 0 0" },
  formBox: { backgroundColor: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  formTitle: { color: "#2C3E50", marginBottom: "15px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", color: "#666", fontWeight: "600" },
  input: { padding: "9px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", width: "150px" },
  payBtn: { padding: "9px 20px", backgroundColor: "#2C3E50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  waiveBtn: { padding: "9px 20px", backgroundColor: "#9B59B6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  tableBox: { backgroundColor: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  tableTitle: { color: "#2C3E50", marginBottom: "15px" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#F4F6F9" },
  th: { padding: "10px 12px", textAlign: "left", color: "#666", fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #eee" },
  td: { padding: "10px 12px", fontSize: "13px", color: "#444", borderBottom: "1px solid #f0f0f0" },
  pendingBadge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: "#fff3cd", color: "#856404" },
  paidBadge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: "#d4edda", color: "#155724" },
  waivedBadge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: "#e8d5ff", color: "#6c3483" },
};

export default Fines;