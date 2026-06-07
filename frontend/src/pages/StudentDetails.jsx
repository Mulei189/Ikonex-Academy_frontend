import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getStudentByAdmissionNumber, deleteStudent } from "../services/students";
import { getClassStreams } from "../services/classStreams";
import { getStudentPerformance } from "../services/assessments";

export default function StudentDetails() {
  const { admissionNumber } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [classStreams, setClassStreams] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const studentData = await getStudentByAdmissionNumber(admissionNumber);
        setStudent(studentData);

        const [classStreamsData, performanceData] = await Promise.all([
          getClassStreams(),
          getStudentPerformance(admissionNumber),
        ]);

        setClassStreams(classStreamsData || []);
        setPerformance(performanceData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [admissionNumber]);

  const getStreamCode = (streamId) => {
    const stream = classStreams.find((s) => s.id === streamId);
    return stream ? stream.streamCode : "N/A";
  };

  const getStreamName = (streamId) => {
    const stream = classStreams.find((s) => s.id === streamId);
    return stream ? stream.name : "N/A";
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteStudent(admissionNumber);
      navigate("/students");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Please try again.");
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

  if (!student) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ fontSize: "18px" }}>Student not found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "#333" }}>
          Student Details
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/students")}
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
            {student.firstName} {student.lastName}
          </h2>
          <p style={{ fontSize: "16px", color: "#6b7280", margin: 0 }}>
            Admission Number: {student.admissionNumber}
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
              Gender
            </p>
            <p style={{ fontSize: "16px", color: "#1f2937", margin: 0, fontWeight: "600" }}>
              {student.gender}
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
              Class Stream
            </p>
            <p style={{ fontSize: "16px", color: "#1f2937", margin: 0, fontWeight: "600" }}>
              {getStreamName(student.classStreamId)}
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>
              ({getStreamCode(student.classStreamId)})
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
              Date of Birth
            </p>
            <p style={{ fontSize: "16px", color: "#1f2937", margin: 0, fontWeight: "600" }}>
              {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A"}
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
              Number of Assessments
            </p>
            <p style={{ fontSize: "28px", color: "#1f2937", margin: 0, fontWeight: "700" }}>
              {performance?.length || 0}
            </p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 15px 0", color: "#1f2937" }}>
            Assessment Performance
          </h3>
          {(performance?.length ?? 0) > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
              {(performance || []).map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <p style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 4px 0", color: "#1f2937" }}>
                    {item.subjectName}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px 0" }}>
                    {item.subjectCode}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "14px", color: "#6b7280" }}>{item.assessmentType}</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>{item.score}</span>
                  </div>
                  {item.grade && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "14px", color: "#6b7280" }}>Grade</span>
                      <span style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>{item.grade}</span>
                    </div>
                  )}
                  {item.remarks && (
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: "8px 0 0 0", fontStyle: "italic" }}>
                      {item.remarks}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "16px", color: "#6b7280", fontStyle: "italic", margin: 0 }}>
              No assessments recorded for this student.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
