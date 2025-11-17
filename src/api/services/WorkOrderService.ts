import api from "../../lib/axios";

import type {
  WorkOrderCreateRequest,
  WorkOrderDetailResponse,
  WorkOrderSummaryResponse,
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
  return response.data as WorkOrderDetailResponse;
};

export const deleteWorkOrder = async (id: number): Promise<void> => {
  await api.delete(`/workorders/${id}`);
};

export const updateWorkOrder = async (
  id: number,
  data: Partial<WorkOrderCreateRequest>
): Promise<WorkOrderDetailResponse> => {
  const response = await api.put(`/workorders/${id}`, data);
  return response.data as WorkOrderDetailResponse;
};

export const createWorkOrder = async (
  data: WorkOrderCreateRequest
): Promise<WorkOrderDetailResponse> => {
  const response = await api.post("/workorders", data);
  return response.data as WorkOrderDetailResponse;
};
