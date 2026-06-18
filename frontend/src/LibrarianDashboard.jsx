// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import api from "./api";   


// function LibrarianDashboard() {
//   const token = localStorage.getItem("token");
//   const name = localStorage.getItem("name");
//   const navigate = useNavigate();
//   const [activePage, setActivePage] = useState("books");
//   const [books, setBooks] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [issues, setIssues] = useState([]);
//   const [fines, setFines] = useState([]);
//   const [message, setMessage] = useState("");
//   const [search, setSearch] = useState("");
//   const [bookForm, setBookForm] = useState({ title: "", author: "", isbn: "", publisher: "", year: "", category_id: 1, total_copies: 1 });
//   const [issueForm, setIssueForm] = useState({ book_id: "", member_id: "" });
//   const [returnForm, setReturnForm] = useState({ issue_id: "", book_id: "" });
//   const [payForm, setPayForm] = useState({ fine_id: "", paid_amount: "" });

//   const headers = { Authorization: `Bearer ${token}` };

//   const fetchAll = () => {
//     axios.get("http://localhost:5000/api/books", { headers }).then(res => setBooks(res.data));
//     axios.get("http://localhost:5000/api/members", { headers }).then(res => setMembers(res.data));
//     axios.get("http://localhost:5000/api/issues", { headers }).then(res => setIssues(res.data));
//     axios.get("http://localhost:5000/api/fines", { headers }).then(res => setFines(res.data));
//   };

//   useEffect(() => { fetchAll(); }, []);

//   const handleLogout = () => { localStorage.clear(); navigate("/"); };

//   const handleAddBook = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/books/add", bookForm, { headers });
//       setMessage("✅ Book added!");
//       fetchAll();
//       setBookForm({ title: "", author: "", isbn: "", publisher: "", year: "", category_id: 1, total_copies: 1 });
//     } catch { setMessage("❌ Error adding book!"); }
//   };

//   const handleIssue = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/api/issues/issue", issueForm, { headers });
//       setMessage("✅ " + res.data.message);
//       fetchAll();
//       setIssueForm({ book_id: "", member_id: "" });
//     } catch (err) { setMessage("❌ " + (err.response?.data?.message || "Error!")); }
//   };

//   const handleReturn = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/api/issues/return", returnForm, { headers });
//       setMessage("✅ " + res.data.message);
//       fetchAll();
//       setReturnForm({ issue_id: "", book_id: "" });
//     } catch { setMessage("❌ Error returning!"); }
//   };

//   const handlePayFine = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/fines/pay", payForm, { headers });
//       setMessage("✅ Fine paid!");
//       fetchAll();
//       setPayForm({ fine_id: "", paid_amount: "" });
//     } catch { setMessage("❌ Error paying fine!"); }
//   };

//   const menuItems = [
//     { id: "books", icon: "📖", label: "Books" },
//     { id: "members", icon: "👥", label: "Members" },
//     { id: "issues", icon: "📋", label: "Issue/Return" },
//     { id: "fines", icon: "💰", label: "Fines" },
//   ];

//   return (
//     <div style={styles.container}>
//       <div style={styles.navbar}>
//         <h2 style={styles.navTitle}>📚 Library Management System</h2>
//         <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//           <span style={styles.welcome}>👤 {name} (Librarian)</span>
//           <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
//         </div>
//       </div>

//       <div style={styles.layout}>
//         <div style={styles.sidebar}>
//           <div style={styles.sidebarProfile}>
//             <div style={styles.avatar}>📚</div>
//             <p style={styles.sidebarName}>{name}</p>
//             <p style={styles.sidebarRole}>Librarian</p>
//           </div>
//           {menuItems.map((item) => (
//             <button key={item.id} style={{
//               ...styles.menuBtn,
//               backgroundColor: activePage === item.id ? "rgba(255,255,255,0.15)" : "transparent",
//               borderLeft: activePage === item.id ? "4px solid #4A90D9" : "4px solid transparent",
//             }} onClick={() => { setActivePage(item.id); setMessage(""); }}>
//               {item.icon} {item.label}
//             </button>
//           ))}
//         </div>

