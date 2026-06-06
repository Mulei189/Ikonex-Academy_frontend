import api from "./api";

export const getAllSubjects = async () => {
  const response = await api.get("/subjects");
  return response.data.data;
};

export const getSubjectByCode = async (subjectCode) => {
  const response = await api.get(`/subjects/code/${subjectCode}`);
  return response.data.data;
};

export const getSubjectsByClassStream = async (classStreamId) => {
  const response = await api.get(`/subjects/class-stream/${classStreamId}`);
  return response.data.data;
};

export const createSubject = async (data) => {
  const response = await api.post("/subjects", data);
  return response.data.data;
};

export const updateSubject = async (subjectCode, data) => {
  const response = await api.patch(`/subjects/code/${subjectCode}`, data);
  return response.data.data;
};

export const deleteSubject = async (subjectCode) => {
  const response = await api.delete(`/subjects/code/${subjectCode}`);
  return response.data.data;
};

export const assignSubjectToClassStream = async (data) => {
  const response = await api.post("/subjects/assign", data);
  return response.data.data;
};
