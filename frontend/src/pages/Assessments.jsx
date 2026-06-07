import { useEffect, useState } from "react";

import {
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getStudentPerformance,
  getStudentSubjectPerformance,
  getClassPerformance,
  getClassPerformanceComparison,
} from "../services/assessments";

import { getAllStudents, getStudentByAdmissionNumber } from "../services/students";
import { getSubjectsByClassStream, getAllSubjects } from "../services/subjects";
import { getClassStreams } from "../services/classStreams";

export default function Assessments() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [classStreams, setClassStreams] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState("record"); // record, student, class, comparison
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    admissionNumber: "",
    subjectCode: "",
    assessmentType: "CAT1",
    score: "",
  });

  const [viewFormData, setViewFormData] = useState({
    admissionNumber: "",
    subjectCode: "",
    classStreamId: "",
  });

  const [performanceData, setPerformanceData] = useState(null);

  const assessmentTypes = ["CAT1", "CAT2", "MIDTERM", "ENDTERM"];

  // Load data on mount
  useEffect(() => {
    loadStudents();
    loadAllSubjects();
    loadClassStreams();
  }, []);

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

  const loadAllSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setAllSubjects(data);
    } catch (error) {
      console.error("Error loading subjects:", error);
      alert("Failed to load subjects");
    }
  };

  const loadClassStreams = async () => {
    try {
      const data = await getClassStreams();
      setClassStreams(data);
    } catch (error) {
      console.error("Error loading class streams:", error);
      alert("Failed to load class streams");
    }
  };

  // Load subjects for the selected student's class stream
  const loadSubjectsForStudent = async (admissionNumber) => {
    try {
      const student = await getStudentByAdmissionNumber(admissionNumber);
      if (student && student.classStreamId) {
        const data = await getSubjectsByClassStream(student.classStreamId);
        setSubjects(data);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error("Error loading subjects for student:", error);
      setSubjects([]);
    }
  };

  // Load subjects for the selected class stream
  const loadSubjectsForClassStream = async (classStreamId) => {
    try {
      if (classStreamId) {
        const data = await getSubjectsByClassStream(classStreamId);
        setSubjects(data);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error("Error loading subjects for class stream:", error);
      setSubjects([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // When student is selected, load their class stream subjects
    if (name === "admissionNumber" && value) {
      loadSubjectsForStudent(value);
      // Reset subject selection when student changes
      setFormData(prev => ({ ...prev, subjectCode: "" }));
    }
  };

  const viewHandleChange = (e) => {
    const { name, value } = e.target;
    setViewFormData({
      ...viewFormData,
      [name]: value,
    });

    // When student is selected in student performance view, load their class stream subjects
    if (name === "admissionNumber" && value) {
      loadSubjectsForStudent(value);
      // Reset subject selection when student changes
      setViewFormData(prev => ({ ...prev, subjectCode: "" }));
    }

    // When class stream is selected in class performance view, load their subjects
    if (name === "classStreamId" && value) {
      loadSubjectsForClassStream(value);
      // Reset subject selection when class stream changes
      setViewFormData(prev => ({ ...prev, subjectCode: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const score = parseInt(formData.score, 10);
      const data = {
        ...formData,
        score,
      };

      if (isEditing && selectedAssessment) {
        await updateAssessment(selectedAssessment.id, { score });
        alert("Assessment updated successfully");
      } else {
        await createAssessment(data);
        alert("Assessment recorded successfully");
      }

      resetForm();
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to save assessment";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewStudentPerformance = async (e) => {
    e.preventDefault();

    try {
      if (viewFormData.subjectCode) {
        const data = await getStudentSubjectPerformance(
          viewFormData.admissionNumber,
          viewFormData.subjectCode
        );
        setPerformanceData(data);
      } else {
        const data = await getStudentPerformance(viewFormData.admissionNumber);
        setPerformanceData(data);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch performance data";
      alert(errorMessage);
    }
  };

  const handleViewClassPerformance = async (e) => {
    e.preventDefault();

    try {
      const data = await getClassPerformance(
        viewFormData.classStreamId,
        viewFormData.subjectCode
      );
      setPerformanceData(data);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch class performance data";
      alert(errorMessage);
    }
  };

  const handleViewClassComparison = async (e) => {
    e.preventDefault();

    try {
      const data = await getClassPerformanceComparison(viewFormData.subjectCode);
      setPerformanceData(data);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch class comparison data";
      alert(errorMessage);
    }
  };

  const handleEdit = (assessment) => {
    setSelectedAssessment(assessment);
    setFormData({
      admissionNumber: "",
      subjectCode: "",
      assessmentType: assessment.assessmentType,
      score: assessment.score,
    });
    setIsEditing(true);
    setViewMode("record");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this assessment?");

    if (!confirmed) return;

    setDeletingId(id);
    try {
      await deleteAssessment(id);
      alert("Assessment deleted successfully");
      if (performanceData) {
        // Reload current view
        if (viewMode === "student") {
          handleViewStudentPerformance({ preventDefault: () => {} });
        } else if (viewMode === "class") {
          handleViewClassPerformance({ preventDefault: () => {} });
        }
      }
    } catch (error) {
      console.error("Error deleting assessment:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete assessment";
      alert(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      admissionNumber: "",
      subjectCode: "",
      assessmentType: "CAT1",
      score: "",
    });
    setSubjects([]);
    setSelectedAssessment(null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 30px 0", color: "#333" }}>
        Student Assessment and Scoring
      </h1>

      {/* View Mode Selector */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
        <button
          style={{
            padding: "12px 24px",
            border: viewMode === "record" ? "2px solid #4CAF50" : "1px solid #ddd",
            backgroundColor: viewMode === "record" ? "#4CAF50" : "white",
            color: viewMode === "record" ? "white" : "#333",
            cursor: "pointer",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: viewMode === "record" ? "600" : "400",
            transition: "all 0.2s",
          }}
          onClick={() => {
            setViewMode("record");
            resetForm();
            setPerformanceData(null);
          }}
        >
          Record Scores
        </button>
        <button
          style={{
            padding: "12px 24px",
            border: viewMode === "student" ? "2px solid #2196F3" : "1px solid #ddd",
            backgroundColor: viewMode === "student" ? "#2196F3" : "white",
            color: viewMode === "student" ? "white" : "#333",
            cursor: "pointer",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: viewMode === "student" ? "600" : "400",
            transition: "all 0.2s",
          }}
          onClick={() => {
            setViewMode("student");
            resetForm();
            setPerformanceData(null);
          }}
        >
          Student Performance
        </button>
        <button
          style={{
            padding: "12px 24px",
            border: viewMode === "class" ? "2px solid #FF9800" : "1px solid #ddd",
            backgroundColor: viewMode === "class" ? "#FF9800" : "white",
            color: viewMode === "class" ? "white" : "#333",
            cursor: "pointer",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: viewMode === "class" ? "600" : "400",
            transition: "all 0.2s",
          }}
          onClick={() => {
            setViewMode("class");
            resetForm();
            setPerformanceData(null);
          }}
        >
          Class Performance
        </button>
        <button
          style={{
            padding: "12px 24px",
            border: viewMode === "comparison" ? "2px solid #9C27B0" : "1px solid #ddd",
            backgroundColor: viewMode === "comparison" ? "#9C27B0" : "white",
            color: viewMode === "comparison" ? "white" : "#333",
            cursor: "pointer",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: viewMode === "comparison" ? "600" : "400",
            transition: "all 0.2s",
          }}
          onClick={() => {
            setViewMode("comparison");
            resetForm();
            setPerformanceData(null);
          }}
        >
          Class Comparison
        </button>
      </div>

      {/* Record Assessment Form */}
      {viewMode === "record" && (
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 24px 0", color: "#333" }}>
            {isEditing ? "Edit Assessment Score" : "Record Assessment Score"}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
            {!isEditing && (
              <>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>
                    Student *
                  </label>
                  <select
                    name="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="">Select Student</option>
                    {(students || []).map((student) => (
                      <option key={student.id} value={student.admissionNumber}>
                        {student.firstName} {student.lastName} ({student.admissionNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>
                    Subject *
                  </label>
                  <select
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleChange}
                    required
                    disabled={!formData.admissionNumber}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: !formData.admissionNumber ? "#f5f5f5" : "white",
                      cursor: !formData.admissionNumber ? "not-allowed" : "pointer",
                    }}
                  >
                    <option value="">
                      {formData.admissionNumber ? "Select Subject" : "Select a student first"}
                    </option>
                    {(subjects || []).map((subject) => (
                      <option key={subject.id} value={subject.code}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>
                    Assessment Type *
                  </label>
                  <select
                    name="assessmentType"
                    value={formData.assessmentType}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "white",
                    }}
                  >
                    {(assessmentTypes || []).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>
                Score (0-100) *
              </label>
              <input
                type="number"
                name="score"
                placeholder="Enter score"
                value={formData.score}
                onChange={handleChange}
                min="0"
                max="100"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                  transition: "all 0.2s",
                }}
              >
                {submitting ? "Saving..." : isEditing ? "Update" : "Record"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Student Performance View */}
      {viewMode === "student" && (
        <>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
              padding: "30px",
              marginBottom: "30px",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 24px 0", color: "#333" }}>
              View Student Performance
            </h2>

            <form onSubmit={handleViewStudentPerformance} style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>
                  Student *
                </label>
                <select
                  name="admissionNumber"
                  value={viewFormData.admissionNumber}
                  onChange={viewHandleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "white",
                  }}
                >
                  <option value="">Select Student</option>
                  {(students || []).map((student) => (
                    <option key={student.id} value={student.admissionNumber}>
                      {student.firstName} {student.lastName} ({student.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>
                  Subject (Optional)
                </label>
                <select
                  name="subjectCode"
                  value={viewFormData.subjectCode}
                  onChange={viewHandleChange}
                  disabled={!viewFormData.admissionNumber}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: !viewFormData.admissionNumber ? "#f5f5f5" : "white",
                    cursor: !viewFormData.admissionNumber ? "not-allowed" : "pointer",
                  }}
                >
                  <option value="">
                    {viewFormData.admissionNumber ? "All Subjects" : "Select a student first"}
                  </option>
                  {(subjects || []).map((subject) => (
                    <option key={subject.id} value={subject.code}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginTop: "8px",
                }}
              >
                View Performance
              </button>
            </form>
          </div>

          {performanceData && (performanceData?.length ?? 0) > 0 && (
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                padding: "30px",
                marginBottom: "30px",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 20px 0", color: "#333" }}>
                Student Performance Results
              </h3>

              {/* Check if data is grouped by subject (new format) or flat (old format) */}
              {performanceData && performanceData[0]?.assessments ? (
                (performanceData || []).map((subjectData, index) => (
                  <div key={index} style={{ marginBottom: "30px", paddingBottom: "30px", borderBottom: index < performanceData.length - 1 ? "1px solid #eee" : "none" }}>
                    <div style={{ marginBottom: "16px" }}>
                      <h4 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 8px 0", color: "#333" }}>
                        {subjectData.subjectName} ({subjectData.subjectCode})
                      </h4>
                      {subjectData.weightedMean !== null && (
                        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "16px", color: "#555" }}>
                            Weighted Mean: <strong style={{ color: "#2196F3", fontSize: "18px" }}>{subjectData.weightedMean}</strong>
                          </span>
                          {subjectData.grade && (
                            <span style={{ 
                              padding: "4px 12px", 
                              backgroundColor: "#E3F2FD", 
                              color: "#1976D2", 
                              borderRadius: "12px", 
                              fontSize: "14px", 
                              fontWeight: "600" 
                            }}>
                              Grade: {subjectData.grade}
                            </span>
                          )}
                          {subjectData.remarks && (
                            <span style={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}>
                              {subjectData.remarks}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f5f5f5" }}>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Assessment Type</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Score</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Weight</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(subjectData?.assessments || []).map((assessment, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #eee", backgroundColor: idx % 2 === 0 ? "#fafafa" : "white" }}>
                            <td style={{ padding: "12px" }}>{assessment.assessmentType}</td>
                            <td style={{ padding: "12px", fontWeight: "500" }}>{assessment.score}</td>
                            <td style={{ padding: "12px", color: "#666" }}>
                              {assessment.assessmentType === "CAT1" || assessment.assessmentType === "CAT2" ? "15%" : 
                               assessment.assessmentType === "MIDTERM" ? "20%" : "50%"}
                            </td>
                            <td style={{ padding: "12px" }}>
                              <button
                                onClick={() => handleEdit(assessment)}
                                disabled={deletingId === assessment.id}
                                style={{
                                  padding: "6px 12px",
                                  backgroundColor: "#2196F3",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  cursor: deletingId === assessment.id ? "not-allowed" : "pointer",
                                  opacity: deletingId === assessment.id ? 0.6 : 1,
                                  marginRight: "8px",
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(assessment.id)}
                                disabled={deletingId === assessment.id}
                                style={{
                                  padding: "6px 12px",
                                  backgroundColor: "#f44336",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  cursor: deletingId === assessment.id ? "not-allowed" : "pointer",
                                  opacity: deletingId === assessment.id ? 0.6 : 1,
                                }}
                              >
                                {deletingId === assessment.id ? "Deleting..." : "Delete"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Subject</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Assessment Type</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Score</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Grade</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Remarks</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(performanceData || []).map((item, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #eee", backgroundColor: index % 2 === 0 ? "#fafafa" : "white" }}>
                        <td style={{ padding: "12px" }}>{item.subjectName || item.subjectCode || "-"}</td>
                        <td style={{ padding: "12px" }}>{item.assessmentType}</td>
                        <td style={{ padding: "12px", fontWeight: "500" }}>{item.score}</td>
                        <td style={{ padding: "12px", fontWeight: "600", color: "#2196F3" }}>{item.grade || "-"}</td>
                        <td style={{ padding: "12px", color: "#666" }}>{item.remarks || "-"}</td>
                        <td style={{ padding: "12px" }}>
                          <button
                            onClick={() => handleEdit(item)}
                            disabled={deletingId === item.id}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#2196F3",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
                              cursor: deletingId === item.id ? "not-allowed" : "pointer",
                              opacity: deletingId === item.id ? 0.6 : 1,
                              marginRight: "8px",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#f44336",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
                              cursor: deletingId === item.id ? "not-allowed" : "pointer",
                              opacity: deletingId === item.id ? 0.6 : 1,
                            }}
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {performanceData && (performanceData?.length ?? 0) === 0 && (
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                padding: "30px",
                textAlign: "center",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              No performance data found
            </div>
          )}
        </>
      )}

      {/* Class Performance View */}
      {viewMode === "class" && (
        <>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
              padding: "30px",
              marginBottom: "30px",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 24px 0", color: "#333" }}>
              View Class Performance
            </h2>

            <form onSubmit={handleViewClassPerformance} style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>
                  Class Stream *
                </label>
                <select
                  name="classStreamId"
                  value={viewFormData.classStreamId}
                  onChange={viewHandleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "white",
                  }}
                >
                  <option value="">Select Class Stream</option>
                  {classStreams.map((stream) => (
                    <option key={stream.id} value={stream.id}>
                      {stream.name} ({stream.streamCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>
                  Subject *
                </label>
                <select
                  name="subjectCode"
                  value={viewFormData.subjectCode}
                  onChange={viewHandleChange}
                  required
                  disabled={!viewFormData.classStreamId}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: !viewFormData.classStreamId ? "#f5f5f5" : "white",
                    cursor: !viewFormData.classStreamId ? "not-allowed" : "pointer",
                  }}
                >
                  <option value="">
                    {viewFormData.classStreamId ? "Select Subject" : "Select a class stream first"}
                  </option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.code}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#FF9800",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginTop: "8px",
                }}
              >
                View Performance
              </button>
            </form>
          </div>

          {performanceData && (performanceData?.length ?? 0) > 0 && (
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                padding: "30px",
                marginBottom: "30px",
                overflowX: "auto",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 20px 0", color: "#333" }}>
                Class Performance Results
              </h3>

              {/* Check if data has weighted mean (new format) or flat (old format) */}
              {performanceData[0]?.assessments ? (
                // New format with weighted mean
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "800px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Student</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Admission No.</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>CAT1</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>CAT2</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>MIDTERM</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>ENDTERM</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Weighted Mean</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Grade</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Remarks</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((studentData, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #eee", backgroundColor: index % 2 === 0 ? "#fafafa" : "white" }}>
                        <td style={{ padding: "12px", fontWeight: "500" }}>
                          {studentData.firstName} {studentData.lastName}
                        </td>
                        <td style={{ padding: "12px" }}>{studentData.admissionNumber}</td>
                        <td style={{ padding: "12px" }}>
                          {studentData.assessments.find(a => a.assessmentType === "CAT1")?.score || "-"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {studentData.assessments.find(a => a.assessmentType === "CAT2")?.score || "-"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {studentData.assessments.find(a => a.assessmentType === "MIDTERM")?.score || "-"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {studentData.assessments.find(a => a.assessmentType === "ENDTERM")?.score || "-"}
                        </td>
                        <td style={{ padding: "12px", fontWeight: "600", color: "#2196F3" }}>
                          {studentData.weightedMean !== null ? studentData.weightedMean : "-"}
                        </td>
                        <td style={{ padding: "12px", fontWeight: "600", color: "#1976D2" }}>
                          {studentData.grade || "-"}
                        </td>
                        <td style={{ padding: "12px", color: "#666", fontStyle: "italic" }}>
                          {studentData.remarks || "-"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {studentData.assessments.map((assessment, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleEdit(assessment)}
                              disabled={deletingId === assessment.id}
                              style={{
                                padding: "4px 8px",
                                backgroundColor: "#2196F3",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "11px",
                                cursor: deletingId === assessment.id ? "not-allowed" : "pointer",
                                opacity: deletingId === assessment.id ? 0.6 : 1,
                                marginRight: "4px",
                                marginBottom: "4px",
                              }}
                            >
                              {assessment.assessmentType}
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              const firstAssessment = studentData.assessments[0];
                              if (firstAssessment) handleDelete(firstAssessment.id);
                            }}
                            disabled={deletingId !== null}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#f44336",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "11px",
                              cursor: deletingId !== null ? "not-allowed" : "pointer",
                              opacity: deletingId !== null ? 0.6 : 1,
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // Old format (flat list)
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "800px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Student</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Admission Number</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Assessment Type</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Score</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Grade</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Remarks</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((item, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #eee", backgroundColor: index % 2 === 0 ? "#fafafa" : "white" }}>
                        <td style={{ padding: "12px", fontWeight: "500" }}>
                          {item.firstName} {item.lastName}
                        </td>
                        <td style={{ padding: "12px" }}>{item.admissionNumber}</td>
                        <td style={{ padding: "12px" }}>{item.assessmentType}</td>
                        <td style={{ padding: "12px", fontWeight: "500" }}>{item.score}</td>
                        <td style={{ padding: "12px", fontWeight: "600", color: "#2196F3" }}>{item.grade || "-"}</td>
                        <td style={{ padding: "12px", color: "#666" }}>{item.remarks || "-"}</td>
                        <td style={{ padding: "12px" }}>
                          <button
                            onClick={() => handleEdit(item)}
                            disabled={deletingId === item.id}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#2196F3",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
                              cursor: deletingId === item.id ? "not-allowed" : "pointer",
                              opacity: deletingId === item.id ? 0.6 : 1,
                              marginRight: "8px",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#f44336",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
                              cursor: deletingId === item.id ? "not-allowed" : "pointer",
                              opacity: deletingId === item.id ? 0.6 : 1,
                            }}
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {performanceData && (performanceData?.length ?? 0) === 0 && (
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                padding: "30px",
                textAlign: "center",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              No performance data found
            </div>
          )}
        </>
      )}

      {/* Class Comparison View */}
      {viewMode === "comparison" && (
        <>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
              padding: "30px",
              marginBottom: "30px",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 24px 0", color: "#333" }}>
              View Class Performance Comparison
            </h2>

            <form onSubmit={handleViewClassComparison} style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>
                  Subject *
                </label>
                <select
                  name="subjectCode"
                  value={viewFormData.subjectCode}
                  onChange={viewHandleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "white",
                  }}
                >
                  <option value="">Select Subject</option>
                  {allSubjects.map((subject) => (
                    <option key={subject.id} value={subject.code}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#9C27B0",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginTop: "8px",
                }}
              >
                Compare Classes
              </button>
            </form>
          </div>

          {performanceData && (performanceData?.length ?? 0) > 0 && (
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                padding: "30px",
                marginBottom: "30px",
                overflowX: "auto",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 20px 0", color: "#333" }}>
                Class Performance Comparison Results
              </h3>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "900px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Rank</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Class</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Stream</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Student Count</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Class Mean</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600", color: "#333" }}>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((classData, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #eee", backgroundColor: index % 2 === 0 ? "#fafafa" : "white" }}>
                      <td style={{ padding: "12px", fontWeight: "600", color: "#9C27B0" }}>
                        #{classData.rank}
                      </td>
                      <td style={{ padding: "12px", fontWeight: "500" }}>
                        {classData.className}
                      </td>
                      <td style={{ padding: "12px" }}>{classData.streamName}</td>
                      <td style={{ padding: "12px" }}>{classData.studentCount}</td>
                      <td style={{ padding: "12px", fontWeight: "600", color: "#2196F3", fontSize: "16px" }}>
                        {classData.classMean !== null ? classData.classMean : "N/A"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {classData.classMean !== null ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div
                              style={{
                                width: "100px",
                                height: "8px",
                                backgroundColor: "#e0e0e0",
                                borderRadius: "4px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${Math.min(classData.classMean, 100)}%`,
                                  height: "100%",
                                  backgroundColor: classData.classMean >= 70 ? "#4CAF50" : classData.classMean >= 50 ? "#FF9800" : "#f44336",
                                  transition: "width 0.3s",
                                }}
                              />
                            </div>
                            <span style={{ fontSize: "12px", color: "#666" }}>
                              {classData.classMean >= 70 ? "Excellent" : classData.classMean >= 50 ? "Good" : "Needs Improvement"}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: "#999", fontStyle: "italic" }}>No data</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {performanceData && (performanceData?.length ?? 0) === 0 && (
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                padding: "30px",
                textAlign: "center",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              No comparison data found
            </div>
          )}
        </>
      )}
    </div>
  );
}
