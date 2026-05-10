import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: "🏠", label: "Dashboard" },
    { path: "/books", icon: "📖", label: "Books" },
    { path: "/members", icon: "👥", label: "Members" },
    { path: "/issues", icon: "📋", label: "Issue/Return" },
    { path: "/fines", icon: "💰", label: "Fines" },
    { path: "/reports", icon: "📊", label: "Reports" },
  ];

  return (
    <div style={styles.sidebar}>
      {menuItems.map((item) => (
        <button
          key={item.path}
          style={{
            ...styles.menuBtn,
            backgroundColor: location.pathname === item.path ? "rgba(255,255,255,0.15)" : "transparent",
            borderLeft: location.pathname === item.path ? "4px solid white" : "4px solid transparent",
          }}
          onClick={() => navigate(item.path)}
        >
          {item.icon} {item.label}
        </button>
      ))}
    </div>
  );
}

const styles = {
  sidebar: { width: "210px", backgroundColor: "#2C3E50", minHeight: "calc(100vh - 52px)", padding: "15px 0", display: "flex", flexDirection: "column" },
  menuBtn: { padding: "13px 20px", color: "#BDC3C7", border: "none", textAlign: "left", fontSize: "14px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" },
};

export default Sidebar;