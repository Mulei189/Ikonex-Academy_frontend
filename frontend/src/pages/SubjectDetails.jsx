import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getSubjectByCode, deleteSubject } from "../services/subjects";
import { getClassStreams } from "../services/classStreams";
import { getSubjectsByClassStream } from "../services/subjects";

export default function SubjectDetails() {
  const { subjectCode } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [classStreams, setClassStreams] = useState([]);
  const [assignedStreams, setAssignedStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        const subjectData = await getSubjectByCode(subjectCode);
        setSubject(subjectData);

        const classStreamsData = await getClassStreams();
        setClassStreams(classStreamsData || []);

        // Fetch class streams this subject is assigned to
        const assignedStreamsData = [];
        for (const stream of classStreamsData) {
          try {
            const subjectsInStream = await getSubjectsByClassStream(stream.id);
            if (subjectsInStream.some(s => s.code === subjectCode)) {
              assignedStreamsData.push(stream);
            }
          } catch (error) {
            console.error(`Error checking stream ${stream.id}:`, error);
          }
        }
        setAssignedStreams(assignedStreamsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetails();
  }, [subjectCode]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this subject?")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteSubject(subjectCode);
      navigate("/subjects");
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Failed to delete subject. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ fontSize: "18px" }}>Loading...</p>
      </div>
    );
  }

  if (!subject) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ fontSize: "18px" }}>Subject not found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "#333" }}>
          Subject Details
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/subjects")}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#fff",
              backgroundColor: "#6b7280",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#4b5563")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#6b7280")}
          >
            Back
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#fff",
              backgroundColor: deleting ? "#9ca3af" : "#dc2626",
              border: "none",
              borderRadius: "6px",
              cursor: deleting ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => !deleting && (e.target.style.backgroundColor = "#b91c1c")}
            onMouseOut={(e) => !deleting && (e.target.style.backgroundColor = "#dc2626")}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
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
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 10px 0", color: "#1f2937" }}>
            {subject.name}
          </h2>
          <p style={{ fontSize: "16px", color: "#6b7280", margin: 0 }}>
            Subject Code: {subject.code}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "20px" }}>
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px 0", fontWeight: "500" }}>
              Created
            </p>
            <p style={{ fontSize: "16px", color: "#1f2937", margin: 0, fontWeight: "600" }}>
              {subject.created_at ? new Date(subject.created_at).toLocaleDateString() : "N/A"}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px 0", fontWeight: "500" }}>
              Assigned to Class Streams
            </p>
            <p style={{ fontSize: "28px", color: "#1f2937", margin: 0, fontWeight: "700" }}>
              {assignedStreams.length}
            </p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 15px 0", color: "#1f2937" }}>
            Assigned Class Streams
          </h3>
          {assignedStreams.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
              {assignedStreams.map((stream) => (
                <div
                  key={stream.id}
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <p style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 4px 0", color: "#1f2937" }}>
                    {stream.name}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                    Code: {stream.streamCode}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "16px", color: "#6b7280", fontStyle: "italic", margin: 0 }}>
              This subject is not assigned to any class streams.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
