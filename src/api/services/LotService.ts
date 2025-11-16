import api from "../../lib/axios";

export const getAllLots = async () => {
  const response = await api.get("/lot");
  return response.data;
};

export const getLotById = async (id: number) => {
  const response = await api.get(`/lot/${id}`);
  return response.data;
};

export const deleteLot = async (id: number) => {
  const response = await api.delete(`/lot/${id}`);
  return response.data;
};
