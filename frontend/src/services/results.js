import api from "./api";

export const getStudentResult = async (admissionNumber) => {
  const response = await api.get(`/results/student/${admissionNumber}`);
  return response.data.data;
};

export const getStudentRank = async (admissionNumber) => {
  const response = await api.get(`/results/rank/${admissionNumber}`);
  return response.data.data;
};

export const getClassResults = async (classStreamId) => {
  const response = await api.get(`/results/class-stream/${classStreamId}`);
  return response.data.data;
};

export const getClassPositions = async (classStreamId) => {
  const response = await api.get(`/results/class-stream/${classStreamId}/positions`);
  return response.data.data;
};

export const getSubjectPositions = async (classStreamId, subjectCode) => {
  const response = await api.get(`/results/class-stream/${classStreamId}/subject/${subjectCode}`);
  return response.data.data;
};
