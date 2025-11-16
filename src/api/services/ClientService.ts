import api from "../../lib/axios";

export const getAllClients = async () => {
  const response = await api.get("/client");
  return response.data;
};

export const getClientbyId = async (id: number) => {
  const response = await api.get(`/client/${id}`);
  return response.data;
};
