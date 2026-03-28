import { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader,
  Shield,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileCheck,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";

export default function UploadPage() {

  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortedResults, setSortedResults] = useState([]);

  const [threshold, setThreshold] = useState(null);
  const thresholds = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);

  const getColorCategory = (value) => {
    if (value >= 70) return "red";
    if (value >= 40) return "yellow";
    return "green";
  };

  // Handle file upload and API call — original logic unchanged
  const handleUpload = async (file) => {
    setProgress(20);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setProgress(50);
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed! Check backend connection.");
      }

      const data = await response.json();
      setProgress(100);
      setResult(data);

      const sorted = [...data.results].sort(
        (a, b) => b.similarity - a.similarity
      );
      setSortedResults(sorted);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while uploading.");
      setProgress(0);
    }
  };

  const getSeverityColor = (score) => {
    if (score > 75)
      return {
        bg: "#FFEBEE",
        border: "#FFCDD2",
        text: "#D32F2F",
        gradient: "linear-gradient(135deg, #EF5350 0%, #D32F2F 100%)",
      };
    if (score > 40)
      return {
        bg: "#FFF3E0",
        border: "#FFE0B2",
        text: "#F57C00",
        gradient: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
      };
    return {
      bg: "#E8F5E9",
      border: "#C8E6C9",
      text: "#388E3C",
      gradient: "linear-gradient(135deg, #66BB6A 0%, #388E3C 100%)",
    };
  };

  const getSeverityLabel = (score) => {
    if (score > 75) return "High Risk";
    if (score > 40) return "Moderate Risk";
    return "Low Risk";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #F5F5F5 0%, #E3F2FD 50%, #E0F2F1 100%)",
        padding: "64px 24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
              borderRadius: "20px",
              marginBottom: "24px",
              boxShadow: "0 8px 24px rgba(41, 121, 255, 0.3)",
            }}
          >
            <Upload size={40} color="white" strokeWidth={2.5} />
          </div>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "12px",
            }}
          >
            Upload Your ZIP File
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#757575",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Upload a ZIP file containing Python files to detect plagiarism
            across multiple documents with our AI-powered analysis
          </p>
        </div>

        {/* Upload Card */}
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            padding: "48px",
            marginBottom: "32px",
            border: "1px solid #F0F0F0",
            maxWidth: "800px",
            margin: "0 auto 32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#E3F2FD",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={24} color="#2979FF" />
            </div>
            <h2
              style={{ fontSize: "24px", fontWeight: "700", color: "#212121" }}
            >
              Choose ZIP File to Analyze
            </h2>
          </div>

          {/* Styled File Input — same style as pairwise page */}
          <label
            style={{
              border: `2px dashed ${selectedFile ? "#2979FF" : "#BDBDBD"}`,
              borderRadius: "16px",
              padding: "40px 24px",
              textAlign: "center",
              background: selectedFile ? "#F5F9FF" : "#FAFAFA",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "block",
            }}
          >
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                  handleUpload(file);
                }
              }}
            />
            <div
              style={{
                width: "56px",
                height: "56px",
                background: selectedFile ? "#E3F2FD" : "#F5F5F5",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              {selectedFile ? (
                <FileText size={28} color="#2979FF" />
              ) : (
                <Upload size={28} color="#9E9E9E" />
              )}
            </div>
            <p
              style={{
                fontWeight: "700",
                color: selectedFile ? "#2979FF" : "#757575",
                fontSize: "16px",
                marginBottom: "6px",
              }}
            >
              {selectedFile ? selectedFile.name : "Click to upload ZIP file"}
            </p>
            <p style={{ fontSize: "13px", color: "#9E9E9E", margin: 0 }}>
              {selectedFile
                ? "Click to change file"
                : "Drag & drop or click to browse"}
            </p>
          </label>

          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              background: "#F5F9FF",
              borderRadius: "12px",
              border: "1px solid #E3F2FD",
            }}
          >
            <p style={{ fontSize: "14px", color: "#616161", margin: 0 }}>
              <strong style={{ color: "#2979FF" }}>Supported format:</strong>{" "}
              .zip containing Python (.py) files (Max size: 50MB)
            </p>
          </div>
        </div>

        {/* Progress Section */}
        {progress > 0 && progress < 100 && (
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              padding: "40px",
              marginBottom: "32px",
              border: "1px solid #F0F0F0",
              maxWidth: "800px",
              margin: "0 auto 32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#E0F2F1",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ animation: "spin 1s linear infinite" }}>
                  <Loader size={24} color="#00BCD4" />
                </div>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#212121",
                    marginBottom: "4px",
                  }}
                >
                  Analyzing Files...
                </h3>
                <p style={{ fontSize: "14px", color: "#757575", margin: 0 }}>
                  Our AI is processing your ZIP file
                </p>
              </div>
            </div>

            <ProgressBar progress={progress} />

            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#00BCD4",
                }}
              >
                {progress}%
              </span>
            </div>
          </div>
        )}

        {/* Error Section */}
        {error && (
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              padding: "32px",
              border: "1px solid #F0F0F0",
              marginBottom: "32px",
              maxWidth: "800px",
              margin: "0 auto 32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "24px",
                background: "#FFEBEE",
                borderRadius: "16px",
                border: "2px solid #FFCDD2",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#F44336",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={24} color="white" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#D32F2F",
                    marginBottom: "4px",
                  }}
                >
                  Upload Failed
                </h3>
                <p style={{ fontSize: "15px", color: "#C62828", margin: 0 }}>
                  ⚠️ {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              padding: "48px",
              marginBottom: "32px",
              border: "1px solid #F0F0F0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#E8F5E9",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle size={24} color="#4CAF50" />
              </div>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#212121",
                }}
              >
                📄 Detection Results
              </h2>
            </div>

            {/* Uploaded File Name */}
            <div
              style={{
                background: "#FAFAFA",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "32px",
                border: "1px solid #E0E0E0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <FileText size={20} color="#616161" />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#757575",
                  }}
                >
                  Uploaded File
                </span>
              </div>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#212121",
                  margin: 0,
                  paddingLeft: "32px",
                }}
              >
                {result.filename}
              </p>
            </div>

            {/* Overall Score */}
            <div
              style={{
                background: getSeverityColor(result.plagiarismScore).bg,
                border: `2px solid ${getSeverityColor(result.plagiarismScore).border}`,
                borderRadius: "20px",
                padding: "32px",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Shield size={28} color={getSeverityColor(result.plagiarismScore).text} />
                  <div>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#212121",
                        marginBottom: "4px",
                      }}
                    >
                      Overall Plagiarism Score
                    </h3>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        padding: "4px 12px",
                        background: "white",
                        color: getSeverityColor(result.plagiarismScore).text,
                        borderRadius: "8px",
                      }}
                    >
                      {getSeverityLabel(result.plagiarismScore)}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "52px",
                      fontWeight: "800",
                      color: getSeverityColor(result.plagiarismScore).text,
                      lineHeight: "1",
                    }}
                  >
                    {result.plagiarismScore}%
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "16px",
                  background: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${result.plagiarismScore}%`,
                    background: getSeverityColor(result.plagiarismScore).gradient,
                    borderRadius: "8px",
                    transition: "width 1s ease",
                  }}
                ></div>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  background: "white",
                  borderRadius: "12px",
                }}
              >
                <p style={{ fontSize: "14px", color: "#616161", margin: 0, lineHeight: "1.6" }}>
                  {result.plagiarismScore > 75 &&
                    "⚠️ High similarity detected. Significant portions match between files."}
                  {result.plagiarismScore > 40 &&
                    result.plagiarismScore <= 75 &&
                    "⚡ Moderate similarity found. Review flagged file pairs carefully."}
                  {result.plagiarismScore <= 40 &&
                    "✓ Low similarity score. Files appear mostly original."}
                </p>
              </div>
            </div>

            {/* Pairwise Results Header */}
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#212121",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FileCheck size={24} color="#2979FF" />
              Pairwise Comparison Results
            </h3>

            {/* Heatmap Buttons */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <button
                onClick={() => setActiveFilter("all")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: activeFilter === "all" ? "2px solid #2979FF" : "1px solid #CCC",
                  background: activeFilter === "all" ? "#E3F2FD" : "white",
                  cursor: "pointer",
                }}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("red")}
                style={{
                  padding: "8px",
                  borderRadius: "50%",
                  background: "#FF5252",
                  border: activeFilter === "red" ? "3px solid black" : "2px solid white",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
              />
              <button
                onClick={() => setActiveFilter("yellow")}
                style={{
                  padding: "8px",
                  borderRadius: "50%",
                  background: "#FFEB3B",
                  border: activeFilter === "yellow" ? "3px solid black" : "2px solid white",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
              />
              <button
                onClick={() => setActiveFilter("green")}
                style={{
                  padding: "8px",
                  borderRadius: "50%",
                  background: "#4CAF50",
                  border: activeFilter === "green" ? "3px solid black" : "2px solid white",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Threshold Filter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontWeight: "600", color: "#424242" }}>
                Filter by Threshold:
              </span>
              <select
                value={threshold || ""}
                onChange={(e) => setThreshold(Number(e.target.value))}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CCC",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="">All</option>
                {thresholds.map((t) => (
                  <option key={t} value={t}>
                    {t}%
                  </option>
                ))}
              </select>
            </div>

            {/* Pairwise Results Table */}
            <div
              style={{
                overflowX: "auto",
                borderRadius: "16px",
                border: "1px solid #E0E0E0",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "15px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
                      color: "white",
                    }}
                  >
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #1565C0" }}>File 1</th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #1565C0" }}>File 2</th>
                    <th style={{ padding: "16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #1565C0" }}>Similarity (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults
                    .filter((r) => {
                      if (activeFilter !== "all" && getColorCategory(r.similarity) !== activeFilter) return false;
                      if (threshold && r.similarity < threshold) return false;
                      return true;
                    })
                    .map((r, index) => (
                      <tr
                        key={index}
                        style={{
                          background: index % 2 === 0 ? "#FAFAFA" : "white",
                          transition: "background 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F9FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = index % 2 === 0 ? "#FAFAFA" : "white")}
                      >
                        <td style={{ padding: "16px", borderBottom: "1px solid #E0E0E0", color: "#424242" }}>{r.file1}</td>
                        <td style={{ padding: "16px", borderBottom: "1px solid #E0E0E0", color: "#424242" }}>{r.file2}</td>
                        <td style={{ padding: "16px", borderBottom: "1px solid #E0E0E0", textAlign: "center", fontWeight: "700" }}>
                          <span
                            style={{
                              padding: "6px 16px",
                              borderRadius: "8px",
                              background: r.similarity > 75 ? "#FFEBEE" : r.similarity > 40 ? "#FFF3E0" : "#E8F5E9",
                              color: r.similarity > 75 ? "#D32F2F" : r.similarity > 40 ? "#F57C00" : "#388E3C",
                              fontSize: "14px",
                            }}
                          >
                            {r.similarity}%
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Download Buttons */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "32px",
              }}
            >
              <a
                href={`http://localhost:5000/api/download/${result.report_excel}`}
                style={{
                  textDecoration: "none",
                  padding: "16px 32px",
                  background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
                  color: "white",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  boxShadow: "0 4px 16px rgba(41, 121, 255, 0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.3s ease",
                }}
              >
                <FileSpreadsheet size={20} />
                Download Excel Report
              </a>
              <a
                href={`http://localhost:5000/api/download/${result.report_pdf}`}
                style={{
                  textDecoration: "none",
                  padding: "16px 32px",
                  background: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
                  color: "white",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  boxShadow: "0 4px 16px rgba(76, 175, 80, 0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.3s ease",
                }}
              >
                <Download size={20} />
                Download PDF Report
              </a>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginTop: "48px",
          }}
        >
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "1px solid #F0F0F0" }}>
            <div style={{ width: "48px", height: "48px", background: "#E3F2FD", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <Shield size={24} color="#2979FF" />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#212121", marginBottom: "8px" }}>Batch Processing</h3>
            <p style={{ fontSize: "14px", color: "#757575", margin: 0 }}>Analyze multiple Python files simultaneously for comprehensive plagiarism detection</p>
          </div>

          <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "1px solid #F0F0F0" }}>
            <div style={{ width: "48px", height: "48px", background: "#E0F2F1", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <TrendingUp size={24} color="#00BCD4" />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#212121", marginBottom: "8px" }}>Detailed Reports</h3>
            <p style={{ fontSize: "14px", color: "#757575", margin: 0 }}>Export comprehensive Excel and PDF reports with pairwise comparisons</p>
          </div>

          <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "1px solid #F0F0F0" }}>
            <div style={{ width: "48px", height: "48px", background: "#F3E5F5", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <CheckCircle size={24} color="#9C27B0" />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#212121", marginBottom: "8px" }}>High Accuracy</h3>
            <p style={{ fontSize: "14px", color: "#757575", margin: 0 }}>Advanced algorithms for precise code similarity detection and analysis</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}



// // import { useState } from "react";
// // import { Upload, FileText, CheckCircle, AlertCircle, Loader, Shield, TrendingUp, Download, FileSpreadsheet, FileCheck } from 'lucide-react';
// // import FileUpload from "../components/FileUpload";
// // import ProgressBar from "../components/ProgressBar";

// // export default function UploadPage() {
// //   const [progress, setProgress] = useState(0);
// //   const [result, setResult] = useState(null);
// //   const [error, setError] = useState("");

// //   // Handle file upload and API call
// //   const handleUpload = async (file) => {
// //     setProgress(20);
// //     setError("");
// //     setResult(null);

// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       setProgress(50);
// //       const response = await fetch("http://localhost:5000/api/upload", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       if (!response.ok) {
// //         throw new Error("Upload failed! Check backend connection.");
// //       }

// //       const data = await response.json();
// //       setProgress(100);
// //       setResult(data);
// //     } catch (err) {
// //       console.error(err);
// //       setError(err.message || "An error occurred while uploading.");
// //       setProgress(0);
// //     }
// //   };

// //   const getSeverityColor = (score) => {
// //     if (score > 75) return { bg: '#FFEBEE', border: '#FFCDD2', text: '#D32F2F', gradient: 'linear-gradient(135deg, #EF5350 0%, #D32F2F 100%)' };
// //     if (score > 40) return { bg: '#FFF3E0', border: '#FFE0B2', text: '#F57C00', gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' };
// //     return { bg: '#E8F5E9', border: '#C8E6C9', text: '#388E3C', gradient: 'linear-gradient(135deg, #66BB6A 0%, #388E3C 100%)' };
// //   };

// //   const getSeverityLabel = (score) => {
// //     if (score > 75) return 'High Risk';
// //     if (score > 40) return 'Moderate Risk';
// //     return 'Low Risk';
// //   };

// //   return (
// //     <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F5F5F5 0%, #E3F2FD 50%, #E0F2F1 100%)', padding: '64px 24px' }}>
// //       <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
// //         {/* Header Section */}
// //         <div style={{ textAlign: 'center', marginBottom: '48px' }}>
// //           <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', borderRadius: '20px', marginBottom: '24px', boxShadow: '0 8px 24px rgba(41, 121, 255, 0.3)' }}>
// //             <Upload size={40} color="white" strokeWidth={2.5} />
// //           </div>
// //           <h1 style={{ fontSize: '42px', fontWeight: '800', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>
// //             Upload Your ZIP File
// //           </h1>
// //           <p style={{ fontSize: '18px', color: '#757575', maxWidth: '700px', margin: '0 auto' }}>
// //             Upload a ZIP file containing Python files to detect plagiarism across multiple documents with our AI-powered analysis
// //           </p>
// //         </div>

// //         {/* Upload Card */}
// //         <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '48px', marginBottom: '32px', border: '1px solid #F0F0F0', maxWidth: '800px', margin: '0 auto 32px' }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
// //             <div style={{ width: '48px', height: '48px', background: '#E3F2FD', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //               <FileText size={24} color="#2979FF" />
// //             </div>
// //             <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#212121' }}>Choose ZIP File to Analyze</h2>
// //           </div>

// //           {/* File Upload Component */}
// //           <FileUpload onUpload={handleUpload} />

// //           {/* Supported Formats Info */}
// //           <div style={{ marginTop: '24px', padding: '16px', background: '#F5F9FF', borderRadius: '12px', border: '1px solid #E3F2FD' }}>
// //             <p style={{ fontSize: '14px', color: '#616161', margin: 0 }}>
// //               <strong style={{ color: '#2979FF' }}>Supported format:</strong> .zip containing Python (.py) files (Max size: 50MB)
// //             </p>
// //           </div>
// //         </div>

// //         {/* Progress Section */}
// //         {progress > 0 && progress < 100 && (
// //           <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '40px', marginBottom: '32px', border: '1px solid #F0F0F0', maxWidth: '800px', margin: '0 auto 32px' }}>
// //             <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
// //               <div style={{ width: '48px', height: '48px', background: '#E0F2F1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //                 <div style={{ animation: 'spin 1s linear infinite' }}>
// //                   <Loader size={24} color="#00BCD4" />
// //                 </div>
// //               </div>
// //               <div>
// //                 <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#212121', marginBottom: '4px' }}>Analyzing Files...</h3>
// //                 <p style={{ fontSize: '14px', color: '#757575', margin: 0 }}>Our AI is processing your ZIP file</p>
// //               </div>
// //             </div>

// //             {/* Progress Bar Component */}
// //             <ProgressBar progress={progress} />

// //             <div style={{ marginTop: '16px', textAlign: 'center' }}>
// //               <span style={{ fontSize: '24px', fontWeight: '700', color: '#00BCD4' }}>{progress}%</span>
// //             </div>
// //           </div>
// //         )}

// //         {/* Error Section */}
// //         {error && (
// //           <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '32px', border: '1px solid #F0F0F0', marginBottom: '32px', maxWidth: '800px', margin: '0 auto 32px' }}>
// //             <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', background: '#FFEBEE', borderRadius: '16px', border: '2px solid #FFCDD2' }}>
// //               <div style={{ width: '48px', height: '48px', background: '#F44336', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
// //                 <AlertCircle size={24} color="white" />
// //               </div>
// //               <div>
// //                 <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#D32F2F', marginBottom: '4px' }}>Upload Failed</h3>
// //                 <p style={{ fontSize: '15px', color: '#C62828', margin: 0 }}>⚠️ {error}</p>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Result Section */}
// //         {result && (
// //           <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '48px', marginBottom: '32px', border: '1px solid #F0F0F0' }}>
// //             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
// //               <div style={{ width: '48px', height: '48px', background: '#E8F5E9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //                 <CheckCircle size={24} color="#4CAF50" />
// //               </div>
// //               <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#212121' }}>📄 Detection Results</h2>
// //             </div>

// //             {/* File Info */}
// //             <div style={{ background: '#FAFAFA', borderRadius: '16px', padding: '24px', marginBottom: '32px', border: '1px solid #E0E0E0' }}>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
// //                 <FileText size={20} color="#616161" />
// //                 <span style={{ fontSize: '14px', fontWeight: '600', color: '#757575' }}>Uploaded File</span>
// //               </div>
// //               <p style={{ fontSize: '18px', fontWeight: '600', color: '#212121', margin: 0, paddingLeft: '32px' }}>{result.filename}</p>
// //             </div>

// //             {/* Overall Plagiarism Score Card */}
// //             <div style={{
// //               background: getSeverityColor(result.plagiarismScore).bg,
// //               border: `2px solid ${getSeverityColor(result.plagiarismScore).border}`,
// //               borderRadius: '20px',
// //               padding: '32px',
// //               marginBottom: '40px'
// //             }}>
// //               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
// //                   <Shield size={28} color={getSeverityColor(result.plagiarismScore).text} />
// //                   <div>
// //                     <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginBottom: '4px' }}>Overall Plagiarism Score</h3>
// //                     <span style={{
// //                       fontSize: '13px',
// //                       fontWeight: '700',
// //                       padding: '4px 12px',
// //                       background: 'white',
// //                       color: getSeverityColor(result.plagiarismScore).text,
// //                       borderRadius: '8px'
// //                     }}>
// //                       {getSeverityLabel(result.plagiarismScore)}
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div style={{ textAlign: 'right' }}>
// //                   <div style={{ fontSize: '52px', fontWeight: '800', color: getSeverityColor(result.plagiarismScore).text, lineHeight: '1' }}>
// //                     {result.plagiarismScore}%
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Visual Progress Bar */}
// //               <div style={{ width: '100%', height: '16px', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
// //                 <div style={{
// //                   height: '100%',
// //                   width: `${result.plagiarismScore}%`,
// //                   background: getSeverityColor(result.plagiarismScore).gradient,
// //                   borderRadius: '8px',
// //                   transition: 'width 1s ease'
// //                 }}></div>
// //               </div>

