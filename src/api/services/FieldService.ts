import api from "../../lib/axios";
import type FieldType from "../../types/FieldType";

export const getAllFields = async () => {
  const response = await api.get("/field");
  return response.data;
};

export const getFieldById = async (id: number) => {
  const response = await api.get(`/field/${id}`);
  return response.data;
};

export const createField = async (data: Omit<FieldType, "id">) => {
  const response = await api.post("/field", data);
  return response.data;
};

export const updateField = async (id: number, data: FieldType) => {
  const response = await api.put(`/field/${id}`, data);
  return response.data;
};

export const deleteField = async (id: number) => {
  const response = await api.delete(`/field/${id}`);
  return response.data;
};