//         <div style={styles.content}>
//           {message && (
//             <p style={{ padding: "10px", backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da", color: message.includes("✅") ? "#155724" : "#721c24", borderRadius: "6px", marginBottom: "15px" }}>
//               {message}
//             </p>
//           )}

//           {/* BOOKS */}
//           {activePage === "books" && (
//             <div>
//               <h2 style={styles.heading}>📖 Books Management</h2>
//               <div style={styles.searchRow}>
//                 <input style={styles.searchInput} placeholder="🔍 Search books..."
//                   value={search} onChange={(e) => setSearch(e.target.value)} />
//                 <button style={styles.btn} onClick={() => {
//                   axios.get(`http://localhost:5000/api/books/search?query=${search}`, { headers }).then(res => setBooks(res.data));
//                 }}>Search</button>
//                 <button style={{ ...styles.btn, backgroundColor: "#666" }} onClick={() => { setSearch(""); fetchAll(); }}>Reset</button>
//               </div>
//               <div style={styles.formBox}>
//                 <h3 style={styles.formTitle}>➕ Add New Book</h3>
//                 <form onSubmit={handleAddBook}>
//                   <div style={styles.formRow}>
//                     {[["Title *", "title", "Book Title"], ["Author *", "author", "Author"], ["ISBN", "isbn", "ISBN"], ["Publisher", "publisher", "Publisher"], ["Year", "year", "Year"], ["Copies", "total_copies", "Copies"]].map(([label, key, ph]) => (
//                       <div key={key} style={styles.formGroup}>
//                         <label style={styles.label}>{label}</label>
//                         <input style={styles.input} placeholder={ph} value={bookForm[key]}
//                           onChange={(e) => setBookForm({ ...bookForm, [key]: e.target.value })}
//                           required={label.includes("*")} />
//                       </div>
//                     ))}
//                   </div>
//                   <button style={styles.addBtn} type="submit">➕ Add Book</button>
//                 </form>
//               </div>
//               <div style={styles.tableBox}>
//                 <h3 style={styles.formTitle}>📚 All Books ({books.length})</h3>
//                 <table style={styles.table}>
//                   <thead><tr style={styles.thead}>
//                     <th style={styles.th}>ID</th><th style={styles.th}>Title</th>
//                     <th style={styles.th}>Author</th><th style={styles.th}>Available</th>
//                     <th style={styles.th}>Status</th>
//                   </tr></thead>
//                   <tbody>
//                     {books.map((b, i) => (
//                       <tr key={b.book_id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
//                         <td style={styles.td}>{b.book_id}</td>
//                         <td style={styles.td}><strong>{b.title}</strong></td>
//                         <td style={styles.td}>{b.author}</td>
//                         <td style={styles.td}>{b.available_copies}</td>
//                         <td style={styles.td}>
//                           <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: b.available_copies > 0 ? "#d4edda" : "#f8d7da", color: b.available_copies > 0 ? "#155724" : "#721c24" }}>
//                             {b.available_copies > 0 ? "Available" : "Not Available"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* MEMBERS */}
//           {activePage === "members" && (
//             <div>
//               <h2 style={styles.heading}>👥 Members</h2>
//               <div style={styles.tableBox}>
//                 <h3 style={styles.formTitle}>👥 All Members ({members.length})</h3>
//                 <table style={styles.table}>
//                   <thead><tr style={styles.thead}>
//                     <th style={styles.th}>ID</th><th style={styles.th}>Name</th>
//                     <th style={styles.th}>Email</th><th style={styles.th}>Type</th>
//                     <th style={styles.th}>Status</th>
//                   </tr></thead>
//                   <tbody>
//                     {members.map((m, i) => (
//                       <tr key={m.member_id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
//                         <td style={styles.td}>{m.member_id}</td>
//                         <td style={styles.td}><strong>{m.name}</strong></td>
//                         <td style={styles.td}>{m.email}</td>
//                         <td style={styles.td}>{m.member_type}</td>
//                         <td style={styles.td}>
//                           <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: m.status === "active" ? "#d4edda" : "#f8d7da", color: m.status === "active" ? "#155724" : "#721c24" }}>
//                             {m.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* ISSUE/RETURN */}
//           {activePage === "issues" && (
//             <div>
//               <h2 style={styles.heading}>📋 Issue & Return</h2>
//               <div style={styles.formsRow}>
//                 <div style={styles.formBox}>
//                   <h3 style={styles.formTitle}>📤 Issue Book</h3>
//                   <form onSubmit={handleIssue}>
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Book ID *</label>
//                       <input style={styles.input} placeholder="Book ID" value={issueForm.book_id}
//                         onChange={(e) => setIssueForm({ ...issueForm, book_id: e.target.value })} required />
//                     </div>
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Member ID *</label>
//                       <input style={styles.input} placeholder="Member ID" value={issueForm.member_id}
//                         onChange={(e) => setIssueForm({ ...issueForm, member_id: e.target.value })} required />
//                     </div>
//                     <button style={styles.issueBtn} type="submit">📤 Issue Book</button>
//                   </form>
//                 </div>
//                 <div style={styles.formBox}>
//                   <h3 style={styles.formTitle}>📥 Return Book</h3>
//                   <form onSubmit={handleReturn}>
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Issue ID *</label>
//                       <input style={styles.input} placeholder="Issue ID" value={returnForm.issue_id}
//                         onChange={(e) => setReturnForm({ ...returnForm, issue_id: e.target.value })} required />
//                     </div>
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Book ID *</label>
//                       <input style={styles.input} placeholder="Book ID" value={returnForm.book_id}
//                         onChange={(e) => setReturnForm({ ...returnForm, book_id: e.target.value })} required />
//                     </div>
//                     <button style={styles.returnBtn} type="submit">📥 Return Book</button>
//                   </form>
//                 </div>
//               </div>
//               <div style={styles.tableBox}>
//                 <h3 style={styles.formTitle}>📋 All Issues ({issues.length})</h3>
//                 <table style={styles.table}>
//                   <thead><tr style={styles.thead}>
//                     <th style={styles.th}>Issue ID</th><th style={styles.th}>Book</th>
//                     <th style={styles.th}>Member</th><th style={styles.th}>Due Date</th>
//                     <th style={styles.th}>Status</th>
//                   </tr></thead>
//                   <tbody>
//                     {issues.map((i, idx) => (
//                       <tr key={i.issue_id} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
//                         <td style={styles.td}>{i.issue_id}</td>
//                         <td style={styles.td}><strong>{i.title}</strong></td>
//                         <td style={styles.td}>{i.name}</td>
//                         <td style={styles.td}>{i.due_date?.split("T")[0]}</td>
//                         <td style={styles.td}>
//                           <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: i.status === "issued" ? "#fff3cd" : "#d4edda", color: i.status === "issued" ? "#856404" : "#155724" }}>
//                             {i.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* FINES */}
//           {activePage === "fines" && (
//             <div>
//               <h2 style={styles.heading}>💰 Fines</h2>
//               <div style={styles.formBox}>
//                 <h3 style={styles.formTitle}>💳 Pay Fine</h3>
//                 <form onSubmit={handlePayFine} style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "flex-end" }}>
//                   <div style={styles.formGroup}>
//                     <label style={styles.label}>Fine ID *</label>
//                     <input style={styles.input} placeholder="Fine ID" value={payForm.fine_id}
//                       onChange={(e) => setPayForm({ ...payForm, fine_id: e.target.value })} required />
//                   </div>
//                   <div style={styles.formGroup}>
//                     <label style={styles.label}>Amount *</label>
//                     <input style={styles.input} placeholder="Amount" type="number" value={payForm.paid_amount}
//                       onChange={(e) => setPayForm({ ...payForm, paid_amount: e.target.value })} required />
//                   </div>
//                   <button style={styles.addBtn} type="submit">💳 Pay Fine</button>
//                 </form>
//               </div>
//               <div style={styles.tableBox}>
//                 <h3 style={styles.formTitle}>💰 All Fines ({fines.length})</h3>
//                 <table style={styles.table}>
//                   <thead><tr style={styles.thead}>
//                     <th style={styles.th}>Fine ID</th><th style={styles.th}>Member</th>
//                     <th style={styles.th}>Amount</th><th style={styles.th}>Status</th>
//                   </tr></thead>
//                   <tbody>
//                     {fines.map((f, i) => (
//                       <tr key={f.fine_id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
//                         <td style={styles.td}>{f.fine_id}</td>
//                         <td style={styles.td}>{f.name}</td>
//                         <td style={styles.td}>Rs. {f.amount}</td>
//                         <td style={styles.td}>
//                           <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: f.status === "paid" ? "#d4edda" : "#fff3cd", color: f.status === "paid" ? "#155724" : "#856404" }}>
//                             {f.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: { fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#F4F6F9" },
//   navbar: { backgroundColor: "#2C3E50", padding: "14px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" },
//   navTitle: { color: "white", margin: 0, fontSize: "20px" },
//   welcome: { color: "#BDC3C7", fontSize: "14px" },
//   logoutBtn: { padding: "7px 16px", backgroundColor: "#E74C3C", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
//   layout: { display: "flex" },
//   sidebar: { width: "220px", backgroundColor: "#2C3E50", minHeight: "calc(100vh - 52px)", padding: "0", display: "flex", flexDirection: "column" },
//   sidebarProfile: { padding: "20px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)" },
//   avatar: { fontSize: "40px", marginBottom: "8px" },
//   sidebarName: { color: "white", margin: "0 0 4px 0", fontSize: "14px", fontWeight: "bold" },
//   sidebarRole: { color: "#4A90D9", margin: 0, fontSize: "12px", backgroundColor: "rgba(74,144,217,0.2)", padding: "2px 10px", borderRadius: "10px", display: "inline-block" },
//   menuBtn: { padding: "13px 20px", color: "#BDC3C7", border: "none", textAlign: "left", fontSize: "14px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" },
//   content: { flex: 1, padding: "25px" },
//   heading: { color: "#2C3E50", marginBottom: "20px" },
//   searchRow: { display: "flex", gap: "10px", marginBottom: "20px" },
//   searchInput: { padding: "9px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", width: "300px" },
//   formBox: { backgroundColor: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
//   formTitle: { color: "#2C3E50", marginBottom: "15px" },
//   formRow: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "15px" },
//   formGroup: { display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" },
//   label: { fontSize: "12px", color: "#666", fontWeight: "600" },
//   input: { padding: "9px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", width: "170px" },
//   btn: { padding: "9px 16px", backgroundColor: "#2C3E50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
//   addBtn: { padding: "10px 25px", backgroundColor: "#4A90D9", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
//   issueBtn: { width: "100%", padding: "10px", backgroundColor: "#4A90D9", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
//   returnBtn: { width: "100%", padding: "10px", backgroundColor: "#5BAD72", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
//   formsRow: { display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" },
//   tableBox: { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" },
//   table: { width: "100%", borderCollapse: "collapse" },
//   thead: { backgroundColor: "#F4F6F9" },
//   th: { padding: "10px 12px", textAlign: "left", color: "#666", fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #eee" },
//   td: { padding: "10px 12px", fontSize: "13px", color: "#444", borderBottom: "1px solid #f0f0f0" },
// };