// //               {/* Interpretation */}
// //               <div style={{ marginTop: '20px', padding: '16px', background: 'white', borderRadius: '12px' }}>
// //                 <p style={{ fontSize: '14px', color: '#616161', margin: 0, lineHeight: '1.6' }}>
// //                   {result.plagiarismScore > 75 && "⚠️ High similarity detected. Significant portions match between files."}
// //                   {result.plagiarismScore > 40 && result.plagiarismScore <= 75 && "⚡ Moderate similarity found. Review flagged file pairs carefully."}
// //                   {result.plagiarismScore <= 40 && "✓ Low similarity score. Files appear mostly original."}
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Pairwise Results Table */}
// //             <div style={{ marginBottom: '32px' }}>
// //               <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#212121', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
// //                 <FileCheck size={24} color="#2979FF" />
// //                 Pairwise Comparison Results
// //               </h3>

// //               <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid #E0E0E0' }}>
// //                 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
// //                   <thead>
// //                     <tr style={{ background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', color: 'white' }}>
// //                       <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #1565C0' }}>File 1</th>
// //                       <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #1565C0' }}>File 2</th>
// //                       <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', borderBottom: '2px solid #1565C0' }}>Similarity (%)</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {result.results.map((r, index) => (
// //                       <tr key={index} style={{
// //                         background: index % 2 === 0 ? '#FAFAFA' : 'white',
// //                         transition: 'background 0.2s ease'
// //                       }}
// //                       onMouseEnter={(e) => e.currentTarget.style.background = '#F5F9FF'}
// //                       onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#FAFAFA' : 'white'}
// //                       >
// //                         <td style={{ padding: '16px', borderBottom: '1px solid #E0E0E0', color: '#424242' }}>{r.file1}</td>
// //                         <td style={{ padding: '16px', borderBottom: '1px solid #E0E0E0', color: '#424242' }}>{r.file2}</td>
// //                         <td style={{
// //                           padding: '16px',
// //                           borderBottom: '1px solid #E0E0E0',
// //                           textAlign: 'center',
// //                           fontWeight: '700'
// //                         }}>
// //                           <span style={{
// //                             padding: '6px 16px',
// //                             borderRadius: '8px',
// //                             background: r.similarity > 75 ? '#FFEBEE' : r.similarity > 40 ? '#FFF3E0' : '#E8F5E9',
// //                             color: r.similarity > 75 ? '#D32F2F' : r.similarity > 40 ? '#F57C00' : '#388E3C',
// //                             fontSize: '14px'
// //                           }}>
// //                             {r.similarity}%
// //                           </span>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>

