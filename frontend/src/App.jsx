import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import ClassStreams from "./pages/ClassStreams";
import Students from "./pages/Students";
import Subjects from "./pages/Subjects";
import Assessments from "./pages/Assessments";
import Results from "./pages/Results";
import Reports from "./pages/Reports";
import ClassStreamDetails from "./pages/classStreamDetails";

export default function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/class-streams" element={<ClassStreams />} />
          <Route path="/students" element={<Students />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/results" element={<Results />} />
          <Route path="/class-streams/:id" element={<ClassStreamDetails />}/>
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
}