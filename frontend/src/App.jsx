import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Books from "./Books";
import Members from "./Members";
import Issues from "./Issues";
import Fines from "./Fines";
import Reports from "./Reports";
import StudentDashboard from "./StudentDashboard";
import LibrarianDashboard from "./LibrarianDashboard";

function AutoLogout() {
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.clear();
        window.location.href = "/";
        alert("Session expired! Please login again.");
      }, 30 * 60 * 1000);
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    resetTimer();
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
    };
  }, []);
  return null;
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <AutoLogout />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/books" element={<PrivateRoute><Books /></PrivateRoute>} />
        <Route path="/members" element={<PrivateRoute><Members /></PrivateRoute>} />
        <Route path="/issues" element={<PrivateRoute><Issues /></PrivateRoute>} />
        <Route path="/fines" element={<PrivateRoute><Fines /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/student" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
        <Route path="/librarian" element={<PrivateRoute><LibrarianDashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;