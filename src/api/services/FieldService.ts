import api from "../../lib/axios";

export const getAllFields = async () => {
  const response = await api.get("/field");
  return response.data;
};

export const getFieldById = async (id: number) => {
  const response = await api.get(`/field/${id}`);
  return response.data;
};