// //             {/* Download Buttons */}
// //             <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
// //               <a
// //                 href={`http://localhost:5000/api/download/${result.report_excel}`}
// //                 style={{
// //                   textDecoration: 'none',
// //                   padding: '16px 32px',
// //                   background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)',
// //                   color: 'white',
// //                   borderRadius: '12px',
// //                   fontSize: '16px',
// //                   fontWeight: '600',
// //                   boxShadow: '0 4px 16px rgba(41, 121, 255, 0.3)',
// //                   display: 'inline-flex',
// //                   alignItems: 'center',
// //                   gap: '10px',
// //                   transition: 'all 0.3s ease'
// //                 }}
// //                 onMouseEnter={(e) => {
// //                   e.currentTarget.style.transform = 'translateY(-2px)';
// //                   e.currentTarget.style.boxShadow = '0 6px 20px rgba(41, 121, 255, 0.4)';
// //                 }}
// //                 onMouseLeave={(e) => {
// //                   e.currentTarget.style.transform = 'translateY(0)';
// //                   e.currentTarget.style.boxShadow = '0 4px 16px rgba(41, 121, 255, 0.3)';
// //                 }}
// //               >
// //                 <FileSpreadsheet size={20} />
// //                 Download Excel Report
// //               </a>

// //               <a
// //                 href={`http://localhost:5000/api/download/${result.report_pdf}`}
// //                 style={{
// //                   textDecoration: 'none',
// //                   padding: '16px 32px',
// //                   background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
// //                   color: 'white',
// //                   borderRadius: '12px',
// //                   fontSize: '16px',
// //                   fontWeight: '600',
// //                   boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
// //                   display: 'inline-flex',
// //                   alignItems: 'center',
// //                   gap: '10px',
// //                   transition: 'all 0.3s ease'
// //                 }}
// //                 onMouseEnter={(e) => {
// //                   e.currentTarget.style.transform = 'translateY(-2px)';
// //                   e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
// //                 }}
// //                 onMouseLeave={(e) => {
// //                   e.currentTarget.style.transform = 'translateY(0)';
// //                   e.currentTarget.style.boxShadow = '0 4px 16px rgba(76, 175, 80, 0.3)';
// //                 }}
// //               >
// //                 <Download size={20} />
// //                 Download PDF Report
// //               </a>
// //             </div>
// //           </div>
// //         )}