// export default LibrarianDashboard;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "./api";   


function LibrarianDashboard() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("books");
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [fines, setFines] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [bookForm, setBookForm] = useState({ title: "", author: "", isbn: "", publisher: "", year: "", category_id: 1, total_copies: 1 });
  const [issueForm, setIssueForm] = useState({ book_id: "", member_id: "" });
  const [returnForm, setReturnForm] = useState({ issue_id: "", book_id: "" });
  const [payForm, setPayForm] = useState({ fine_id: "", paid_amount: "" });

  const headers = { Authorization: `Bearer ${token}` };

  // Helper: backend kabhi array directly bhejta hai, kabhi { data: [...] } ya { members: [...] }
  // jaisa object bhejta hai. Ye function har case me safely array nikal leta hai,
  // taaki .map() kabhi crash na ho (members.map is not a function wali error fix).
  const extractArray = (resData, key) => {
    if (Array.isArray(resData)) return resData;
    if (resData && Array.isArray(resData[key])) return resData[key];
    if (resData && Array.isArray(resData.data)) return resData.data;
    return [];
  };

  const fetchAll = () => {
    axios.get("http://localhost:5000/api/books", { headers })
      .then(res => setBooks(extractArray(res.data, "books")))
      .catch(err => { console.error("Books fetch error:", err.response?.data || err.message); setBooks([]); });

    axios.get("http://localhost:5000/api/members", { headers })
      .then(res => setMembers(extractArray(res.data, "members")))
      .catch(err => { console.error("Members fetch error:", err.response?.data || err.message); setMembers([]); });

    axios.get("http://localhost:5000/api/issues", { headers })
      .then(res => setIssues(extractArray(res.data, "issues")))
      .catch(err => { console.error("Issues fetch error:", err.response?.data || err.message); setIssues([]); });

    axios.get("http://localhost:5000/api/fines", { headers })
      .then(res => setFines(extractArray(res.data, "fines")))
      .catch(err => { console.error("Fines fetch error:", err.response?.data || err.message); setFines([]); });
  };

  useEffect(() => { fetchAll(); }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/books/add", bookForm, { headers });
      setMessage("✅ Book added!");
      fetchAll();
      setBookForm({ title: "", author: "", isbn: "", publisher: "", year: "", category_id: 1, total_copies: 1 });
    } catch { setMessage("❌ Error adding book!"); }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/issues/issue", issueForm, { headers });
      setMessage("✅ " + res.data.message);
      fetchAll();
      setIssueForm({ book_id: "", member_id: "" });
    } catch (err) { setMessage("❌ " + (err.response?.data?.message || "Error!")); }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/issues/return", returnForm, { headers });
      setMessage("✅ " + res.data.message);
      fetchAll();
      setReturnForm({ issue_id: "", book_id: "" });
    } catch { setMessage("❌ Error returning!"); }
  };

  const handlePayFine = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/fines/pay", payForm, { headers });
      setMessage("✅ Fine paid!");
      fetchAll();
      setPayForm({ fine_id: "", paid_amount: "" });
    } catch { setMessage("❌ Error paying fine!"); }
  };

  const menuItems = [
    { id: "books", icon: "📖", label: "Books" },
    { id: "members", icon: "👥", label: "Members" },
    { id: "issues", icon: "📋", label: "Issue/Return" },
    { id: "fines", icon: "💰", label: "Fines" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>📚 Library Management System</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={styles.welcome}>👤 {name} (Librarian)</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <div style={styles.sidebarProfile}>
            <div style={styles.avatar}>📚</div>
            <p style={styles.sidebarName}>{name}</p>
            <p style={styles.sidebarRole}>Librarian</p>
          </div>
          {menuItems.map((item) => (
            <button key={item.id} style={{
              ...styles.menuBtn,
              backgroundColor: activePage === item.id ? "rgba(255,255,255,0.15)" : "transparent",
              borderLeft: activePage === item.id ? "4px solid #4A90D9" : "4px solid transparent",
            }} onClick={() => { setActivePage(item.id); setMessage(""); }}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div style={styles.content}>
          {message && (
            <p style={{ padding: "10px", backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da", color: message.includes("✅") ? "#155724" : "#721c24", borderRadius: "6px", marginBottom: "15px" }}>
              {message}
            </p>
          )}

          {/* BOOKS */}
          {activePage === "books" && (
            <div>
              <h2 style={styles.heading}>📖 Books Management</h2>
              <div style={styles.searchRow}>
                <input style={styles.searchInput} placeholder="🔍 Search books..."
                  value={search} onChange={(e) => setSearch(e.target.value)} />
                <button style={styles.btn} onClick={() => {
                  axios.get(`http://localhost:5000/api/books/search?query=${search}`, { headers })
                    .then(res => setBooks(extractArray(res.data, "books")))
                    .catch(err => { console.error("Search error:", err.response?.data || err.message); setBooks([]); });
                }}>Search</button>
                <button style={{ ...styles.btn, backgroundColor: "#666" }} onClick={() => { setSearch(""); fetchAll(); }}>Reset</button>
              </div>
              <div style={styles.formBox}>
                <h3 style={styles.formTitle}>➕ Add New Book</h3>
                <form onSubmit={handleAddBook}>
                  <div style={styles.formRow}>
                    {[["Title *", "title", "Book Title"], ["Author *", "author", "Author"], ["ISBN", "isbn", "ISBN"], ["Publisher", "publisher", "Publisher"], ["Year", "year", "Year"], ["Copies", "total_copies", "Copies"]].map(([label, key, ph]) => (
                      <div key={key} style={styles.formGroup}>
                        <label style={styles.label}>{label}</label>
                        <input style={styles.input} placeholder={ph} value={bookForm[key]}
                          onChange={(e) => setBookForm({ ...bookForm, [key]: e.target.value })}
                          required={label.includes("*")} />
                      </div>
                    ))}
                  </div>
                  <button style={styles.addBtn} type="submit">➕ Add Book</button>
                </form>
              </div>
              <div style={styles.tableBox}>
                <h3 style={styles.formTitle}>📚 All Books ({books.length})</h3>
                <table style={styles.table}>
                  <thead><tr style={styles.thead}>
                    <th style={styles.th}>ID</th><th style={styles.th}>Title</th>
                    <th style={styles.th}>Author</th><th style={styles.th}>Available</th>
                    <th style={styles.th}>Status</th>
                  </tr></thead>
                  <tbody>
                    {books.map((b, i) => (
                      <tr key={b.book_id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                        <td style={styles.td}>{b.book_id}</td>
                        <td style={styles.td}><strong>{b.title}</strong></td>
                        <td style={styles.td}>{b.author}</td>
                        <td style={styles.td}>{b.available_copies}</td>
                        <td style={styles.td}>
                          <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: b.available_copies > 0 ? "#d4edda" : "#f8d7da", color: b.available_copies > 0 ? "#155724" : "#721c24" }}>
                            {b.available_copies > 0 ? "Available" : "Not Available"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MEMBERS */}
          {activePage === "members" && (
            <div>
              <h2 style={styles.heading}>👥 Members</h2>
              <div style={styles.tableBox}>
                <h3 style={styles.formTitle}>👥 All Members ({members.length})</h3>
                <table style={styles.table}>
                  <thead><tr style={styles.thead}>
                    <th style={styles.th}>ID</th><th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th><th style={styles.th}>Type</th>
                    <th style={styles.th}>Status</th>
                  </tr></thead>
                  <tbody>
                    {members.map((m, i) => (
                      <tr key={m.member_id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                        <td style={styles.td}>{m.member_id}</td>
                        <td style={styles.td}><strong>{m.name}</strong></td>
                        <td style={styles.td}>{m.email}</td>
                        <td style={styles.td}>{m.member_type}</td>
                        <td style={styles.td}>
                          <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: m.status === "active" ? "#d4edda" : "#f8d7da", color: m.status === "active" ? "#155724" : "#721c24" }}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ISSUE/RETURN */}
          {activePage === "issues" && (
            <div>
              <h2 style={styles.heading}>📋 Issue & Return</h2>
              <div style={styles.formsRow}>
                <div style={styles.formBox}>
                  <h3 style={styles.formTitle}>📤 Issue Book</h3>
                  <form onSubmit={handleIssue}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Book ID *</label>
                      <input style={styles.input} placeholder="Book ID" value={issueForm.book_id}
                        onChange={(e) => setIssueForm({ ...issueForm, book_id: e.target.value })} required />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Member ID *</label>
                      <input style={styles.input} placeholder="Member ID" value={issueForm.member_id}
                        onChange={(e) => setIssueForm({ ...issueForm, member_id: e.target.value })} required />
                    </div>
                    <button style={styles.issueBtn} type="submit">📤 Issue Book</button>
                  </form>
                </div>
                <div style={styles.formBox}>
                  <h3 style={styles.formTitle}>📥 Return Book</h3>
                  <form onSubmit={handleReturn}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Issue ID *</label>
                      <input style={styles.input} placeholder="Issue ID" value={returnForm.issue_id}
                        onChange={(e) => setReturnForm({ ...returnForm, issue_id: e.target.value })} required />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Book ID *</label>
                      <input style={styles.input} placeholder="Book ID" value={returnForm.book_id}
                        onChange={(e) => setReturnForm({ ...returnForm, book_id: e.target.value })} required />
                    </div>
                    <button style={styles.returnBtn} type="submit">📥 Return Book</button>
                  </form>
                </div>
              </div>
              <div style={styles.tableBox}>
                <h3 style={styles.formTitle}>📋 All Issues ({issues.length})</h3>
                <table style={styles.table}>
                  <thead><tr style={styles.thead}>
                    <th style={styles.th}>Issue ID</th><th style={styles.th}>Book</th>
                    <th style={styles.th}>Member</th><th style={styles.th}>Due Date</th>
                    <th style={styles.th}>Status</th>
                  </tr></thead>
                  <tbody>
                    {issues.map((i, idx) => (
                      <tr key={i.issue_id} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                        <td style={styles.td}>{i.issue_id}</td>
                        <td style={styles.td}><strong>{i.title}</strong></td>
                        <td style={styles.td}>{i.name}</td>
                        <td style={styles.td}>{i.due_date?.split("T")[0]}</td>
                        <td style={styles.td}>
                          <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: i.status === "issued" ? "#fff3cd" : "#d4edda", color: i.status === "issued" ? "#856404" : "#155724" }}>
                            {i.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FINES */}
          {activePage === "fines" && (
            <div>
              <h2 style={styles.heading}>💰 Fines</h2>
              <div style={styles.formBox}>
                <h3 style={styles.formTitle}>💳 Pay Fine</h3>
                <form onSubmit={handlePayFine} style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Fine ID *</label>
                    <input style={styles.input} placeholder="Fine ID" value={payForm.fine_id}
                      onChange={(e) => setPayForm({ ...payForm, fine_id: e.target.value })} required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Amount *</label>
                    <input style={styles.input} placeholder="Amount" type="number" value={payForm.paid_amount}
                      onChange={(e) => setPayForm({ ...payForm, paid_amount: e.target.value })} required />
                  </div>
                  <button style={styles.addBtn} type="submit">💳 Pay Fine</button>
                </form>
              </div>
              <div style={styles.tableBox}>
                <h3 style={styles.formTitle}>💰 All Fines ({fines.length})</h3>
                <table style={styles.table}>
                  <thead><tr style={styles.thead}>
                    <th style={styles.th}>Fine ID</th><th style={styles.th}>Member</th>
                    <th style={styles.th}>Amount</th><th style={styles.th}>Status</th>
                  </tr></thead>
                  <tbody>
                    {fines.map((f, i) => (
                      <tr key={f.fine_id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                        <td style={styles.td}>{f.fine_id}</td>
                        <td style={styles.td}>{f.name}</td>
                        <td style={styles.td}>Rs. {f.amount}</td>
                        <td style={styles.td}>
                          <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", backgroundColor: f.status === "paid" ? "#d4edda" : "#fff3cd", color: f.status === "paid" ? "#155724" : "#856404" }}>
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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
  searchRow: { display: "flex", gap: "10px", marginBottom: "20px" },
  searchInput: { padding: "9px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", width: "300px" },
  formBox: { backgroundColor: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  formTitle: { color: "#2C3E50", marginBottom: "15px" },
  formRow: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "15px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" },
  label: { fontSize: "12px", color: "#666", fontWeight: "600" },
  input: { padding: "9px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", width: "170px" },
  btn: { padding: "9px 16px", backgroundColor: "#2C3E50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  addBtn: { padding: "10px 25px", backgroundColor: "#4A90D9", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  issueBtn: { width: "100%", padding: "10px", backgroundColor: "#4A90D9", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  returnBtn: { width: "100%", padding: "10px", backgroundColor: "#5BAD72", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  formsRow: { display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" },
  tableBox: { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#F4F6F9" },
  th: { padding: "10px 12px", textAlign: "left", color: "#666", fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #eee" },
  td: { padding: "10px 12px", fontSize: "13px", color: "#444", borderBottom: "1px solid #f0f0f0" },
};

export default LibrarianDashboard;