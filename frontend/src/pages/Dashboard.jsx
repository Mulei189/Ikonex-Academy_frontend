export default function Dashboard() {
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
          <p>0</p>
        </div>

        <div className="card">
          <h3>Students</h3>
          <p>0</p>
        </div>

        <div className="card">
          <h3>Subjects</h3>
          <p>0</p>
        </div>

        <div className="card">
          <h3>Assessments</h3>
          <p>0</p>
        </div>
      </div>
    </>
  );
}