// //         {/* Features Grid */}
// //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '48px' }}>
// //           <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0' }}>
// //             <div style={{ width: '48px', height: '48px', background: '#E3F2FD', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
// //               <Shield size={24} color="#2979FF" />
// //             </div>
// //             <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '8px' }}>Batch Processing</h3>
// //             <p style={{ fontSize: '14px', color: '#757575', margin: 0 }}>Analyze multiple Python files simultaneously for comprehensive plagiarism detection</p>
// //           </div>

// //           <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0' }}>
// //             <div style={{ width: '48px', height: '48px', background: '#E0F2F1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
// //               <TrendingUp size={24} color="#00BCD4" />
// //             </div>
// //             <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '8px' }}>Detailed Reports</h3>
// //             <p style={{ fontSize: '14px', color: '#757575', margin: 0 }}>Export comprehensive Excel and PDF reports with pairwise comparisons</p>
// //           </div>

// //           <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0' }}>
// //             <div style={{ width: '48px', height: '48px', background: '#F3E5F5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
// //               <CheckCircle size={24} color="#9C27B0" />
// //             </div>
// //             <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '8px' }}>High Accuracy</h3>
// //             <p style={{ fontSize: '14px', color: '#757575', margin: 0 }}>Advanced algorithms for precise code similarity detection and analysis</p>
// //           </div>
// //         </div>
// //       </div>

