import { useEffect, useState } from "react";

import {
  getStudentResult,
  getStudentRank,
  getClassResults,
  getClassPositions,
  getSubjectPositions,
} from "../services/results";

import { getAllStudents } from "../services/students";
import { getSubjectsByClassStream, getAllSubjects } from "../services/subjects";
import { getClassStreams } from "../services/classStreams";

export default function Results() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [classStreams, setClassStreams] = useState([]);
  const [viewMode, setViewMode] = useState("student"); // student, class, positions, subject-positions, rank

  const [viewFormData, setViewFormData] = useState({
    admissionNumber: "",
    classStreamId: "",
    subjectCode: "",
  });

  const [resultData, setResultData] = useState(null);

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

  const loadSubjectsForStudent = async (admissionNumber) => {
    try {
      const student = students.find(s => s.admissionNumber === admissionNumber);
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

  const viewHandleChange = (e) => {
    const { name, value } = e.target;
    setViewFormData({
      ...viewFormData,
      [name]: value,
    });

    if (name === "admissionNumber" && value) {
      loadSubjectsForStudent(value);
      setViewFormData(prev => ({ ...prev, subjectCode: "" }));
    }

    if (name === "classStreamId" && value) {
      loadSubjectsForClassStream(value);
      setViewFormData(prev => ({ ...prev, subjectCode: "" }));
    }
  };

  const handleViewStudentResult = async (e) => {
    e.preventDefault();

    try {
      const data = await getStudentResult(viewFormData.admissionNumber);
      setResultData(data);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch student result";
      alert(errorMessage);
    }
  };

  const handleViewClassResults = async (e) => {
    e.preventDefault();

    try {
      const data = await getClassResults(viewFormData.classStreamId);
      setResultData(data);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch class results";
      alert(errorMessage);
    }
  };

  const handleViewClassPositions = async (e) => {
    e.preventDefault();

    try {
      const data = await getClassPositions(viewFormData.classStreamId);
      setResultData(data);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch class positions";
      alert(errorMessage);
    }
  };

  const handleViewSubjectPositions = async (e) => {
    e.preventDefault();

    try {
      const data = await getSubjectPositions(viewFormData.classStreamId, viewFormData.subjectCode);
      setResultData(data);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch subject positions";
      alert(errorMessage);
    }
  };

  const handleViewStudentRank = async (e) => {
    e.preventDefault();

    try {
      const data = await getStudentRank(viewFormData.admissionNumber);
      setResultData(data);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch student rank";
      alert(errorMessage);
    }
  };

  const resetView = () => {
    setViewFormData({
      admissionNumber: "",
      classStreamId: "",
      subjectCode: "",
    });
    setSubjects([]);
    setResultData(null);
  };

  return (
    <>
      <h1 className="page-title">Results Processing</h1>

      {/* View Mode Selector */}
      <div className="view-mode-selector">
        <button
          className={viewMode === "student" ? "active" : ""}
          onClick={() => {
            setViewMode("student");
            resetView();
          }}
        >
          Student Result
        </button>
        <button
          className={viewMode === "class" ? "active" : ""}
          onClick={() => {
            setViewMode("class");
            resetView();
          }}
        >
          Class Results
        </button>
        <button
          className={viewMode === "positions" ? "active" : ""}
          onClick={() => {
            setViewMode("positions");
            resetView();
          }}
        >
          Class Positions
        </button>
        <button
          className={viewMode === "subject-positions" ? "active" : ""}
          onClick={() => {
            setViewMode("subject-positions");
            resetView();
          }}
        >
          Subject Positions
        </button>
        <button
          className={viewMode === "rank" ? "active" : ""}
          onClick={() => {
            setViewMode("rank");
            resetView();
          }}
        >
          Student Rank
        </button>
      </div>

      {/* Student Result View */}
      {viewMode === "student" && (
        <>
          <form className="form" onSubmit={handleViewStudentResult}>
            <h2>View Student Result</h2>

            <div>
              <label>Student *</label>
              <select
                name="admissionNumber"
                value={viewFormData.admissionNumber}
                onChange={viewHandleChange}
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.admissionNumber}>
                    {student.firstName} {student.lastName} ({student.admissionNumber})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit">View Result</button>
          </form>

          {resultData && (
            <div className="result-card">
              <h3>Student Information</h3>
              <div className="student-info">
                <p><strong>Name:</strong> {resultData.student.firstName} {resultData.student.lastName}</p>
                <p><strong>Admission Number:</strong> {resultData.student.admissionNumber}</p>
              </div>

              <h3>Subject Results</h3>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Code</th>
                      <th>Total Score</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultData.subjects.map((subject, index) => (
                      <tr key={index}>
                        <td>{subject.subjectName}</td>
                        <td>{subject.subjectCode}</td>
                        <td>{subject.totalScore}</td>
                        <td className="grade-cell">{subject.grade || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3>Overall Performance</h3>
              <div className="overall-performance">
                <p><strong>Total Marks:</strong> {resultData.totalMarks}</p>
                <p><strong>Average Score:</strong> {resultData.averageScore.toFixed(2)}</p>
                <p><strong>Overall Grade:</strong> <span className="grade-cell">{resultData.grade || "-"}</span></p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Class Results View */}
      {viewMode === "class" && (
        <>
          <form className="form" onSubmit={handleViewClassResults}>
            <h2>View Class Results</h2>

            <div>
              <label>Class Stream *</label>
              <select
                name="classStreamId"
                value={viewFormData.classStreamId}
                onChange={viewHandleChange}
                required
              >
                <option value="">Select Class Stream</option>
                {classStreams.map((stream) => (
                  <option key={stream.id} value={stream.id}>
                    {stream.name} ({stream.streamCode})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit">View Results</button>
          </form>

          {resultData && resultData.length > 0 && (
            <div className="table-wrapper">
              <h3>Class Results</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Admission Number</th>
                    <th>Total Marks</th>
                    <th>Average Score</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((result, index) => (
                    <tr key={index}>
                      <td>{result.student.firstName} {result.student.lastName}</td>
                      <td>{result.student.admissionNumber}</td>
                      <td>{result.totalMarks}</td>
                      <td>{result.averageScore.toFixed(2)}</td>
                      <td className="grade-cell">{result.grade || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {resultData && resultData.length === 0 && (
            <p className="no-data">No results found for this class</p>
          )}
        </>
      )}

      {/* Class Positions View */}
      {viewMode === "positions" && (
        <>
          <form className="form" onSubmit={handleViewClassPositions}>
            <h2>View Class Positions</h2>

            <div>
              <label>Class Stream *</label>
              <select
                name="classStreamId"
                value={viewFormData.classStreamId}
                onChange={viewHandleChange}
                required
              >
                <option value="">Select Class Stream</option>
                {classStreams.map((stream) => (
                  <option key={stream.id} value={stream.id}>
                    {stream.name} ({stream.streamCode})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit">View Positions</button>
          </form>

          {resultData && resultData.length > 0 && (
            <div className="table-wrapper">
              <h3>Class Rankings</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Student</th>
                    <th>Admission Number</th>
                    <th>Total Marks</th>
                    <th>Average Score</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((student, index) => (
                    <tr key={index}>
                      <td className="position-cell">{student.position}</td>
                      <td>{student.firstName} {student.lastName}</td>
                      <td>{student.admissionNumber}</td>
                      <td>{student.totalMarks}</td>
                      <td>{student.averageScore.toFixed(2)}</td>
                      <td className="grade-cell">{student.grade || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {resultData && resultData.length === 0 && (
            <p className="no-data">No positions found for this class</p>
          )}
        </>
      )}

      {/* Subject Positions View */}
      {viewMode === "subject-positions" && (
        <>
          <form className="form" onSubmit={handleViewSubjectPositions}>
            <h2>View Subject Positions</h2>

            <div>
              <label>Class Stream *</label>
              <select
                name="classStreamId"
                value={viewFormData.classStreamId}
                onChange={viewHandleChange}
                required
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
              <label>Subject *</label>
              <select
                name="subjectCode"
                value={viewFormData.subjectCode}
                onChange={viewHandleChange}
                required
                disabled={!viewFormData.classStreamId}
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

            <button type="submit">View Positions</button>
          </form>

          {resultData && resultData.length > 0 && (
            <div className="table-wrapper">
              <h3>Subject Rankings</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Student</th>
                    <th>Admission Number</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((student, index) => (
                    <tr key={index}>
                      <td className="position-cell">{student.position}</td>
                      <td>{student.firstName} {student.lastName}</td>
                      <td>{student.admissionNumber}</td>
                      <td>{student.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {resultData && resultData.length === 0 && (
            <p className="no-data">No positions found for this subject</p>
          )}
        </>
      )}

      {/* Student Rank View */}
      {viewMode === "rank" && (
        <>
          <form className="form" onSubmit={handleViewStudentRank}>
            <h2>View Student Rank</h2>

            <div>
              <label>Student *</label>
              <select
                name="admissionNumber"
                value={viewFormData.admissionNumber}
                onChange={viewHandleChange}
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.admissionNumber}>
                    {student.firstName} {student.lastName} ({student.admissionNumber})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit">View Rank</button>
          </form>

          {resultData && (
            <div className="rank-card">
              <h3>Student Class Position</h3>
              <div className="rank-info">
                <p><strong>Position:</strong> <span className="position-cell">{resultData.position}</span></p>
                <p><strong>Out of:</strong> {resultData.outOf} students</p>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .view-mode-selector {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .view-mode-selector button {
          padding: 12px 24px;
          border: 2px solid #e0e0e0;
          background-color: white;
          cursor: pointer;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          transition: all 0.2s ease;
        }

        .view-mode-selector button:hover {
          border-color: #4CAF50;
          color: #4CAF50;
        }

        .view-mode-selector button.active {
          background-color: #4CAF50;
          color: white;
          border-color: #4CAF50;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        }

        .table-wrapper {
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          margin-top: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .table-wrapper h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        .table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .table th,
        .table td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid #e8e8e8;
        }

        .table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #333;
          position: sticky;
          top: 0;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }

        .table tr:hover {
          background-color: #f8f9fa;
        }

        .table tr:nth-child(even) {
          background-color: #fafbfc;
        }

        .table tr:nth-child(even):hover {
          background-color: #f0f2f5;
        }

        .grade-cell {
          font-weight: 600;
          color: #2196F3;
          padding: 6px 12px;
          border-radius: 4px;
          background-color: #e3f2fd;
        }

        .position-cell {
          font-weight: 700;
          color: #FF9800;
          font-size: 18px;
          padding: 8px 16px;
          border-radius: 20px;
          background-color: #fff3e0;
          display: inline-block;
        }

        .result-card {
          background-color: white;
          padding: 24px;
          border-radius: 12px;
          margin-top: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .result-card h3 {
          margin-top: 24px;
          margin-bottom: 16px;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }

        .result-card h3:first-child {
          margin-top: 0;
        }

        .student-info {
          background-color: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .student-info p {
          margin: 8px 0;
          font-size: 15px;
          color: #555;
        }

        .student-info strong {
          color: #333;
        }

        .overall-performance {
          background-color: #e8f5e9;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #4CAF50;
        }

        .overall-performance p {
          margin: 10px 0;
          font-size: 16px;
          color: #333;
        }

        .overall-performance strong {
          color: #2e7d32;
        }

        .rank-card {
          background-color: white;
          padding: 32px;
          border-radius: 12px;
          margin-top: 24px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .rank-card h3 {
          margin-bottom: 24px;
          color: #333;
          font-size: 20px;
          font-weight: 600;
        }

        .rank-info {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }

        .rank-info p {
          font-size: 20px;
          margin: 0;
          color: #555;
        }

        .rank-info strong {
          color: #333;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: #999;
          font-style: italic;
          font-size: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        form {
          display: grid;
          gap: 16px;
          margin-bottom: 24px;
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        form h2 {
          margin: 0 0 16px 0;
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        form label {
          font-weight: 500;
          color: #555;
          margin-bottom: 6px;
          display: block;
        }

        form input,
        form select {
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
          width: 100%;
        }

        form input:focus,
        form select:focus {
          outline: none;
          border-color: #4CAF50;
        }

        form select:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
          color: #999;
        }

        form button[type="submit"] {
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        }

        form button[type="submit"]:hover {
          background-color: #45a049;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
        }

        form button[type="submit"]:active {
          transform: translateY(0);
        }
      `}</style>
    </>
  );
}
