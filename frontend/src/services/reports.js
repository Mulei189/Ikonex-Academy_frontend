import api from "./api";

export const downloadStudentReport = async (
  admissionNumber
) => {
  const response = await api.get(
    `/reports/student/${admissionNumber}`,
    {
      responseType: "blob",
    }
  );

  return response;
};

export const downloadClassReport = async (
  streamCode
) => {
  const response = await api.get(
    `/reports/class-stream/${streamCode}`,
    {
      responseType: "blob",
    }
  );

  return response;
};