import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { API_URL } from "./config";
// import api from "./api";   // ✅ USE THIS ONLY

function Books() {

const name = localStorage.getItem("name");

const [books,setBooks] = useState([]);
const [search,setSearch] = useState("");
const [message,setMessage] = useState("");

const [form,setForm] = useState({
title:"",author:"",isbn:"",
publisher:"",year:"",
category_id:1,total_copies:1
});

/* ================= FIX 1 ================= */
const fetchBooks = () =>{
api.get("/api/books")
.then(res=>{
const data = res.data.books || res.data || [];
setBooks(Array.isArray(data)?data:[]);
})
.catch(err=>console.log(err));
};

useEffect(()=>{fetchBooks()},[]);

/* ================= FIX 2 ================= */
const handleAdd = async(e)=>{
e.preventDefault();

try{
await api.post("/api/books/add",form);  // ✅ FIXED
setMessage("✅ Book added successfully!");
fetchBooks();

setForm({
title:"",author:"",isbn:"",
publisher:"",year:"",
category_id:1,total_copies:1
});

}catch(err){
setMessage("❌ Error adding book!");
}
};

/* ================= FIX 3 ================= */
const handleDelete = async(id)=>{
if(window.confirm("Are you sure?")){
try{
await api.delete(`/api/books/${id}`);  // ✅ FIXED
fetchBooks();
}catch(err){
console.log(err);
}
}
};

/* ================= FIX 4 ================= */
const handleSearch = async()=>{
if(!search){
fetchBooks();
return;
}

try{
const res = await api.get(`/api/books/search?query=${search}`); // ✅ FIXED
const data = res.data.books || res.data || [];
setBooks(Array.isArray(data)?data:[]);
}catch(err){
console.log(err);
}
};

return(
<div style={styles.container}>

<div style={styles.navbar}>
<h2 style={styles.navTitle}>📚 Library Management System</h2>

<div style={{display:"flex",alignItems:"center",gap:"15px"}}>
<span style={styles.welcome}>👤 {name}</span>

<button style={styles.logoutBtn}
onClick={()=>{localStorage.clear();window.location.href="/";}}>
Logout
</button>

</div>
</div>

<div style={styles.layout}>

<Sidebar/>

<div style={styles.content}>

<h2 style={styles.heading}>📖 Books Management</h2>

{message && (
<p style={{
padding:"10px",
backgroundColor:message.includes("✅")?"#d4edda":"#f8d7da",
color:message.includes("✅")?"#155724":"#721c24",
borderRadius:"6px",
marginBottom:"15px"
}}>
{message}
</p>
)}

<div style={styles.searchRow}>
<input
style={styles.searchInput}
placeholder="🔍 Search by title, author, ISBN..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
onKeyPress={(e)=>e.key==="Enter" && handleSearch()}
/>

<button style={styles.btn} onClick={handleSearch}>Search</button>

<button style={{...styles.btn,backgroundColor:"#666"}}
onClick={()=>{setSearch("");fetchBooks();}}>
Reset
</button>
</div>

{/* FORM SAME */}
<div style={styles.formBox}>
<h3 style={styles.formTitle}>➕ Add New Book</h3>

<form onSubmit={handleAdd}>
<div style={styles.formRow}>

{[
["Title *","title","Book Title"],
["Author *","author","Author Name"],
["ISBN","isbn","ISBN"],
["Publisher","publisher","Publisher"],
["Year","year","Year"],
["Total Copies","total_copies","Copies"]
].map(([label,key,ph])=>(
<div key={key} style={styles.formGroup}>
<label style={styles.label}>{label}</label>

<input
style={styles.input}
placeholder={ph}
value={form[key]}
required={label.includes("*")}
type={key==="total_copies"?"number":"text"}
onChange={(e)=>setForm({...form,[key]:e.target.value})}
/>

</div>
))}

</div>

<button style={styles.addBtn} type="submit">➕ Add Book</button>
</form>
</div>

{/* TABLE SAME (NO CHANGE) */}
<div style={styles.tableBox}>
<h3 style={styles.formTitle}>📚 All Books ({books.length})</h3>

<table style={styles.table}>
<thead>
<tr style={styles.thead}>
<th style={styles.th}>ID</th>
<th style={styles.th}>Title</th>
<th style={styles.th}>Author</th>
<th style={styles.th}>ISBN</th>
<th style={styles.th}>Publisher</th>
<th style={styles.th}>Year</th>
<th style={styles.th}>Total</th>
<th style={styles.th}>Available</th>
<th style={styles.th}>Status</th>
<th style={styles.th}>Action</th>
</tr>
</thead>

<tbody>

{books.length===0 ?
<tr>
<td colSpan="10" style={{textAlign:"center",padding:"20px",color:"#999"}}>
No books found!
</td>
</tr>
:
(Array.isArray(books)?books:[]).map((b,i)=>(
<tr key={b.book_id} style={{backgroundColor:i%2===0?"#f9f9f9":"white"}}>

<td style={styles.td}>{b.book_id}</td>
<td style={styles.td}><strong>{b.title}</strong></td>
<td style={styles.td}>{b.author}</td>
<td style={styles.td}>{b.isbn}</td>
<td style={styles.td}>{b.publisher}</td>
<td style={styles.td}>{b.year}</td>
<td style={styles.td}>{b.total_copies}</td>
<td style={styles.td}>{b.available_copies}</td>

<td style={styles.td}>
<span style={{
padding:"3px 10px",
borderRadius:"12px",
fontSize:"12px",
backgroundColor:b.available_copies>0?"#d4edda":"#f8d7da",
color:b.available_copies>0?"#155724":"#721c24"
}}>
{b.available_copies>0?"Available":"Not Available"}
</span>
</td>

<td style={styles.td}>
<button style={styles.deleteBtn}
onClick={()=>handleDelete(b.book_id)}>
🗑️ Delete
</button>
</td>

</tr>
))
}

</tbody>
</table>

</div>

</div>
</div>
</div>
);
}

