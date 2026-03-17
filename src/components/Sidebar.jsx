import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Upload, FileText, Users, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';


const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20}/> },
    { id: 'upload', name: 'File Upload', icon: <Upload size={20}/> },
    { id: 'report', name: 'Reports', icon: <FileText size={20}/> },
   // { id: 'employees', name: 'Employees', icon: <Users size={20}/> },
   // { id: 'settings', name: 'Settings', icon: <Settings size={20}/> }
  ];

  return (
    <div className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-diamond">
          <div className="logo-inner"></div>
        </div>
       
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {

          const isActive = location.pathname === `/${item.id}`;

          return (
            <button
              key={item.id}
              onClick={() => navigate(`/${item.id}`)}
              className={`sidebar-btn ${isActive ? "sidebar-active" : ""}`}
            >
              {item.icon}
              {item.name}
            </button>
          );

        })}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={() => navigate('/')}
          className="logout-btn"
        >
          <LogOut size={20}/>
          Logout
        </button>
      </div>

    </div>
  );

};

export default Sidebar;


