import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./ReportPage.css";


const ReportPage = () => {
  const location = useLocation();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // filter states
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showFileSearch, setShowFileSearch] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fileName, setFileName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (location.state?.data) {
      setReportData(location.state.data);
    } else {
      fetchAllRecords();
    }
  }, [location.state]);

  const fetchAllRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/data-service/all-records");
      const result = await response.json();
      setReportData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    } finally {
      setLoading(false);
    }
  };

  // fetch by date range
  const fetchByDateRange = async () => {
    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8081/data-service/report-by-date?start=${startDate}&end=${endDate}`
      );
      const result = await response.json();
      setReportData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch by file name
  const fetchByFileName = async () => {
    if (!fileName) {
      alert("Enter a file name");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8081/data-service/report-by-file?filename=${fileName}`
      );
      const result = await response.json();
      setReportData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = reportData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(reportData.length / rowsPerPage);

  // ===== CSV EXPORT =====
  const exportCSV = () => {
    if (!reportData.length) return;
    const headers = ["NIC Number", "Gender", "Birthday", "Source Filename"];
    const rows = reportData.map(row => [
      row.nic,
      row.gender,
      row.birthday,
      row.filename
    ]);
    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ===== PDF EXPORT =====
  const exportPDF = () => {
  if (!reportData.length) return;
  
  const doc = new jsPDF();
  doc.text("NIC Analysis Report", 14, 20);

  const tableColumn = ["NIC Number", "Gender", "Birthday", "Source Filename"];
  const tableRows = reportData.map(row => [
    row.nic,
    row.gender,
    row.birthday,
    row.filename
  ]);

  // CHANGE THIS: Call autoTable(doc, options) instead of doc.autoTable(options)
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] } // Professional blue header
  });

  doc.save("report.pdf");
};

  return (
    <div className="report-container" style={{ padding: "20px" }}>
      <h2>NIC Analysis Report</h2>

      {/* TOP RIGHT BUTTONS */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <button
          onClick={() => {
            setShowDateFilter(!showDateFilter);
            setShowFileSearch(false);
          }}
          style={{ marginRight: "10px" }}
        >
          Details by Date Range
        </button>

        <button
          onClick={() => {
            setShowFileSearch(!showFileSearch);
            setShowDateFilter(false);
          }}
        >
          Search by File Name
        </button>
      </div>

      {/* CSV & PDF EXPORT BUTTONS */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={exportCSV} style={{ marginRight: "10px" }}>Export CSV</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>

      {/* DATE RANGE FILTER */}
      {showDateFilter && (
        <div style={{ marginBottom: "20px" }}>
          <label>Start Date: </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label style={{ marginLeft: "10px" }}>End Date: </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button onClick={fetchByDateRange} style={{ marginLeft: "10px" }}>Search</button>
        </div>
      )}

      {/* FILE NAME SEARCH */}
      {showFileSearch && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />

          <button onClick={fetchByFileName} style={{ marginLeft: "10px" }}>Search</button>
        </div>
      )}

      {loading ? (
        <p>Loading records...</p>
      ) : reportData.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table className="report-table" border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ padding: "10px" }}>NIC Number</th>
              <th style={{ padding: "10px" }}>Gender</th>
              <th style={{ padding: "10px" }}>Birthday</th>
              <th style={{ padding: "10px" }}>Source Filename</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row, index) => (
              <tr key={row.id || index}>
                <td style={{ padding: "10px" }}>{row.nic}</td>
                <td style={{ padding: "10px" }}>{row.gender}</td>
                <td style={{ padding: "10px" }}>{formatDate(row.birthday)}</td>
                <td style={{ padding: "10px" }}>{row.filename}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ marginRight: "10px" }}>Previous</button>

        <span>Page {currentPage} of {totalPages}</span>

        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} style={{ marginLeft: "10px" }}>Next</button>
      </div>
    </div>
  );
};

export default ReportPage;