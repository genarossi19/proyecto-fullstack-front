import api from "../../lib/axios";
import type { MachineryType } from "../../types/Machinery";

export const getAllMachineries = async () => {
  const response = await api.get("/machinery");
  return response.data;
};

export const getMachineryById = async (id: number) => {
  const response = await api.get(`/machinery/${id}`);
  return response.data;
};

export const createMachinery = async (data: Omit<MachineryType, "id">) => {
  const response = await api.post("/machinery", data);
  return response.data;
};

export const updateMachinery = async (id: number, data: MachineryType) => {
  const response = await api.put(`/machinery/${id}`, data);
  return response.data;
};

export const deleteMachinery = async (id: number) => {
  const response = await api.delete(`/machinery/${id}`);
  return response.data;
};
