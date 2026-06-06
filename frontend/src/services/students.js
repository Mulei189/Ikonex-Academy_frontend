import api from "./api";

export const getAllStudents = async () => {
  const response = await api.get("/students");
  return response.data.data;
};

export const getStudentByAdmissionNumber = async (admissionNumber) => {
  const response = await api.get(
    `/students/admissionNumber/${admissionNumber}`
  );
  return response.data.data;
};

export const getStudentsByClassStream = async (classStreamId) => {
  const response = await api.get(
    `/students/stream/${classStreamId}`
  );
  return response.data.data;
};

export const createStudent = async (data) => {
  const response = await api.post("/students", data);
  return response.data.data;
};

export const updateStudent = async (admissionNumber, data) => {
  const response = await api.patch(
    `/students/admissionNumber/${admissionNumber}`,
    data
  );
  return response.data.data;
};

export const deleteStudent = async (admissionNumber) => {
  const response = await api.delete(
    `/students/admissionNumber/${admissionNumber}`
  );
  return response.data.data;
};
