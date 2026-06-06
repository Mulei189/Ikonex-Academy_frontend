import api from "./api";

export const getAllAssessments = async () => {
  const response = await api.get("/assessments");
  return response.data.data;
};

export const createAssessment = async (data) => {
  const response = await api.post("/assessments", data);
  return response.data.data;
};

export const getAssessmentById = async (id) => {
  const response = await api.get(`/assessments/${id}`);
  return response.data.data;
};

export const updateAssessment = async (id, data) => {
  const response = await api.patch(`/assessments/${id}`, data);
  return response.data.data;
};

export const deleteAssessment = async (id) => {
  const response = await api.delete(`/assessments/${id}`);
  return response.data.data;
};

export const getStudentPerformance = async (admissionNumber) => {
  const response = await api.get(`/assessments/student/${admissionNumber}`);
  return response.data.data;
};

export const getStudentSubjectPerformance = async (admissionNumber, subjectCode) => {
  const response = await api.get(`/assessments/student/${admissionNumber}/${subjectCode}`);
  return response.data.data;
};

export const getClassPerformance = async (classStreamId, subjectCode) => {
  const response = await api.get(`/assessments/class-stream/${classStreamId}/${subjectCode}`);
  return response.data.data;
};

export const getClassPerformanceComparison = async (subjectCode) => {
  const response = await api.get(`/assessments/class-comparison/${subjectCode}`);
  return response.data.data;
};
