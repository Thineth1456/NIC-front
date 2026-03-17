import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, FileText, LogOut } from "lucide-react";
import "./TopNavbar.css";

const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "upload", name: "File Upload", icon: <Upload size={20} /> },
    { id: "report", name: "Reports", icon: <FileText size={20} /> }
  ];

  return (
    <div className="top-navbar">

      <div className="nav-logo" onClick={() => navigate("/dashboard")}>
        My App
      </div>

      <div className="nav-menu">
        {menuItems.map((item) => {
          const isActive = location.pathname === `/${item.id}`;

          return (
            <button
              key={item.id}
              onClick={() => navigate(`/${item.id}`)}
              className={`nav-btn ${isActive ? "nav-active" : ""}`}
            >
              {item.icon}
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="nav-right">
        <button
          onClick={() => navigate("/", { replace: true })}
          className="logout-btn"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default TopNavbar;