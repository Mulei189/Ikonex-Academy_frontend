import { useState } from "react";

import {
  downloadStudentReport,
  downloadClassReport,
} from "../services/reports";

export default function Reports() {
  const [
    admissionNumber,
    setAdmissionNumber,
  ] = useState("");

  const [streamCode, setStreamCode] =
    useState("");

  const handleStudentReport =
    async () => {
      try {
        const response =
          await downloadStudentReport(
            admissionNumber
          );

        const url =
          window.URL.createObjectURL(
            new Blob([response.data])
          );

        const link =
          document.createElement("a");

        link.href = url;

        link.setAttribute(
          "download",
          `${admissionNumber}-report-card.pdf`
        );

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();
      } catch (error) {
        console.error(error);

        const errorMessage = error?.response?.data?.message || error?.message || "Failed to generate student report";
        alert(errorMessage);
      }
    };

  const handleClassReport =
    async () => {
      try {
        const response =
          await downloadClassReport(
            streamCode
          );

        const url =
          window.URL.createObjectURL(
            new Blob([response.data])
          );

        const link =
          document.createElement("a");

        link.href = url;

        link.setAttribute(
          "download",
          `${streamCode}-class-report.pdf`
        );

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();
      } catch (error) {
        console.error(error);

        const errorMessage = error?.response?.data?.message || error?.message || "Failed to generate class report";
        alert(errorMessage);
      }
    };

  return (
    <div>
      <h1 className="page-title">
        Reports
      </h1>

      <div className="report-card">
        <h2>
          Student Report Card
        </h2>

        <input
          type="text"
          placeholder="ADM001"
          value={admissionNumber}
          onChange={(e) =>
            setAdmissionNumber(
              e.target.value
            )
          }
        />

        <button
          onClick={
            handleStudentReport
          }
        >
          Generate PDF
        </button>
      </div>

      <div className="report-card">
        <h2>
          Class Performance Report
        </h2>

        <input
          type="text"
          placeholder="F1A"
          value={streamCode}
          onChange={(e) =>
            setStreamCode(
              e.target.value
            )
          }
        />

        <button
          onClick={handleClassReport}
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
}