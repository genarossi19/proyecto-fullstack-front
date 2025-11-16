export default interface LotType {
  id: number;
  name: string;
  area: number;
  lat: number;
  long: number;
  active: boolean;
  fieldId: number;
}

export interface LotResponse {
  id: number;
  name: string;
  area: number;
  lat: number;
  long: number;
  field: {
    id: number;
    name: string;
    client: {
      id: number;
      name: string;
    };
  };
}
