import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getClassStreamById, deleteClassStream } from "../services/classStreams";
import { getStudentsByClassStream } from "../services/students";
import { getSubjectsByClassStream, assignSubjectToClassStream, getAllSubjects } from "../services/subjects";

export default function ClassStreamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stream, setStream] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    const fetchStreamDetails = async () => {
      try {
        const streamData = await getClassStreamById(id);
        setStream(streamData);

        const [studentsData, subjectsData, allSubjectsData] = await Promise.all([
          getStudentsByClassStream(id),
          getSubjectsByClassStream(id),
          getAllSubjects(),
        ]);

        setStudents(studentsData || []);
        setSubjects(subjectsData || []);
        setAllSubjects(allSubjectsData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this class stream?")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteClassStream(id);
      navigate("/class-streams");
    } catch (error) {
      console.error("Error deleting class stream:", error);
      alert("Failed to delete class stream. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleAssignSubject = async (e) => {
    e.preventDefault();
    if (!selectedSubject) {
      alert("Please select a subject");
      return;
    }

    setAssigning(true);
    try {
      await assignSubjectToClassStream({
        classStreamId: id,
        subjectCode: selectedSubject,
      });
      alert("Subject assigned successfully");
      setSelectedSubject("");

      // Reload subjects
      const subjectsData = await getSubjectsByClassStream(id);
      setSubjects(subjectsData || []);
    } catch (error) {
      console.error("Error assigning subject:", error);
      alert(error?.response?.data?.message || "Failed to assign subject");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ fontSize: "18px" }}>Loading...</p>
      </div>
    );
  }

  if (!stream) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ fontSize: "18px" }}>Class stream not found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "#333" }}>
          Class Stream Details
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/class-streams")}
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
            {stream.name}
          </h2>
          <p style={{ fontSize: "16px", color: "#6b7280", margin: 0 }}>
            Stream Code: {stream.streamCode}
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
              {stream.createdAt ? new Date(stream.createdAt).toLocaleDateString() : "N/A"}
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
              Number of Students
            </p>
            <p style={{ fontSize: "28px", color: "#1f2937", margin: 0, fontWeight: "700" }}>
              {students?.length || 0}
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
              Number of Subjects
            </p>
            <p style={{ fontSize: "28px", color: "#1f2937", margin: 0, fontWeight: "700" }}>
              {subjects?.length || 0}
            </p>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "600", margin: 0, color: "#1f2937" }}>
              Subjects
            </h3>
          </div>

          <div
            style={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <form onSubmit={handleAssignSubject} style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Assign Subject to Stream
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={assigning}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    outline: "none",
                    backgroundColor: "#fff",
                    cursor: assigning ? "not-allowed" : "pointer",
                  }}
                >
                  <option value="">Select a subject...</option>
                  {(allSubjects || [])
                    .filter((subject) => !(subjects || []).some((s) => s.code === subject.code))
                    .map((subject) => (
                      <option key={subject.id} value={subject.code}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={assigning || !selectedSubject}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#fff",
                  backgroundColor: assigning || !selectedSubject ? "#9ca3af" : "#3b82f6",
                  border: "none",
                  borderRadius: "6px",
                  cursor: assigning || !selectedSubject ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s",
                  height: "42px",
                }}
                onMouseOver={(e) => !assigning && selectedSubject && (e.target.style.backgroundColor = "#2563eb")}
                onMouseOut={(e) => !assigning && selectedSubject && (e.target.style.backgroundColor = "#3b82f6")}
              >
                {assigning ? "Assigning..." : "Assign Subject"}
              </button>
            </form>
          </div>

          {(subjects?.length ?? 0) > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
              {(subjects || []).map((subject) => (
                <div
                  key={subject.id}
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "16px",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  <p style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 4px 0", color: "#1f2937" }}>
                    {subject.name}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                    Code: {subject.code}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "16px", color: "#6b7280", fontStyle: "italic", margin: 0 }}>
              No subjects assigned to this class stream.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
