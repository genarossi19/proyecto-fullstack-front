export default interface WorkOrderType {
  id: number;
  clientId: number;
  fieldId: number;
  serviceId: number;
  created_at: Date;
  init_date: Date;
  finish_date: Date;
  status: string;
  observations: string;
  price: number;
}

export default interface LotDetailType {
  id: number;
  workOrderId: number;
  lotId: number;
  area: number;
  lat: number;
  long: number;
}

export default interface MachineDetailType {
  id: number;
  workOrderId: number;
  machineryId: number;
}
