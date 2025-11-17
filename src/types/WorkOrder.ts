import type { ClientType } from "./ClientType.ts";

export interface WorkOrderType {
  id?: number;
  name?: string;
  created_at: string;
  init_date: string | null;
  finish_date: string | null;
  status: string | null;
  observation: string | null;
  clientId: number;
  fieldId: number;
  serviceId: number;
  price: number | null;
}

export interface MachineryDetailType {
  id?: number;
  workOrderId: number;
  machineryId: number;
}

export interface LotDetailType {
  id?: number;
  workOrderId: number;
  lotId: number;
  area: number;
  lat: number;
  long: number;
}

export interface WorkOrderResponse {
  id: number;
  name: string;
  created_at: string;
  init_date: string;
  finish_date: string;
  status: string;
  observation: string;
  client: ClientType;
  fieldId: number;
  serviceId: number;
  price: number;
  machineryDetails: MachineryDetailType[];
  lotDetails: LotDetailType[];
}
export interface WorkOrderSummaryResponse {
  id: number;
  name: string;
  client: {
    id: number;
    name: string;
    email?: string;
  };
  field: {
    id: number;
    name: string;
    area?: number;
  };
  service: {
    id: number;
    name: string;
  };
  init_date: string | null;
  finish_date: string | null;
  created_at: string;
  status: string | null;
}

export interface WorkOrderDetailResponse {
  id: number;
  name: string;
  created_at: string;
  init_date: string | null;
  finish_date: string | null;
  status: string | null;
  observation: string | null;
  price: number | null;

  client: {
    id: number;
    name: string;
    email?: string;
  };

  field: {
    id: number;
    name: string;
    area: number;
    lat: number;
    long: number;
  };

  service: {
    id: number;
    name: string;
  };

  machineryDetails: {
    id: number;
    machinery: {
      id: number;
      name: string;
      type: string;
      brand: string;
      model: string;
      patent: string;
      status: string;
    };
  }[];

  lotDetails: {
    id: number;
    lot: {
      id: number;
      name: string;
      area: number;
      lat: number;
      long: number;
    };
  }[];
}

export interface WorkOrderCreateRequest {
  clientId: number;
  fieldId: number;
  serviceId: number;

  init_date: string | null;
  finish_date: string | null;

  status: string | null;
  observation: string | null;
  price: number | null;

  machineryDetails: {
    machineryId: number;
  }[];

  lotDetails: {
    lotId: number;
  }[];
}
