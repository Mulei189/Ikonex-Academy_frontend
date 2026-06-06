import api from "./api";

export const getClassStreams = async () => {
  const response = await api.get("/class-streams");
  return response.data.data;
};

export const createClassStream = async (data) => {
  const response = await api.post(
    "/class-streams",
    data
  );

  return response.data;
};

export const deleteClassStream = async (id) => {
  const response = await api.delete(
    `/class-streams/${id}`
  );

  return response.data;
};

export const getClassStreamById = async (id) => {
  const response = await api.get(
    `/class-streams/${id}`
  );

  return response.data.data;
};
