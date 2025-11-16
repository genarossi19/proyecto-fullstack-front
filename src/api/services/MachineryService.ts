import api from "../../lib/axios";

export const getAllMachineries = async () => {
  const response = await api.get("/machinery");
  return response.data;
};

export const getMachineryById = async (id: number) => {
  const response = await api.get(`/machinery/${id}`);
  return response.data;
};
