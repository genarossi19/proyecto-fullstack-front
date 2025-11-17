import api from "../../lib/axios";
import type LotType from "../../types/LotType";

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

export const createLot = async (data: Omit<LotType, "id">) => {
  const response = await api.post("/lot", data);
  return response.data;
};

export const updateLot = async (id: number, data: LotType) => {
  const response = await api.put(`/lot/${id}`, data);
  return response.data;
};
