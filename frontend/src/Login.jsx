import { useState } from "react";
// import axios from "axios";
import api from "./api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await api.post("/api/auth/login", {
      email: email.trim(),
      password: password.trim(),
    });

    console.log("LOGIN RESPONSE:", res.data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("name", res.data.name);

    const userRole = res.data.role;

    if (userRole === "student" || userRole === "faculty") {
      window.location.href = "/student";
    } else if (userRole === "librarian") {
      window.location.href = "/librarian";
    } else {
      window.location.href = "/dashboard";
    }

  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data);

    setError(
      err.response?.data?.message || "Server error. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.container}>
      {/* Left Side */}
      <div style={styles.leftSide}>
        <div style={styles.leftContent}>
          <div style={styles.logoBox}>📚</div>
          <h1 style={styles.systemTitle}>Library Management System</h1>
          <p style={styles.systemSubtitle}>Integrated Digital Library Solution for Schools & Colleges</p>
          <div style={styles.features}>
            <div style={styles.featureItem}>✅ Book Catalog Management</div>
            <div style={styles.featureItem}>✅ Member Registration</div>
            <div style={styles.featureItem}>✅ Issue & Return Tracking</div>
            <div style={styles.featureItem}>✅ Fine Management</div>
            <div style={styles.featureItem}>✅ Reports & Analytics</div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div style={styles.rightSide}>
        <div style={styles.loginBox}>
          <div style={styles.loginHeader}>
            <span style={styles.loginIcon}>🔐</span>
            <h2 style={styles.loginTitle}>Welcome Back</h2>
            <p style={styles.loginSubtitle}>Sign in to your account</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>📧</span>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button style={loading ? styles.btnLoading : styles.btn} type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>Library Management System v1.0</p>
            <p style={styles.footerText}>© 2026 All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
   container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  leftSide: {
    flex: 1,
    background: "linear-gradient(135deg, #1a2a4a 0%, #2C3E50 50%, #1a3a5c 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },
  leftContent: {
    color: "white",
    maxWidth: "400px",
  },
  logoBox: {
    fontSize: "60px",
    marginBottom: "20px",
    display: "block",
  },
  systemTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "white",
  },
  systemSubtitle: {
    fontSize: "14px",
    color: "#BDC3C7",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  featureItem: {
    fontSize: "14px",
    color: "#ECF0F1",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "8px",
    borderLeft: "3px solid #4A90D9",
  },
  rightSide: {
    width: "450px",
    backgroundColor: "#F4F6F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },
  loginBox: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
  },
  loginHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },
  loginIcon: {
    fontSize: "40px",
    display: "block",
    marginBottom: "10px",
  },
  loginTitle: {
    fontSize: "24px",
    color: "#2C3E50",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  loginSubtitle: {
    color: "#666",
    fontSize: "14px",
  },
  errorBox: {
    padding: "12px 15px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    borderLeft: "4px solid #E74C3C",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#555",
    fontWeight: "600",
    marginBottom: "8px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  inputIcon: {
    padding: "10px 12px",
    fontSize: "16px",
    backgroundColor: "#f0f0f0",
    borderRight: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: "12px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#f9f9f9",
  },
  btn: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#2C3E50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
  btnLoading: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#666",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "not-allowed",
    fontWeight: "bold",
    marginTop: "10px",
  },
  footer: {
    textAlign: "center",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },
  footerText: {
    color: "#999",
    fontSize: "12px",
    margin: "3px 0",
  },
};

export default Login;