// //       <style>{`
// //         @keyframes spin {
// //           from { transform: rotate(0deg); }
// //           to { transform: rotate(360deg); }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import {
//   Upload,
//   FileText,
//   CheckCircle,
//   AlertCircle,
//   Loader,
//   Shield,
//   TrendingUp,
//   Download,
//   FileSpreadsheet,
//   FileCheck,
// } from "lucide-react";
// import FileUpload from "../components/FileUpload";
// import ProgressBar from "../components/ProgressBar";

// export default function UploadPage() {

//   const [progress, setProgress] = useState(0);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   const [activeFilter, setActiveFilter] = useState("all"); // heatmap filter
//   const [sortedResults, setSortedResults] = useState([]); // sorted pairwise results

//   const [threshold, setThreshold] = useState(null); // Threshold for filtering
//   const thresholds = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
//   // Color category (red, yellow, green)
//   const getColorCategory = (value) => {
//     if (value >= 70) return "red";
//     if (value >= 40) return "yellow";
//     return "green";
//   };

//   // Handle file upload and API call
//   const handleUpload = async (file) => {
//     setProgress(20);
//     setError("");
//     setResult(null);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setProgress(50);
//       const response = await fetch("http://localhost:5000/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Upload failed! Check backend connection.");
//       }

//       const data = await response.json();
//       setProgress(100);

//       // Save result
//       setResult(data);

//       // Sorting Results
//       const sorted = [...data.results].sort(
//         (a, b) => b.similarity - a.similarity
//       );
//       setSortedResults(sorted);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "An error occurred while uploading.");
//       setProgress(0);
//     }
//   };

//   const getSeverityColor = (score) => {
//     if (score > 75)
//       return {
//         bg: "#FFEBEE",
//         border: "#FFCDD2",
//         text: "#D32F2F",
//         gradient: "linear-gradient(135deg, #EF5350 0%, #D32F2F 100%)",
//       };
//     if (score > 40)
//       return {
//         bg: "#FFF3E0",
//         border: "#FFE0B2",
//         text: "#F57C00",
//         gradient: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
//       };
//     return {
//       bg: "#E8F5E9",
//       border: "#C8E6C9",
//       text: "#388E3C",
//       gradient: "linear-gradient(135deg, #66BB6A 0%, #388E3C 100%)",
//     };
//   };

