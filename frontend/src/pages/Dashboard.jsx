import { useEffect, useState } from "react";
import { getClassStreams } from "../services/classStreams";
import { getAllStudents } from "../services/students";
import { getAllSubjects } from "../services/subjects";
import { getAllAssessments } from "../services/assessments";

export default function Dashboard() {
  const [stats, setStats] = useState({
    classStreams: 0,
    students: 0,
    subjects: 0,
    assessments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [classStreams, students, subjects, assessments] =
          await Promise.all([
            getClassStreams(),
            getAllStudents(),
            getAllSubjects(),
            getAllAssessments(),
          ]);

        setStats({
          classStreams: classStreams?.length || 0,
          students: students?.length || 0,
          subjects: subjects?.length || 0,
          assessments: assessments?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <h1 className="dashboard">
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <div className="card">
          <h3>Class Streams</h3>
          <p>{loading ? "..." : stats.classStreams}</p>
        </div>

        <div className="card">
          <h3>Students</h3>
          <p>{loading ? "..." : stats.students}</p>
        </div>

        <div className="card">
          <h3>Subjects</h3>
          <p>{loading ? "..." : stats.subjects}</p>
        </div>

        <div className="card">
          <h3>Assessments</h3>
          <p>{loading ? "..." : stats.assessments}</p>
        </div>
      </div>
    </>
  );
}
