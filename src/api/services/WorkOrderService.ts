import api from "../../lib/axios";

import type {
  WorkOrderDetailResponse,
  WorkOrderSummaryResponse,
  WorkOrderType,
} from "../../types/WorkOrder";
export const getAllWorkOrders = async (): Promise<
  WorkOrderSummaryResponse[]
> => {
  const response = await api.get("/workorders");
  return response.data;
};

export const getWorkOrder = async (
  id: number
): Promise<WorkOrderDetailResponse> => {
  const response = await api.get(`/workorders/${id}`);
  return response.data;
};

export const deleteWorkOrder = async (id: number) => {
  const response = await api.delete(`/workorders/${id}`);
  return response.data;
};

export const updateWorkOrder = async (id: number, data: WorkOrderType) => {
  const response = await api.put(`/workorders/${id}`, data);
  return response.data;
};

export const createWorkOrder = async (data: Omit<WorkOrderType, "id">) => {
  const response = await api.post("/workorders", data);
  return response.data;
};