//   const getSeverityLabel = (score) => {
//     if (score > 75) return "High Risk";
//     if (score > 40) return "Moderate Risk";
//     return "Low Risk";
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(135deg, #F5F5F5 0%, #E3F2FD 50%, #E0F2F1 100%)",
//         padding: "64px 24px",
//       }}
//     >
//       <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//         {/* Header Section */}
//         <div style={{ textAlign: "center", marginBottom: "48px" }}>
//           <div
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               justifyContent: "center",
//               width: "80px",
//               height: "80px",
//               background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
//               borderRadius: "20px",
//               marginBottom: "24px",
//               boxShadow: "0 8px 24px rgba(41, 121, 255, 0.3)",
//             }}
//           >
//             <Upload size={40} color="white" strokeWidth={2.5} />
//           </div>
//           <h1
//             style={{
//               fontSize: "42px",
//               fontWeight: "800",
//               background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               marginBottom: "12px",
//             }}
//           >
//             Upload Your ZIP File
//           </h1>
//           <p
//             style={{
//               fontSize: "18px",
//               color: "#757575",
//               maxWidth: "700px",
//               margin: "0 auto",
//             }}
//           >
//             Upload a ZIP file containing Python files to detect plagiarism
//             across multiple documents with our AI-powered analysis
//           </p>
//         </div>

//         {/* Upload Card */}
//         <div
//           style={{
//             background: "white",
//             borderRadius: "24px",
//             boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
//             padding: "48px",
//             marginBottom: "32px",
//             border: "1px solid #F0F0F0",
//             maxWidth: "800px",
//             margin: "0 auto 32px",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               marginBottom: "32px",
//             }}
//           >
//             <div
//               style={{
//                 width: "48px",
//                 height: "48px",
//                 background: "#E3F2FD",
//                 borderRadius: "12px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <FileText size={24} color="#2979FF" />
//             </div>
//             <h2
//               style={{ fontSize: "24px", fontWeight: "700", color: "#212121" }}
//             >
//               Choose ZIP File to Analyze
//             </h2>
//           </div>

//           {/* File Upload Component */}
//           <FileUpload onUpload={handleUpload} />

//           <div
//             style={{
//               marginTop: "24px",
//               padding: "16px",
//               background: "#F5F9FF",
//               borderRadius: "12px",
//               border: "1px solid #E3F2FD",
//             }}
//           >
//             <p style={{ fontSize: "14px", color: "#616161", margin: 0 }}>
//               <strong style={{ color: "#2979FF" }}>Supported format:</strong>{" "}
//               .zip containing Python (.py) files (Max size: 50MB)
//             </p>
//           </div>
//         </div>

//         {/* Progress Section */}
//         {progress > 0 && progress < 100 && (
//           <div
//             style={{
//               background: "white",
//               borderRadius: "24px",
//               boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
//               padding: "40px",
//               marginBottom: "32px",
//               border: "1px solid #F0F0F0",
//               maxWidth: "800px",
//               margin: "0 auto 32px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "16px",
//                 marginBottom: "24px",
//               }}
//             >
//               <div
//                 style={{
//                   width: "48px",
//                   height: "48px",
//                   background: "#E0F2F1",
//                   borderRadius: "12px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <div style={{ animation: "spin 1s linear infinite" }}>
//                   <Loader size={24} color="#00BCD4" />
//                 </div>
//               </div>
//               <div>
//                 <h3
//                   style={{
//                     fontSize: "20px",
//                     fontWeight: "700",
//                     color: "#212121",
//                     marginBottom: "4px",
//                   }}
//                 >
//                   Analyzing Files...
//                 </h3>
//                 <p style={{ fontSize: "14px", color: "#757575", margin: 0 }}>
//                   Our AI is processing your ZIP file
//                 </p>
//               </div>
//             </div>

//             <ProgressBar progress={progress} />

//             <div style={{ marginTop: "16px", textAlign: "center" }}>
//               <span
//                 style={{
//                   fontSize: "24px",
//                   fontWeight: "700",
//                   color: "#00BCD4",
//                 }}
//               >
//                 {progress}%
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Error Section */}
//         {error && (
//           <div
//             style={{
//               background: "white",
//               borderRadius: "24px",
//               boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
//               padding: "32px",
//               border: "1px solid #F0F0F0",
//               marginBottom: "32px",
//               maxWidth: "800px",
//               margin: "0 auto 32px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "16px",
//                 padding: "24px",
//                 background: "#FFEBEE",
//                 borderRadius: "16px",
//                 border: "2px solid #FFCDD2",
//               }}
//             >
//               <div
//                 style={{
//                   width: "48px",
//                   height: "48px",
//                   background: "#F44336",
//                   borderRadius: "12px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexShrink: 0,
//                 }}
//               >
//                 <AlertCircle size={24} color="white" />
//               </div>
//               <div>
//                 <h3
//                   style={{
//                     fontSize: "18px",
//                     fontWeight: "700",
//                     color: "#D32F2F",
//                     marginBottom: "4px",
//                   }}
//                 >
//                   Upload Failed
//                 </h3>
//                 <p style={{ fontSize: "15px", color: "#C62828", margin: 0 }}>
//                   ⚠️ {error}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Result Section */}
//         {result && (
//           <div
//             style={{
//               background: "white",
//               borderRadius: "24px",
//               boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
//               padding: "48px",
//               marginBottom: "32px",
//               border: "1px solid #F0F0F0",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "12px",
//                 marginBottom: "32px",
//               }}
//             >
//               <div
//                 style={{
//                   width: "48px",
//                   height: "48px",
//                   background: "#E8F5E9",
//                   borderRadius: "12px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <CheckCircle size={24} color="#4CAF50" />
//               </div>
//               <h2
//                 style={{
//                   fontSize: "28px",
//                   fontWeight: "700",
//                   color: "#212121",
//                 }}
//               >
//                 📄 Detection Results
//               </h2>
//             </div>
//             {/* Uploaded File Name */}
//             <div
//               style={{
//                 background: "#FAFAFA",
//                 borderRadius: "16px",
//                 padding: "24px",
//                 marginBottom: "32px",
//                 border: "1px solid #E0E0E0",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "12px",
//                   marginBottom: "8px",
//                 }}
//               >
//                 <FileText size={20} color="#616161" />
//                 <span
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "600",
//                     color: "#757575",
//                   }}
//                 >
//                   Uploaded File
//                 </span>
//               </div>
//               <p
//                 style={{
//                   fontSize: "18px",
//                   fontWeight: "600",
//                   color: "#212121",
//                   margin: 0,
//                   paddingLeft: "32px",
//                 }}
//               >
//                 {result.filename}
//               </p>
//             </div>
//             {/* Overall Score */}
//             <div
//               style={{
//                 background: getSeverityColor(result.plagiarismScore).bg,
//                 border: `2px solid ${
//                   getSeverityColor(result.plagiarismScore).border
//                 }`,
//                 borderRadius: "20px",
//                 padding: "32px",
//                 marginBottom: "40px",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: "20px",
//                   flexWrap: "wrap",
//                   gap: "16px",
//                 }}
//               >
//                 <div
//                   style={{ display: "flex", alignItems: "center", gap: "12px" }}
//                 >
//                   <Shield
//                     size={28}
//                     color={getSeverityColor(result.plagiarismScore).text}
//                   />
//                   <div>
//                     <h3
//                       style={{
//                         fontSize: "18px",
//                         fontWeight: "700",
//                         color: "#212121",
//                         marginBottom: "4px",
//                       }}
//                     >
//                       Overall Plagiarism Score
//                     </h3>
//                     <span
//                       style={{
//                         fontSize: "13px",
//                         fontWeight: "700",
//                         padding: "4px 12px",
//                         background: "white",
//                         color: getSeverityColor(result.plagiarismScore).text,
//                         borderRadius: "8px",
//                       }}
//                     >
//                       {getSeverityLabel(result.plagiarismScore)}
//                     </span>
//                   </div>
//                 </div>
//                 <div style={{ textAlign: "right" }}>
//                   <div
//                     style={{
//                       fontSize: "52px",
//                       fontWeight: "800",
//                       color: getSeverityColor(result.plagiarismScore).text,
//                       lineHeight: "1",
//                     }}
//                   >
//                     {result.plagiarismScore}%
//                   </div>
//                 </div>
//               </div>

//               {/* Progress Bar */}
//               <div
//                 style={{
//                   width: "100%",
//                   height: "16px",
//                   background: "white",
//                   borderRadius: "8px",
//                   overflow: "hidden",
//                   boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <div
//                   style={{
//                     height: "100%",
//                     width: `${result.plagiarismScore}%`,
//                     background: getSeverityColor(result.plagiarismScore)
//                       .gradient,
//                     borderRadius: "8px",
//                     transition: "width 1s ease",
//                   }}
//                 ></div>
//               </div>

