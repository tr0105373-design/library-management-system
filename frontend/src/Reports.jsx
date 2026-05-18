import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
// import { API_URL} from "./config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import api from "./api";   


function Reports() {

const token = localStorage.getItem("token");
const name = localStorage.getItem("name");
const headers = { Authorization: `Bearer ${token}` };

const [books, setBooks] = useState([]);
const [members, setMembers] = useState([]);
const [issues, setIssues] = useState([]);
const [fines, setFines] = useState([]);
const [mostBorrowed, setMostBorrowed] = useState([]);

useEffect(() => {

axios.get(`${API_URL}/api/books`, { headers }).then(res => setBooks(res.data));
axios.get(`${API_URL}/api/members`, { headers }).then(res => setMembers(res.data));
axios.get(`${API_URL}/api/issues`, { headers }).then(res => setIssues(res.data));
axios.get(`${API_URL}/api/fines`, { headers }).then(res => setFines(res.data));
axios.get(`${API_URL}/api/reports/most-borrowed`, { headers }).then(res => setMostBorrowed(res.data));

}, []);

const collectedFines = fines.filter(f => f.status === "paid").reduce((sum, f) => sum + parseFloat(f.paid_amount || 0), 0);

const overdueIssues = issues.filter(
i => i.status === "issued" && new Date(i.due_date) < new Date()
);

const booksData = books.slice(0, 6).map(b => ({
name: b.title.length > 12 ? b.title.substring(0, 12) + "..." : b.title,
Total: b.total_copies,
Available: b.available_copies
}));

const memberData = [
{ name: "Students", value: members.filter(m => m.member_type === "student").length },
{ name: "Faculty", value: members.filter(m => m.member_type === "faculty").length }
];

const issueData = [
{ name: "Issued", value: issues.filter(i => i.status === "issued").length },
{ name: "Returned", value: issues.filter(i => i.status === "returned").length },
{ name: "Overdue", value: overdueIssues.length }
];

const COLORS = ["#4A90D9", "#5BAD72", "#E07B54", "#F0A500"];

const exportPDF = () => {

const doc = new jsPDF();

doc.setFontSize(18);
doc.text("Library Management System - Report", 14, 20);

doc.setFontSize(11);
doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

doc.setFontSize(14);
doc.text("Summary", 14, 45);

autoTable(doc, {
startY: 50,
head: [["Total Books", "Total Members", "Issued", "Overdue", "Collected"]],
body: [[
books.length,
members.length,
issues.filter(i => i.status === "issued").length,
overdueIssues.length,
`Rs. ${collectedFines}`
]],
theme: "grid",
headStyles: { fillColor: [44, 62, 80] }
});

doc.text("Most Borrowed Books", 14, doc.lastAutoTable.finalY + 15);

autoTable(doc, {
startY: doc.lastAutoTable.finalY + 20,
head: [["Title", "Author", "Times Borrowed"]],
body: mostBorrowed.map(b => [b.title, b.author, b.borrow_count]),
theme: "grid",
headStyles: { fillColor: [44, 62, 80] }
});

doc.save("Library_Report.pdf");

};

const exportExcel = () => {

const wb = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
wb,
XLSX.utils.aoa_to_sheet([
["Library Report"],
[`Generated: ${new Date().toLocaleDateString()}`],
[],
["Total Books", "Members", "Issued", "Overdue", "Collected"],
[
books.length,
members.length,
issues.filter(i => i.status === "issued").length,
overdueIssues.length,
`Rs. ${collectedFines}`
]
]),
"Summary"
);

XLSX.utils.book_append_sheet(
wb,
XLSX.utils.json_to_sheet(
books.map(b => ({
ID: b.book_id,
Title: b.title,
Author: b.author,
Available: b.available_copies
}))
),
"Books"
);

XLSX.utils.book_append_sheet(
wb,
XLSX.utils.json_to_sheet(
members.map(m => ({
ID: m.member_id,
Name: m.name,
Email: m.email,
Type: m.member_type
}))
),
"Members"
);

XLSX.utils.book_append_sheet(
wb,
XLSX.utils.json_to_sheet(
fines.map(f => ({
ID: f.fine_id,
Member: f.name,
Amount: f.amount,
Status: f.status
}))
),
"Fines"
);

XLSX.writeFile(wb, "Library_Report.xlsx");

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

<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>

<h2 style={styles.heading}>📊 Reports & Analytics</h2>

<div style={{ display: "flex", gap: "10px" }}>
<button style={styles.pdfBtn} onClick={exportPDF}>📄 Export PDF</button>
<button style={styles.excelBtn} onClick={exportExcel}>📊 Export Excel</button>
</div>

</div>

<div style={styles.cards}>

<div style={{ ...styles.card, borderLeft: "5px solid #4A90D9" }}>
<h2 style={{ color: "#4A90D9", margin: 0 }}>{books.length}</h2>
<p style={styles.cardLabel}>📚 Total Books</p>
</div>

<div style={{ ...styles.card, borderLeft: "5px solid #5BAD72" }}>
<h2 style={{ color: "#5BAD72", margin: 0 }}>{members.length}</h2>
<p style={styles.cardLabel}>👥 Total Members</p>
</div>

<div style={{ ...styles.card, borderLeft: "5px solid #E07B54" }}>
<h2 style={{ color: "#E07B54", margin: 0 }}>{overdueIssues.length}</h2>
<p style={styles.cardLabel}>⚠️ Overdue</p>
</div>

<div style={{ ...styles.card, borderLeft: "5px solid #F0A500" }}>
<h2 style={{ color: "#F0A500", margin: 0 }}>Rs. {collectedFines}</h2>
<p style={styles.cardLabel}>💰 Collected</p>
</div>

</div>

<div style={styles.chartsRow}>

<div style={styles.chartBox}>
<h4 style={styles.chartTitle}>📚 Books Availability</h4>

<ResponsiveContainer width="100%" height={220}>
<BarChart data={booksData}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" tick={{ fontSize: 11 }} />
<YAxis tick={{ fontSize: 11 }} />
<Tooltip />
<Legend />
<Bar dataKey="Total" fill="#4A90D9" radius={[4, 4, 0, 0]} />
<Bar dataKey="Available" fill="#5BAD72" radius={[4, 4, 0, 0]} />
</BarChart>
</ResponsiveContainer>

</div>

<div style={styles.chartBox}>

<h4 style={styles.chartTitle}>👥 Members</h4>

<ResponsiveContainer width="100%" height={220}>
<PieChart>

<Pie
data={memberData}
cx="50%"
cy="50%"
outerRadius={80}
dataKey="value"
label={({ name, value }) => `${name}: ${value}`}
>

{memberData.map((entry, index) => (
<Cell key={index} fill={COLORS[index]} />
))}

</Pie>

<Tooltip />
<Legend />

</PieChart>
</ResponsiveContainer>

</div>

</div>

<div style={styles.chartBoxFull}>

<h4 style={styles.chartTitle}>🏆 Most Borrowed Books</h4>

<table style={styles.table}>

<thead>
<tr style={styles.thead}>
<th style={styles.th}>Rank</th>
<th style={styles.th}>Title</th>
<th style={styles.th}>Author</th>
<th style={styles.th}>Times Borrowed</th>
</tr>
</thead>

<tbody>

{mostBorrowed.length === 0 ? (
<tr>
<td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#999" }}>
No data!
</td>
</tr>
) : (

mostBorrowed.map((b, i) => (

<tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>

<td style={styles.td}>
{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
</td>

<td style={styles.td}><strong>{b.title}</strong></td>

<td style={styles.td}>{b.author}</td>

<td style={styles.td}>
<strong style={{ color: "#4A90D9" }}>{b.borrow_count}</strong>
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

const styles = {
container: { fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#F4F6F9" },
navbar: { backgroundColor: "#2C3E50", padding: "14px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" },
navTitle: { color: "white", margin: 0, fontSize: "20px" },
welcome: { color: "#BDC3C7", fontSize: "14px" },
logoutBtn: { padding: "7px 16px", backgroundColor: "#E74C3C", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
layout: { display: "flex" },
content: { flex: 1, padding: "25px" },
heading: { color: "#2C3E50", fontSize: "20px", fontWeight: "bold" },
cards: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "25px" },
card: { padding: "20px 25px", borderRadius: "10px", backgroundColor: "white", minWidth: "150px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
cardLabel: { color: "#666", fontSize: "13px", margin: "5px 0 0 0" },
chartsRow: { display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" },
chartBox: { flex: 1, backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", minWidth: "280px" },
chartBoxFull: { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" },
chartTitle: { color: "#2C3E50", marginBottom: "15px", fontSize: "15px" },
table: { width: "100%", borderCollapse: "collapse" },
thead: { backgroundColor: "#F4F6F9" },
th: { padding: "10px 12px", textAlign: "left", color: "#666", fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #eee" },
td: { padding: "10px 12px", fontSize: "13px", color: "#444", borderBottom: "1px solid #f0f0f0" },
pdfBtn: { padding: "9px 16px", backgroundColor: "#E74C3C", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
excelBtn: { padding: "9px 16px", backgroundColor: "#5BAD72", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
};

export default Reports;