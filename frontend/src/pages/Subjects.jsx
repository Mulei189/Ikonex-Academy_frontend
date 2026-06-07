import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllSubjects,
  getSubjectsByClassStream,
  createSubject,
  deleteSubject,
} from "../services/subjects";

import { getClassStreams } from "../services/classStreams";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [classStreams, setClassStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingCode, setDeletingCode] = useState(null);
  const [filterStream, setFilterStream] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    subjectCode: "",
    name: "",
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubjects = subjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subjects.length / itemsPerPage);

  const loadSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Error loading subjects:", error);
      alert("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const loadClassStreams = async () => {
    try {
      const data = await getClassStreams();
      setClassStreams(data);
    } catch (error) {
      console.error("Error loading class streams:", error);
    }
  };

  useEffect(() => {
    loadSubjects();
    loadClassStreams();
  }, []);

  useEffect(() => {
    if (filterStream) {
      loadFilteredSubjects();
    } else {
      loadSubjects();
    }
    setCurrentPage(1);
  }, [filterStream]);

  const loadFilteredSubjects = async () => {
    try {
      const data = await getSubjectsByClassStream(filterStream);
      setSubjects(data);
    } catch (error) {
      console.error("Error filtering subjects:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createSubject(formData);
      alert("Subject created successfully");

      setFormData({
        subjectCode: "",
        name: "",
      });

      loadSubjects();
    } catch (error) {
      console.error("Error:", error);
      alert(error?.response?.data?.message || "Failed to save subject");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (subjectCode) => {
    const confirmed = window.confirm("Delete this subject?");

    if (!confirmed) return;

    setDeletingCode(subjectCode);
    try {
      await deleteSubject(subjectCode);
      alert("Subject deleted successfully");
      loadSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Failed to delete subject");
    } finally {
      setDeletingCode(null);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 30px 0", color: "#333" }}>
        Subject Management
      </h1>

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          padding: "30px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 20px 0", color: "#1f2937" }}>
          Create New Subject
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
              Subject Code
            </label>
            <input
              type="text"
              name="subjectCode"
              placeholder="MATH"
              value={formData.subjectCode}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
              Subject Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Mathematics"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#fff",
                backgroundColor: submitting ? "#9ca3af" : "#3b82f6",
                border: "none",
                borderRadius: "6px",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
                height: "42px",
                width: "100%",
              }}
              onMouseOver={(e) => !submitting && (e.target.style.backgroundColor = "#2563eb")}
              onMouseOut={(e) => !submitting && (e.target.style.backgroundColor = "#3b82f6")}
            >
              {submitting ? "Creating..." : "Create Subject"}
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          padding: "30px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", margin: 0, color: "#1f2937" }}>
            All Subjects ({subjects?.length || 0})
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
              Filter by Class Stream:
            </label>
            <select
              value={filterStream}
              onChange={(e) => setFilterStream(e.target.value)}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                outline: "none",
                backgroundColor: "#fff",
              }}
            >
              <option value="">All Streams</option>
              {(classStreams || []).map((stream) => (
                <option key={stream.id} value={stream.id}>
                  {stream.name} ({stream.streamCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "16px", color: "#6b7280" }}>Loading...</p>
          </div>
        ) : (subjects?.length ?? 0) === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "16px", color: "#6b7280", fontStyle: "italic" }}>
              No subjects found. Create one above.
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                      Subject Code
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                      Subject Name
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                      Created
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(currentSubjects || []).map((subject) => (
                    <tr
                      key={subject.id}
                      style={{ borderBottom: "1px solid #e5e7eb", transition: "backgroundColor 0.2s" }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={{ padding: "16px", fontSize: "14px", color: "#1f2937", fontWeight: "500" }}>
                        {subject.code}
                      </td>
                      <td style={{ padding: "16px", fontSize: "14px", color: "#1f2937" }}>
                        {subject.name}
                      </td>
                      <td style={{ padding: "16px", fontSize: "14px", color: "#6b7280" }}>
                        {subject.created_at ? new Date(subject.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <Link
                          to={`/subjects/${subject.code}`}
                          style={{
                            display: "inline-block",
                            padding: "8px 16px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#3b82f6",
                            backgroundColor: "#eff6ff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            textDecoration: "none",
                            marginRight: "8px",
                            transition: "background-color 0.2s",
                          }}
                          onMouseOver={(e) => (e.target.style.backgroundColor = "#dbeafe")}
                          onMouseOut={(e) => (e.target.style.backgroundColor = "#eff6ff")}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(subject.code)}
                          disabled={deletingCode === subject.code}
                          style={{
                            padding: "8px 16px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: deletingCode === subject.code ? "#9ca3af" : "#dc2626",
                            backgroundColor: deletingCode === subject.code ? "#f3f4f6" : "#fef2f2",
                            border: "none",
                            borderRadius: "6px",
                            cursor: deletingCode === subject.code ? "not-allowed" : "pointer",
                            transition: "background-color 0.2s",
                          }}
                          onMouseOver={(e) => deletingCode !== subject.code && (e.target.style.backgroundColor = "#fee2e2")}
                          onMouseOut={(e) => deletingCode !== subject.code && (e.target.style.backgroundColor = "#fef2f2")}
                        >
                          {deletingCode === subject.code ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginTop: "20px",
              }}
            >
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  style={{
                    padding: "8px 12px",
                    background:
                      currentPage === index + 1
                        ? "#6d28d9"
                        : "#ffffff",
                    color:
                      currentPage === index + 1
                        ? "#ffffff"
                        : "#000000",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
