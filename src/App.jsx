import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Component Imports
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/Sidebar";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import FileUpload from "./components/FileUpload";
import ReportPage from "./components/ReportPage";
import AnalysisPage from "./components/AnalysisPage.jsx";
import ResetPassword from "./components/ResetPassword";

/**
 * LayoutWrapper handles the conditional rendering of the Sidebar.
 * It also applies the global "Main Content" styling and breadcrumbs.
 */
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Define pages where the Sidebar SHOULD NOT appear (like the Login page)
  const isAuthPage = location.pathname === "/";

  if (isAuthPage) {
    return <div className="fade-in-section">{children}</div>;
  }

  return (
    <div className="app-layout">
      {/* 1. Fixed Sidebar */}
      <Sidebar /> 

      {/* 2. Dynamic Middle Frame Area */}
      <main className="main-content">
        
        {/* Breadcrumb Header matching your "You're here" logic */}
        <nav className="breadcrumb">
          <span className="breadcrumb-label">You're here &rsaquo;</span>
          <span className="breadcrumb-current">
            {location.pathname.replace("/", "") || "Home"}
          </span>
        </nav>
        
        {/* The Actual Page Content */}
        <div className="fade-in-section">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Default Route: Login/Signup */}
          <Route path="/" element={<AuthForm />} /> 

          {/* Application Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/analytics" element={<AnalysisPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Fallback: Redirect unknown paths to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;