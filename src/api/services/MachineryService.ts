import api from "../../lib/axios";

export const getAllMachineries = async () => {
  const response = await api.get("/machinery");
  return response.data;
};
