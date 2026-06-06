import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllStudents,
  getStudentsByClassStream,
  createStudent,
  deleteStudent,
} from "../services/students";

import { getClassStreams } from "../services/classStreams";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classStreams, setClassStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [filterStream, setFilterStream] = useState("");

  const [formData, setFormData] = useState({
    admissionNumber: "",
    firstName: "",
    lastName: "",
    gender: "",
    classStreamId: "",
  });

  const getStreamCode = (streamId) => {
    const stream = classStreams.find((s) => s.id === streamId);
    return stream ? stream.streamCode : "N/A";
  };

  const getStreamName = (streamId) => {
    const stream = classStreams.find((s) => s.id === streamId);
    return stream ? stream.name : "N/A";
  };

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
      alert("Failed to load students");
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
    loadStudents();
    loadClassStreams();
  }, []);

  useEffect(() => {
    if (filterStream) {
      loadFilteredStudents();
    } else {
      loadStudents();
    }
  }, [filterStream]);

  const loadFilteredStudents = async () => {
    try {
      const data = await getStudentsByClassStream(filterStream);
      setStudents(data);
    } catch (error) {
      console.error("Error filtering students:", error);
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
      await createStudent(formData);
      alert("Student registered successfully");

      setFormData({
        admissionNumber: "",
        firstName: "",
        lastName: "",
        gender: "",
        classStreamId: "",
      });

      loadStudents();
    } catch (error) {
      console.error("Error:", error);
      alert(
        error?.response?.data?.message ||
          "Failed to save student"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (admissionNumber) => {
    const confirmed = window.confirm(
      "Delete this student?"
    );

    if (!confirmed) return;

    setDeletingId(admissionNumber);
    try {
      await deleteStudent(admissionNumber);
      alert("Student deleted successfully");
      loadStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 30px 0", color: "#333" }}>
        Student Management
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
          Register New Student
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
              Admission Number
            </label>
            <input
              type="text"
              name="admissionNumber"
              placeholder="ADM001"
              value={formData.admissionNumber}
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
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
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
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
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
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
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
                backgroundColor: "#fff",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
              Class Stream
            </label>
            <select
              name="classStreamId"
              value={formData.classStreamId}
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
                backgroundColor: "#fff",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">Select Class Stream</option>
              {classStreams.map((stream) => (
                <option key={stream.id} value={stream.id}>
                  {stream.name}
                </option>
              ))}
            </select>
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
              {submitting ? "Registering..." : "Register Student"}
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
            All Students ({students.length})
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
              {classStreams.map((stream) => (
                <option key={stream.id} value={stream.id}>
                  {stream.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "16px", color: "#6b7280" }}>Loading...</p>
          </div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "16px", color: "#6b7280", fontStyle: "italic" }}>
              No students found. Register one above.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    Admission Number
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    Name
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    Gender
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    Class Stream
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    style={{ borderBottom: "1px solid #e5e7eb", transition: "backgroundColor 0.2s" }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "16px", fontSize: "14px", color: "#1f2937", fontWeight: "500" }}>
                      {student.admissionNumber}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", color: "#1f2937" }}>
                      {student.firstName} {student.lastName}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", color: "#6b7280" }}>
                      {student.gender}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", color: "#1f2937" }}>
                      {getStreamName(student.classStreamId)} ({getStreamCode(student.classStreamId)})
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <Link
                        to={`/students/${student.admissionNumber}`}
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
                        onClick={() => handleDelete(student.admissionNumber)}
                        disabled={deletingId === student.admissionNumber}
                        style={{
                          padding: "8px 16px",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: deletingId === student.admissionNumber ? "#9ca3af" : "#dc2626",
                          backgroundColor: deletingId === student.admissionNumber ? "#f3f4f6" : "#fef2f2",
                          border: "none",
                          borderRadius: "6px",
                          cursor: deletingId === student.admissionNumber ? "not-allowed" : "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) => deletingId !== student.admissionNumber && (e.target.style.backgroundColor = "#fee2e2")}
                        onMouseOut={(e) => deletingId !== student.admissionNumber && (e.target.style.backgroundColor = "#fef2f2")}
                      >
                        {deletingId === student.admissionNumber ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