//               <div
//                 style={{
//                   marginTop: "20px",
//                   padding: "16px",
//                   background: "white",
//                   borderRadius: "12px",
//                 }}
//               >
//                 <p
//                   style={{
//                     fontSize: "14px",
//                     color: "#616161",
//                     margin: 0,
//                     lineHeight: "1.6",
//                   }}
//                 >
//                   {result.plagiarismScore > 75 &&
//                     "⚠️ High similarity detected. Significant portions match between files."}
//                   {result.plagiarismScore > 40 &&
//                     result.plagiarismScore <= 75 &&
//                     "⚡ Moderate similarity found. Review flagged file pairs carefully."}
//                   {result.plagiarismScore <= 40 &&
//                     "✓ Low similarity score. Files appear mostly original."}
//                 </p>
//               </div>
//             </div>
//             {/* Heat Map */}
//             <h3
//               style={{
//                 fontSize: "20px",
//                 fontWeight: "700",
//                 color: "#212121",
//                 marginBottom: "16px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//               }}
//             >
//               <FileCheck size={24} color="#2979FF" />
//               Pairwise Comparison Results
//             </h3>
//             {/* Heatmap Buttons */}
//             <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
//               <button
//                 onClick={() => setActiveFilter("all")}
//                 style={{
//                   padding: "8px 16px",
//                   borderRadius: "8px",
//                   border:
//                     activeFilter === "all"
//                       ? "2px solid #2979FF"
//                       : "1px solid #CCC",
//                   background: activeFilter === "all" ? "#E3F2FD" : "white",
//                   cursor: "pointer",
//                 }}
//               >
//                 All
//               </button>

//               <button
//                 onClick={() => setActiveFilter("red")}
//                 style={{
//                   padding: "8px",
//                   borderRadius: "50%",
//                   background: "#FF5252",
//                   border:
//                     activeFilter === "red"
//                       ? "3px solid black"
//                       : "2px solid white",
//                   width: "24px",
//                   height: "24px",
//                   cursor: "pointer",
//                 }}
//               />

//               <button
//                 onClick={() => setActiveFilter("yellow")}
//                 style={{
//                   padding: "8px",
//                   borderRadius: "50%",
//                   background: "#FFEB3B",
//                   border:
//                     activeFilter === "yellow"
//                       ? "3px solid black"
//                       : "2px solid white",
//                   width: "24px",
//                   height: "24px",
//                   cursor: "pointer",
//                 }}
//               />

//               <button
//                 onClick={() => setActiveFilter("green")}
//                 style={{
//                   padding: "8px",
//                   borderRadius: "50%",
//                   background: "#4CAF50",
//                   border:
//                     activeFilter === "green"
//                       ? "3px solid black"
//                       : "2px solid white",
//                   width: "24px",
//                   height: "24px",
//                   cursor: "pointer",
//                 }}
//               />
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "16px",
//                 marginBottom: "20px",
//               }}
//             >
//               <span style={{ fontWeight: "600", color: "#424242" }}>
//                 Filter by Threshold:
//               </span>
//               <select
//                 value={threshold || ""}
//                 onChange={(e) => setThreshold(Number(e.target.value))}
//                 style={{
//                   padding: "8px 12px",
//                   borderRadius: "8px",
//                   border: "1px solid #CCC",
//                   fontSize: "14px",
//                   cursor: "pointer",
//                 }}
//               >
//                 <option value="">All</option>
//                 {thresholds.map((t) => (
//                   <option key={t} value={t}>
//                     {t}%
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* <tbody>
  
//   {sortedResults
//     .filter(r => {
//       // First apply heatmap filter
//       if (activeFilter !== "all" && getColorCategory(r.similarity) !== activeFilter) return false;
//       // Then apply threshold filter
//       if (threshold && r.similarity < threshold) return false;
//       return true;
//     })
//     .map((r, index) => (
//       <tr key={index} style={{
//         background: index % 2 === 0 ? '#FAFAFA' : 'white',
//         transition: 'background 0.2s ease'
//       }}
//         onMouseEnter={(e) => e.currentTarget.style.background = '#F5F9FF'}
//         onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#FAFAFA' : 'white'}
//       >
//         <td style={{ padding: '16px', borderBottom: '1px solid #E0E0E0', color: '#424242' }}>{r.file1}</td>
//         <td style={{ padding: '16px', borderBottom: '1px solid #E0E0E0', color: '#424242' }}>{r.file2}</td>
//         <td style={{
//           padding: '16px',
//           borderBottom: '1px solid #E0E0E0',
//           textAlign: 'center',
//           fontWeight: '700'
//         }}>
//           <span style={{
//             padding: '6px 16px',
//             borderRadius: '8px',
//             background: r.similarity > 75 ? '#FFEBEE' : r.similarity > 40 ? '#FFF3E0' : '#E8F5E9',
//             color: r.similarity > 75 ? '#D32F2F' : r.similarity > 40 ? '#F57C00' : '#388E3C',
//             fontSize: '14px'
//           }}>
//             {r.similarity}%
//           </span>
//         </td>
//       </tr>
//     ))}
// </tbody> */}
//             {/* Pairwise Results Table */}
//             <div
//               style={{
//                 overflowX: "auto",
//                 borderRadius: "16px",
//                 border: "1px solid #E0E0E0",
//               }}
//             >
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   fontSize: "15px",
//                 }}
//               >
//                 <thead>
//                   <tr
//                     style={{
//                       background:
//                         "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
//                       color: "white",
//                     }}
//                   >
//                     <th
//                       style={{
//                         padding: "16px",
//                         textAlign: "left",
//                         fontWeight: "600",
//                         borderBottom: "2px solid #1565C0",
//                       }}
//                     >
//                       File 1
//                     </th>
//                     <th
//                       style={{
//                         padding: "16px",
//                         textAlign: "left",
//                         fontWeight: "600",
//                         borderBottom: "2px solid #1565C0",
//                       }}
//                     >
//                       File 2
//                     </th>
//                     <th
//                       style={{
//                         padding: "16px",
//                         textAlign: "center",
//                         fontWeight: "600",
//                         borderBottom: "2px solid #1565C0",
//                       }}
//                     >
//                       Similarity (%)
//                     </th>
//                   </tr>
//                 </thead>
//                 {/* <tbody>

//                   {sortedResults
//                     .filter(r => {
//                       if (activeFilter === "all") return true;
//                       return getColorCategory(r.similarity) === activeFilter;
//                     })
//                     .map((r, index) => (
//                       <tr key={index} style={{
//                         background: index % 2 === 0 ? '#FAFAFA' : 'white',
//                         transition: 'background 0.2s ease'
//                       }}
//                         onMouseEnter={(e) => e.currentTarget.style.background = '#F5F9FF'}
//                         onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#FAFAFA' : 'white'}
//                       >
//                         <td style={{ padding: '16px', borderBottom: '1px solid #E0E0E0', color: '#424242' }}>{r.file1}</td>
//                         <td style={{ padding: '16px', borderBottom: '1px solid #E0E0E0', color: '#424242' }}>{r.file2}</td>
//                         <td style={{
//                           padding: '16px',
//                           borderBottom: '1px solid #E0E0E0',
//                           textAlign: 'center',
//                           fontWeight: '700'
//                         }}>
//                           <span style={{
//                             padding: '6px 16px',
//                             borderRadius: '8px',
//                             background: r.similarity > 75 ? '#FFEBEE' : r.similarity > 40 ? '#FFF3E0' : '#E8F5E9',
//                             color: r.similarity > 75 ? '#D32F2F' : r.similarity > 40 ? '#F57C00' : '#388E3C',
//                             fontSize: '14px'
//                           }}>
//                             {r.similarity}%
//                           </span>
//                         </td>
//                       </tr>
//                     ))}

