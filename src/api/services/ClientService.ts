import api from "../../lib/axios";
import type { ClientType } from "../../types/ClientType";

export const getAllClients = async () => {
  const response = await api.get("/client");
  return response.data;
};

export const getClientbyId = async (id: number) => {
  const response = await api.get(`/client/${id}`);
  return response.data;
};

export const createClient = async (data: Omit<ClientType, "id">) => {
  const response = await api.post("/client", data);
  return response.data;
};

export const updateClient = async (id: number, data: ClientType) => {
  const response = await api.put(`/client/${id}`, data);
  return response.data;
};

export const deleteClient = async (id: number) => {
  const response = await api.delete(`/client/${id}`);
  return response.data;
};
