import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
// import { API_URL } from "./config";
import api from "./api"; // 👈 USE THIS ONLY

function Fines() {
  const name = localStorage.getItem("name");

  const [fines, setFines] = useState([]);
  const [message, setMessage] = useState("");
  const [payForm, setPayForm] = useState({ fine_id: "", paid_amount: "" });
  const [waiveForm, setWaiveForm] = useState({ fine_id: "", reason: "" });

  // ✅ FIX: always normalize array
  const fetchFines = async () => {
    try {
      const res = await api.get("/api/fines");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.fines || res.data?.data || [];

      setFines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setFines([]);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/fines/pay", payForm);
      setMessage("✅ Fine paid!");
      fetchFines();
      setPayForm({ fine_id: "", paid_amount: "" });
    } catch {
      setMessage("❌ Error paying fine!");
    }
  };

  const handleWaive = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/fines/waive", waiveForm);
      setMessage("✅ Fine waived!");
      fetchFines();
      setWaiveForm({ fine_id: "", reason: "" });
    } catch {
      setMessage("❌ Error waiving fine!");
    }
  };

  // ✅ SAFE ARRAY (IMPORTANT FIX)
  const safeFines = Array.isArray(fines) ? fines : [];

  const pendingFines = safeFines.filter(f => f.status === "pending");
  const paidFines = safeFines.filter(f => f.status === "paid");
  const waivedFines = safeFines.filter(f => f.status === "waived");

  const totalPending = pendingFines.reduce((s, f) => s + Number(f.amount || 0), 0);
  const totalCollected = paidFines.reduce((s, f) => s + Number(f.paid_amount || 0), 0);

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
          <h2 style={styles.heading}>💰 Fine Management</h2>

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

          {/* cards same */}
          <div style={styles.cards}>
            <div style={{ ...styles.card, borderLeft: "5px solid #E07B54" }}>
              <h2 style={{ color: "#E07B54", margin: 0 }}>{pendingFines.length}</h2>
              <p style={styles.cardLabel}>⚠️ Pending</p>
            </div>

            <div style={{ ...styles.card, borderLeft: "5px solid #F0A500" }}>
              <h2 style={{ color: "#F0A500", margin: 0 }}>Rs. {totalPending}</h2>
              <p style={styles.cardLabel}>💸 Total Pending</p>
            </div>

            <div style={{ ...styles.card, borderLeft: "5px solid #5BAD72" }}>
              <h2 style={{ color: "#5BAD72", margin: 0 }}>{paidFines.length}</h2>
              <p style={styles.cardLabel}>✅ Paid</p>
            </div>

            <div style={{ ...styles.card, borderLeft: "5px solid #4A90D9" }}>
              <h2 style={{ color: "#4A90D9", margin: 0 }}>Rs. {totalCollected}</h2>
              <p style={styles.cardLabel}>💰 Collected</p>
            </div>

            <div style={{ ...styles.card, borderLeft: "5px solid #9B59B6" }}>
              <h2 style={{ color: "#9B59B6", margin: 0 }}>{waivedFines.length}</h2>
              <p style={styles.cardLabel}>🔓 Waived</p>
            </div>
          </div>

          {/* rest UI SAME (no change needed) */}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#F4F6F8",
    minHeight: "100vh"
  },

  navbar: {
    backgroundColor: "#1F2A44",
    color: "white",
    padding: "15px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  navTitle: {
    margin: 0
  },

  welcome: {
    fontWeight: "bold"
  },

  logoutBtn: {
    backgroundColor: "#E74C3C",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  layout: {
    display: "flex"
  },

  content: {
    flex: 1,
    padding: "20px"
  },

  heading: {
    marginBottom: "20px"
  },

  cards: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  },

  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "160px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },

  cardLabel: {
    margin: "5px 0 0 0",
    color: "#666"
  }
};

export default Fines;