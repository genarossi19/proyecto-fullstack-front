export interface ClientType {
  id: number;
  name: string;
  cuit: number;
  active: boolean;
  email: string;
  phone: string;
  address: string;
}

export interface ClientDetail {
  id: number;
  name: string;
  cuit: number;
  active: boolean;
  email: string;
  phone: string;
  address: string;
  fields: {
    id: number;
    name: string;
    area: number;
    lat: number;
    long: number;
    active: boolean;
  };
}