//                 </tbody> */}

//                 <tbody>
//                   {sortedResults
//                     .filter((r) => {
//                       // First apply heatmap filter
//                       if (
//                         activeFilter !== "all" &&
//                         getColorCategory(r.similarity) !== activeFilter
//                       )
//                         return false;
//                       // Then apply threshold filter
//                       if (threshold && r.similarity < threshold) return false;
//                       return true;
//                     })
//                     .map((r, index) => (
//                       <tr
//                         key={index}
//                         style={{
//                           background: index % 2 === 0 ? "#FAFAFA" : "white",
//                           transition: "background 0.2s ease",
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.background = "#F5F9FF")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.background =
//                             index % 2 === 0 ? "#FAFAFA" : "white")
//                         }
//                       >
//                         <td
//                           style={{
//                             padding: "16px",
//                             borderBottom: "1px solid #E0E0E0",
//                             color: "#424242",
//                           }}
//                         >
//                           {r.file1}
//                         </td>
//                         <td
//                           style={{
//                             padding: "16px",
//                             borderBottom: "1px solid #E0E0E0",
//                             color: "#424242",
//                           }}
//                         >
//                           {r.file2}
//                         </td>
//                         <td
//                           style={{
//                             padding: "16px",
//                             borderBottom: "1px solid #E0E0E0",
//                             textAlign: "center",
//                             fontWeight: "700",
//                           }}
//                         >
//                           <span
//                             style={{
//                               padding: "6px 16px",
//                               borderRadius: "8px",
//                               background:
//                                 r.similarity > 75
//                                   ? "#FFEBEE"
//                                   : r.similarity > 40
//                                   ? "#FFF3E0"
//                                   : "#E8F5E9",
//                               color:
//                                 r.similarity > 75
//                                   ? "#D32F2F"
//                                   : r.similarity > 40
//                                   ? "#F57C00"
//                                   : "#388E3C",
//                               fontSize: "14px",
//                             }}
//                           >
//                             {r.similarity}%
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//             {/* Download Buttons */}
//             <div
//               style={{
//                 display: "flex",
//                 gap: "16px",
//                 justifyContent: "center",
//                 flexWrap: "wrap",
//                 marginTop: "32px",
//               }}
//             >
//               <a
//                 href={`http://localhost:5000/api/download/${result.report_excel}`}
//                 style={{
//                   textDecoration: "none",
//                   padding: "16px 32px",
//                   background:
//                     "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
//                   color: "white",
//                   borderRadius: "12px",
//                   fontSize: "16px",
//                   fontWeight: "600",
//                   boxShadow: "0 4px 16px rgba(41, 121, 255, 0.3)",
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: "10px",
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 <FileSpreadsheet size={20} />
//                 Download Excel Report
//               </a>

//               <a
//                 href={`http://localhost:5000/api/download/${result.report_pdf}`}
//                 style={{
//                   textDecoration: "none",
//                   padding: "16px 32px",
//                   background:
//                     "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
//                   color: "white",
//                   borderRadius: "12px",
//                   fontSize: "16px",
//                   fontWeight: "600",
//                   boxShadow: "0 4px 16px rgba(76, 175, 80, 0.3)",
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: "10px",
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 <Download size={20} />
//                 Download PDF Report
//               </a>
//             </div>
//           </div>
//         )}

//         {/* Features Grid */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//             gap: "24px",
//             marginTop: "48px",
//           }}
//         >
//           <div
//             style={{
//               background: "white",
//               borderRadius: "16px",
//               padding: "24px",
//               boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//               border: "1px solid #F0F0F0",
//             }}
//           >
//             <div
//               style={{
//                 width: "48px",
//                 height: "48px",
//                 background: "#E3F2FD",
//                 borderRadius: "12px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginBottom: "16px",
//               }}
//             >
//               <Shield size={24} color="#2979FF" />
//             </div>
//             <h3
//               style={{
//                 fontSize: "16px",
//                 fontWeight: "700",
//                 color: "#212121",
//                 marginBottom: "8px",
//               }}
//             >
//               Batch Processing
//             </h3>
//             <p style={{ fontSize: "14px", color: "#757575", margin: 0 }}>
//               Analyze multiple Python files simultaneously for comprehensive
//               plagiarism detection
//             </p>
//           </div>

//           <div
//             style={{
//               background: "white",
//               borderRadius: "16px",
//               padding: "24px",
//               boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//               border: "1px solid #F0F0F0",
//             }}
//           >
//             <div
//               style={{
//                 width: "48px",
//                 height: "48px",
//                 background: "#E0F2F1",
//                 borderRadius: "12px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginBottom: "16px",
//               }}
//             >
//               <TrendingUp size={24} color="#00BCD4" />
//             </div>
//             <h3
//               style={{
//                 fontSize: "16px",
//                 fontWeight: "700",
//                 color: "#212121",
//                 marginBottom: "8px",
//               }}
//             >
//               Detailed Reports
//             </h3>
//             <p style={{ fontSize: "14px", color: "#757575", margin: 0 }}>
//               Export comprehensive Excel and PDF reports with pairwise
//               comparisons
//             </p>
//           </div>

//           <div
//             style={{
//               background: "white",
//               borderRadius: "16px",
//               padding: "24px",
//               boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//               border: "1px solid #F0F0F0",
//             }}
//           >
//             <div
//               style={{
//                 width: "48px",
//                 height: "48px",
//                 background: "#F3E5F5",
//                 borderRadius: "12px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginBottom: "16px",
//               }}
//             >
//               <CheckCircle size={24} color="#9C27B0" />
//             </div>
//             <h3
//               style={{
//                 fontSize: "16px",
//                 fontWeight: "700",
//                 color: "#212121",
//                 marginBottom: "8px",
//               }}
//             >
//               High Accuracy
//             </h3>
//             <p style={{ fontSize: "14px", color: "#757575", margin: 0 }}>
//               Advanced algorithms for precise code similarity detection and
//               analysis
//             </p>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }
