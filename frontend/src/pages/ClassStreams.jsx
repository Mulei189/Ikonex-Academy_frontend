import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getClassStreams,
  createClassStream,
  deleteClassStream,
} from "../services/classStreams";

export default function ClassStreams() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    streamCode: "",
    name: "",
  });

  const loadStreams = async () => {
    try {
      const streams = await getClassStreams();
      setStreams(streams);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStreams();
  }, []);

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
      await createClassStream(formData);

      setFormData({
        streamCode: "",
        name: "",
      });

      loadStreams();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to create stream"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this class stream?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    try {
      await deleteClassStream(id);
      loadStreams();
    } catch (error) {
      console.error(error);
      alert("Failed to delete class stream");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 30px 0", color: "#333" }}>
        Class Streams
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
          Add New Class Stream
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "15px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
              Stream Code
            </label>
            <input
              type="text"
              name="streamCode"
              placeholder="F1A"
              value={formData.streamCode}
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

          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Form 1A"
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
            }}
            onMouseOver={(e) => !submitting && (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => !submitting && (e.target.style.backgroundColor = "#3b82f6")}
          >
            {submitting ? "Adding..." : "Add Stream"}
          </button>
        </form>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          padding: "30px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 20px 0", color: "#1f2937" }}>
          All Class Streams ({Array.isArray(streams) ? streams.length : 0})
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "16px", color: "#6b7280" }}>Loading...</p>
          </div>
        ) : (streams?.length ?? 0) === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "16px", color: "#6b7280", fontStyle: "italic" }}>
              No class streams found. Add one above.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    Stream Code
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    Name
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
                {streams.map((stream) => (
                  <tr
                    key={stream.id}
                    style={{ borderBottom: "1px solid #e5e7eb", transition: "backgroundColor 0.2s" }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "16px", fontSize: "14px", color: "#1f2937", fontWeight: "500" }}>
                      {stream.streamCode}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", color: "#1f2937" }}>
                      {stream.name}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", color: "#6b7280" }}>
                      {stream.createdAt ? new Date(stream.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <Link
                        to={`/class-streams/${stream.id}`}
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
                        onClick={() => handleDelete(stream.id)}
                        disabled={deletingId === stream.id}
                        style={{
                          padding: "8px 16px",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: deletingId === stream.id ? "#9ca3af" : "#dc2626",
                          backgroundColor: deletingId === stream.id ? "#f3f4f6" : "#fef2f2",
                          border: "none",
                          borderRadius: "6px",
                          cursor: deletingId === stream.id ? "not-allowed" : "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) => deletingId !== stream.id && (e.target.style.backgroundColor = "#fee2e2")}
                        onMouseOut={(e) => deletingId !== stream.id && (e.target.style.backgroundColor = "#fef2f2")}
                      >
                        {deletingId === stream.id ? "Deleting..." : "Delete"}
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
