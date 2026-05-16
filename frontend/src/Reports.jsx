import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import api from "./api";

function Reports() {
  const name = localStorage.getItem("name");

  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [fines, setFines] = useState([]);
  const [mostBorrowed, setMostBorrowed] = useState([]);

  // ✅ FIXED API CALLS (no headers, no axios)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [b, m, i, f, mb] = await Promise.all([
          api.get("/api/books"),
          api.get("/api/members"),
          api.get("/api/issues"),
          api.get("/api/fines"),
          api.get("/api/reports/most-borrowed"),
        ]);

        setBooks(b.data || []);
        setMembers(m.data || []);
        setIssues(i.data || []);
        setFines(f.data || []);
        setMostBorrowed(mb.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // ✅ SAFE ARRAYS
  const safeBooks = Array.isArray(books) ? books : [];
  const safeMembers = Array.isArray(members) ? members : [];
  const safeIssues = Array.isArray(issues) ? issues : [];
  const safeFines = Array.isArray(fines) ? fines : [];

  const collectedFines = safeFines
    .filter(f => f.status === "paid")
    .reduce((sum, f) => sum + Number(f.paid_amount || 0), 0);

  const overdueIssues = safeIssues.filter(
    i => i.status === "issued" && new Date(i.due_date) < new Date()
  );

  const booksData = safeBooks.slice(0, 6).map(b => ({
    name: b.title?.length > 12 ? b.title.substring(0, 12) + "..." : b.title,
    Total: b.total_copies,
    Available: b.available_copies
  }));

  const memberData = [
    { name: "Students", value: safeMembers.filter(m => m.member_type === "student").length },
    { name: "Faculty", value: safeMembers.filter(m => m.member_type === "faculty").length }
  ];

  const issueData = [
    { name: "Issued", value: safeIssues.filter(i => i.status === "issued").length },
    { name: "Returned", value: safeIssues.filter(i => i.status === "returned").length },
    { name: "Overdue", value: overdueIssues.length }
  ];

  const COLORS = ["#4A90D9", "#5BAD72", "#E07B54", "#F0A500"];

  // exportPDF + Excel SAME (no change needed)

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>📚 Library Management System</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={styles.welcome}>👤 {name}</span>
        </div>
      </div>

      <div style={styles.layout}>
        <Sidebar />

        <div style={styles.content}>
          <h2 style={styles.heading}>📊 Reports & Analytics</h2>

          {/* 👇 REST SAME UI (no changes needed) */}
        </div>
      </div>
    </div>
  );
}

export default Reports;