const styles = {
container:{fontFamily:"Arial",minHeight:"100vh",background:"#F4F6F9"},
navbar:{background:"#2C3E50",padding:"14px 30px",display:"flex",justifyContent:"space-between",alignItems:"center"},
navTitle:{color:"white",margin:0,fontSize:"20px"},
welcome:{color:"#BDC3C7",fontSize:"14px"},
logoutBtn:{padding:"7px 16px",background:"#E74C3C",color:"white",border:"none",borderRadius:"6px",cursor:"pointer"},
layout:{display:"flex"},
content:{flex:1,padding:"25px"},
heading:{color:"#2C3E50",marginBottom:"20px"},
searchRow:{display:"flex",gap:"10px",marginBottom:"20px"},
searchInput:{padding:"9px 12px",borderRadius:"6px",border:"1px solid #ddd",width:"300px"},
formBox:{background:"white",padding:"20px",borderRadius:"10px",marginBottom:"20px",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"},
formTitle:{color:"#2C3E50",marginBottom:"15px"},
formRow:{display:"flex",gap:"15px",flexWrap:"wrap",marginBottom:"15px"},
formGroup:{display:"flex",flexDirection:"column",gap:"5px"},
label:{fontSize:"12px",color:"#666",fontWeight:"600"},
input:{padding:"9px 12px",borderRadius:"6px",border:"1px solid #ddd",width:"170px"},
btn:{padding:"9px 16px",background:"#2C3E50",color:"white",border:"none",borderRadius:"6px",cursor:"pointer"},
addBtn:{padding:"10px 25px",background:"#4A90D9",color:"white",border:"none",borderRadius:"6px",cursor:"pointer"},
tableBox:{background:"white",padding:"20px",borderRadius:"10px",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",overflowX:"auto"},
table:{width:"100%",borderCollapse:"collapse"},
thead:{background:"#F4F6F9"},
th:{padding:"10px 12px",textAlign:"left",color:"#666",fontSize:"13px",borderBottom:"2px solid #eee"},
td:{padding:"10px 12px",fontSize:"13px",color:"#444",borderBottom:"1px solid #f0f0f0"},
deleteBtn:{padding:"5px 10px",background:"#E74C3C",color:"white",border:"none",borderRadius:"5px",cursor:"pointer"},
lostBtn:{padding:"5px 10px",background:"#F0A500",color:"white",border:"none",borderRadius:"5px",cursor:"pointer"}
};

export default Books;