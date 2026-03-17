import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FileUpload.css";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [invalidData, setInvalidData] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validate CSV files only
    const csvFiles = selectedFiles.filter(file =>
      file.name.toLowerCase().endsWith(".csv")
    );

    if (csvFiles.length !== selectedFiles.length) {
      alert("Only CSV files are allowed.");
    }

    setFiles(csvFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one CSV file!");
      return;
    }

    const loggedUserEmail = localStorage.getItem("email");

    // 1️⃣ Get userId from backend
    let userId;
    try {
      const response = await fetch("http://localhost:8082/auth-service/getUserId", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: loggedUserEmail
      });

      if (!response.ok) throw new Error("Failed to get user ID");
      userId = await response.text();
    } catch (err) {
      console.error("Failed to get userId:", err);
      alert("Could not identify logged-in user. Please try again.");
      return;
    }

    // 2️⃣ Prepare FormData
    const formData = new FormData();
    files.forEach(file => formData.append("file", file));
    formData.append("userId", userId);

    // 3️⃣ Upload files to backend
    try {
      const uploadResponse = await fetch("http://localhost:8081/data-service/upload-files", {
        method: "POST",
        body: formData
      });

      if (!uploadResponse.ok) {
        // Response is not OK → throw error
        throw new Error("Upload failed");
      } else {
        // Response is OK → parse JSON and show success
        const invalidRows = await uploadResponse.json();
        console.log(invalidData);
        
        if (invalidRows.length === 0) {
          alert("All files uploaded successfully. No invalid data found.");
        } else {
          alert(`Upload completed, but ${invalidRows.length} rows are invalid.`);
          // Optional: handle invalidRows
           setInvalidData(invalidRows.map((row, index) => ({ id: index + 1, ...row })));
           console.log(setInvalidData);
           
        }
      }

    } catch (err) {
      console.error(err);
      alert("File upload failed. Please try again.");
    }
  };

  const handleEdit = (id, key, value) => {
    const updated = invalidData.map((row) =>
      row.id === id ? { ...row, [key]: value } : row
    );
    setInvalidData(updated);
  };

  const handleRemove = (id) => {
    setInvalidData(invalidData.filter((row) => row.id !== id));
  };

  const handleGenerateReport = () => {
    navigate("/report", { state: { data: invalidData } });
  };

  return (
    <div className="upload-container">
      <h2>Upload Files</h2>

      <input
        type="file"
        multiple
        accept=".csv"
        onChange={handleFileChange}
      />

      {files.length > 0 && (
        <div className="file-list">
          <p>Selected: {files.length} files</p>
          <ul style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>
            {files.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleUpload}>Upload & Validate</button>

      {invalidData.length > 0 && (
        <>
          <h3>Invalid Data Detected</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Edit</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {invalidData.map((row) => ( 
                <tr key={row.id}>
                  <td>
                    <input
                      type="text"
                      value={row.fileName}
                      onChange={(e) =>
                        handleEdit(row.id, "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.nic}
                      onChange={(e) =>
                        handleEdit(row.id, "email", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => alert("Fixed!")}>Save</button>
                  </td>
                  <td>
                    <button onClick={() => handleRemove(row.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="report-btn" onClick={handleGenerateReport}>
            Generate Report
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;